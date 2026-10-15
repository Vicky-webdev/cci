/**
 * Legacy content import.
 *
 *   npm run import:legacy                 # create anything missing; never touch existing rows
 *   npm run import:legacy -- --dry-run    # parse + report only, no writes
 *   npm run import:legacy -- --refresh    # DEV ONLY: overwrite imported rows from the legacy source
 *   npm run import:legacy -- --only=events,news
 *   npm run import:legacy -- --skip-media # skip the (slow) media library scan
 *
 * Every record is keyed by its legacy identifier, so re-running is safe (idempotent).
 * Each content type is written in its own transaction. A JSON log and the Markdown
 * reconciliation report are written to docs/migration/.
 */
import fs from "node:fs";
import path from "node:path";
import { Prisma } from "../../src/generated/prisma/client";
import { SETTINGS_SCHEMA } from "../../src/lib/settings-schema";
import { createScriptClient } from "../lib/db";
import { loadLegacyData } from "./legacy";
import { mapEvent, mapNews, mapPress } from "./map-events";
import { parseCraftStates, mapProcesses } from "./map-crafts";
import { parseArtisans, parseAwardCategories, parseAwardRecipients, parseCouncils, parsePublications, parseTeam } from "./map-html";
import { scanLegacyMedia } from "./map-media";
import { buildPages } from "./map-pages";
import { parseFooterMenus, parseMainMenu, verifySettingDefaults, type MenuNode } from "./map-site";
import { ImportReport } from "./report";

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const refresh = args.includes("--refresh");
const skipMedia = args.includes("--skip-media");
const only = args.find((a) => a.startsWith("--only="))?.slice(7).split(",");
const want = (t: string) => !only || only.includes(t);

if (refresh && process.env.SITE_ENV === "production" && !args.includes("--i-know-this-overwrites-production")) {
  console.error("Refusing --refresh with SITE_ENV=production: it would overwrite CMS edits with legacy data.");
  process.exit(1);
}

const db = createScriptClient();
const report = new ImportReport();
const now = new Date();
const published = { status: "PUBLISHED" as const, publishedAt: now };
const json = (v: unknown) => v as Prisma.InputJsonValue;

async function upsertBy<T>(
  type: string,
  key: string,
  find: () => Promise<{ id: string } | null>,
  create: () => Promise<unknown>,
  update: (id: string) => Promise<unknown>,
): Promise<void> {
  report.discovered(type);
  if (dryRun) return void report.outcome(type, "skipped");
  const existing = await find();
  if (!existing) {
    await create();
    report.outcome(type, "created");
  } else if (refresh) {
    await update(existing.id);
    report.outcome(type, "updated");
  } else {
    report.outcome(type, "matched");
  }
  void key;
}

async function importEvents() {
  const data = loadLegacyData();
  const records = [
    ...data.EVENTS.map((e, i) => mapEvent(e, i, "CURRENT", report)),
    ...data.PAST_EVENTS.map((e, i) => mapEvent(e, i, "ARCHIVE", report)),
  ];
  const seen = new Set<string>();
  await db.$transaction(
    async (tx) => {
      for (const r of records) {
        if (seen.has(r.slug)) {
          report.discovered("events");
          report.outcome("events", "duplicate");
          report.issue("events", r.legacyId, "error", `Slug "${r.slug}" already used by another legacy event — not imported`);
          continue;
        }
        seen.add(r.slug);
        const data = {
          ...r,
          highlights: json(r.highlights),
          schedule: json(r.schedule),
          people: json(r.people),
          extra: json(r.extra),
        };
        await upsertBy(
          "events",
          r.legacyId,
          () => tx.event.findUnique({ where: { legacyId: r.legacyId }, select: { id: true } }),
          () => tx.event.create({ data: { ...data, ...published } }),
          (id) => tx.event.update({ where: { id }, data }),
        );
      }
    },
    { timeout: 120_000 },
  );
}

async function importNews() {
  const records = loadLegacyData().NEWS.map((n, i) => mapNews(n, i, report));
  await db.$transaction(async (tx) => {
    for (const r of records) {
      const data = { ...r, gallery: json(r.gallery) };
      await upsertBy(
        "news",
        r.legacyId,
        () => tx.newsArticle.findUnique({ where: { legacyId: r.legacyId }, select: { id: true } }),
        () => tx.newsArticle.create({ data: { ...data, ...published } }),
        (id) => tx.newsArticle.update({ where: { id }, data }),
      );
    }
  });
}

async function importPress() {
  const records = loadLegacyData().PRESS.map((p, i) => mapPress(p, i, report));
  await db.$transaction(async (tx) => {
    for (const { groups, ...r } of records) {
      await upsertBy(
        "press",
        r.legacyId,
        () => tx.pressItem.findUnique({ where: { legacyId: r.legacyId }, select: { id: true } }),
        () => tx.pressItem.create({ data: { ...r, ...published, groups: { create: groups } } }),
        async (id) => {
          await tx.pressGroup.deleteMany({ where: { pressItemId: id } });
          await tx.pressItem.update({ where: { id }, data: { ...r, groups: { create: groups } } });
        },
      );
    }
  });
}

async function importPublications() {
  const records = parsePublications(report);
  await db.$transaction(async (tx) => {
    for (const r of records) {
      await upsertBy(
        "publications",
        r.legacyKey,
        () => tx.publication.findUnique({ where: { legacyKey: r.legacyKey }, select: { id: true } }),
        () => tx.publication.create({ data: { ...r, ...published } }),
        (id) => tx.publication.update({ where: { id }, data: r }),
      );
    }
  });
}

async function importAwards() {
  const categories = parseAwardCategories();
  const recipients = parseAwardRecipients(report);
  await db.$transaction(async (tx) => {
    report.discovered("awardCategories", categories.length);
    const existing = await tx.awardCategory.count();
    if (dryRun) report.outcome("awardCategories", "skipped", categories.length);
    else if (existing && !refresh) report.outcome("awardCategories", "matched", categories.length);
    else {
      await tx.awardCategory.deleteMany();
      await tx.awardCategory.createMany({ data: categories });
      report.outcome("awardCategories", existing ? "updated" : "created", categories.length);
    }
    for (const r of recipients) {
      await upsertBy(
        "awards",
        r.legacyKey,
        () => tx.awardRecipient.findUnique({ where: { legacyKey: r.legacyKey }, select: { id: true } }),
        () => tx.awardRecipient.create({ data: r }),
        (id) => tx.awardRecipient.update({ where: { id }, data: r }),
      );
    }
  });
}

async function importPeople() {
  const artisans = parseArtisans(report);
  const team = parseTeam();
  const councils = parseCouncils(report);
  await db.$transaction(async (tx) => {
    for (const a of artisans) {
      // discovered() for artisans is counted while parsing (loop duplicates included)
      if (dryRun) {
        report.outcome("artisans", "skipped");
        continue;
      }
      const found = await tx.artisan.findUnique({ where: { legacyKey: a.legacyKey }, select: { id: true } });
      if (!found) {
        await tx.artisan.create({ data: a });
        report.outcome("artisans", "created");
      } else if (refresh) {
        await tx.artisan.update({ where: { id: found.id }, data: a });
        report.outcome("artisans", "updated");
      } else report.outcome("artisans", "matched");
    }
    for (const t of team) {
      await upsertBy(
        "team",
        t.legacyKey,
        () => tx.teamMember.findUnique({ where: { legacyKey: t.legacyKey }, select: { id: true } }),
        () => tx.teamMember.create({ data: t }),
        (id) => tx.teamMember.update({ where: { id }, data: t }),
      );
    }
    for (const c of councils) {
      await upsertBy(
        "councils",
        c.legacyKey,
        () => tx.stateCouncil.findUnique({ where: { legacyKey: c.legacyKey }, select: { id: true } }),
        () => tx.stateCouncil.create({ data: c }),
        (id) => tx.stateCouncil.update({ where: { id }, data: c }),
      );
    }
  });
}

async function importCrafts() {
  const states = parseCraftStates(report);
  const processes = mapProcesses(loadLegacyData().PROCESSES, report);
  await db.$transaction(
    async (tx) => {
      for (const { locations, images, ...s } of states) {
        const write = { locations: { create: locations }, images: { create: images.map((src, i) => ({ src, sortOrder: i })) } };
        // discovered() counted while parsing (one per source record)
        if (dryRun) {
          report.outcome("craftStates", "skipped");
          continue;
        }
        const found = await tx.craftState.findUnique({ where: { code: s.code }, select: { id: true } });
        if (!found) {
          await tx.craftState.create({ data: { ...s, ...write } });
          report.outcome("craftStates", "created");
        } else if (refresh) {
          await tx.craftLocation.deleteMany({ where: { stateId: found.id } });
          await tx.craftStateImage.deleteMany({ where: { stateId: found.id } });
          await tx.craftState.update({ where: { id: found.id }, data: { ...s, ...write } });
          report.outcome("craftStates", "updated");
        } else report.outcome("craftStates", "matched");
      }
      report.discovered("craftLocations", states.reduce((n, s) => n + s.locations.length, 0));
      for (const p of processes) {
        const data = { ...p, steps: json(p.steps) };
        await upsertBy(
          "processes",
          p.slug,
          () => tx.craftProcess.findUnique({ where: { slug: p.slug }, select: { id: true } }),
          () => tx.craftProcess.create({ data }),
          (id) => tx.craftProcess.update({ where: { id }, data }),
        );
      }
    },
    { timeout: 120_000 },
  );
}

async function importPages() {
  const pages = buildPages();
  await db.$transaction(async (tx) => {
    for (const p of pages) {
      const data = { ...p, sections: json(p.sections) };
      await upsertBy(
        "pages",
        p.slug,
        () => tx.page.findUnique({ where: { slug: p.slug }, select: { id: true } }),
        () => tx.page.create({ data: { ...data, ...published } }),
        (id) => tx.page.update({ where: { id }, data }),
      );
    }
  });
}

async function importMenusAndSettings() {
  const menus: Record<string, MenuNode[]> = { main: parseMainMenu(), ...parseFooterMenus() };
  const defaults = SETTINGS_SCHEMA.parse({});
  verifySettingDefaults(defaults as unknown as Record<string, unknown>, report);
  await db.$transaction(async (tx) => {
    for (const [menu, nodes] of Object.entries(menus)) {
      const count = nodes.reduce((n, x) => n + 1 + x.children.length, 0);
      report.discovered("menuItems", count);
      if (dryRun) {
        report.outcome("menuItems", "skipped", count);
        continue;
      }
      const existing = await tx.menuItem.count({ where: { menu } });
      if (existing && !refresh) {
        report.outcome("menuItems", "matched", count);
        continue;
      }
      await tx.menuItem.deleteMany({ where: { menu } });
      for (const [i, n] of nodes.entries()) {
        const parent = await tx.menuItem.create({
          data: { menu, label: n.label, href: n.href, openInNewTab: n.openInNewTab, sortOrder: i },
        });
        for (const [ci, c] of n.children.entries()) {
          await tx.menuItem.create({
            data: { menu, label: c.label, href: c.href, openInNewTab: c.openInNewTab, sortOrder: ci, parentId: parent.id },
          });
        }
      }
      report.outcome("menuItems", existing ? "updated" : "created", count);
    }
    for (const [key, value] of Object.entries(defaults)) {
      report.discovered("settings");
      if (dryRun) {
        report.outcome("settings", "skipped");
        continue;
      }
      const found = await tx.siteSetting.findUnique({ where: { key } });
      if (!found) {
        await tx.siteSetting.create({ data: { key, value: json(value) } });
        report.outcome("settings", "created");
      } else if (refresh) {
        await tx.siteSetting.update({ where: { key }, data: { value: json(value) } });
        report.outcome("settings", "updated");
      } else report.outcome("settings", "matched");
    }
  });
}

async function importMedia() {
  console.log("Scanning legacy media (images/, docs/)…");
  const files = await scanLegacyMedia((n) => console.log(`  …${n} files`));
  report.discovered("media", files.length);
  if (dryRun) return void report.outcome("media", "skipped", files.length);
  const existing = new Set((await db.media.findMany({ select: { path: true } })).map((m) => m.path));
  const fresh = files.filter((f) => !existing.has(f.path));
  report.outcome("media", "matched", files.length - fresh.length);
  for (let i = 0; i < fresh.length; i += 500) {
    await db.media.createMany({ data: fresh.slice(i, i + 500).map((f) => ({ ...f, storage: "LEGACY" as const })), skipDuplicates: true });
  }
  report.outcome("media", "created", fresh.length);
  const bySha = new Map<string, string[]>();
  for (const f of files) bySha.set(f.sha1, [...(bySha.get(f.sha1) ?? []), f.path]);
  const dupGroups = [...bySha.values()].filter((g) => g.length > 1);
  if (dupGroups.length) {
    report.issue("media", "duplicates", "info", `${dupGroups.length} groups of byte-identical files (${dupGroups.reduce((n, g) => n + g.length - 1, 0)} redundant copies) — all kept; see ASSET_MANIFEST.csv`);
  }
}

async function main() {
  const startedAt = new Date();
  const steps: [string, () => Promise<void>][] = [
    ["settings", importMenusAndSettings],
    ["pages", importPages],
    ["events", importEvents],
    ["news", importNews],
    ["press", importPress],
    ["publications", importPublications],
    ["awards", importAwards],
    ["people", importPeople],
    ["crafts", importCrafts],
    ["media", importMedia],
  ];
  for (const [name, fn] of steps) {
    if (!want(name) || (name === "media" && skipMedia)) continue;
    console.log(`▶ ${name}`);
    await fn();
  }
  const finishedAt = new Date();
  const outDir = path.resolve("docs/migration");
  const mode = refresh ? "refresh (overwrite)" : "create-missing";
  fs.writeFileSync(path.join(outDir, "import-log.json"), JSON.stringify({ startedAt, finishedAt, mode, dryRun, only, ...report.toJSON() }, null, 2));
  if (!only) fs.writeFileSync(path.join(outDir, "RECONCILIATION_REPORT.md"), report.toMarkdown({ startedAt, finishedAt, mode, dryRun }));
  console.table(Object.fromEntries(report.counts));
  const errors = report.issues.filter((i) => i.severity === "error").length;
  console.log(`Issues: ${report.issues.length} (${errors} errors). Report: docs/migration/RECONCILIATION_REPORT.md`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
