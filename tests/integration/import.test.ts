/**
 * Creates a brand-new throwaway database next to TEST_DATABASE_URL, applies migrations, runs the
 * role seed and the legacy importer, checks totals against the legacy source and idempotency, then
 * drops the database it created. No existing database is modified.
 *   TEST_DATABASE_URL=postgresql://user:pass@localhost:5432/postgres npm test
 * (the role needs CREATEDB; the database in the URL is only used to issue CREATE/DROP DATABASE)
 */
import { execFileSync } from "node:child_process";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const adminUrl = process.env.TEST_DATABASE_URL;
const dbName = `cci_it_${Date.now()}`;
const url = adminUrl ? adminUrl.replace(/\/[^/?]+(\?|$)/, `/${dbName}$1`) : "";
const run = (args: string[]) =>
  execFileSync("npx", args, { env: { ...process.env, DATABASE_URL: url, SITE_ENV: "development" }, encoding: "utf8", stdio: "pipe" });

async function admin(sql: string) {
  const client = new pg.Client({ connectionString: adminUrl });
  await client.connect();
  try {
    await client.query(sql);
  } finally {
    await client.end();
  }
}

describe.skipIf(!adminUrl)("legacy import (integration)", () => {
  let db: PrismaClient;

  beforeAll(async () => {
    await admin(`CREATE DATABASE "${dbName}"`);
    run(["prisma", "migrate", "deploy"]);
    run(["tsx", "prisma/seed.ts"]);
    run(["tsx", "scripts/import-legacy-content/index.ts", "--skip-media", "--only=settings,pages,events,news,press,publications,awards,people,crafts"]);
    db = new PrismaClient({ adapter: new PrismaPg({ connectionString: url! }) });
  });

  afterAll(async () => {
    await db?.$disconnect();
    if (adminUrl) await admin(`DROP DATABASE IF EXISTS "${dbName}"`); // only the database this test created
  });

  it("imports every legacy record", async () => {
    expect(await db.event.count({ where: { collection: "CURRENT" } })).toBe(43);
    expect(await db.event.count({ where: { collection: "ARCHIVE" } })).toBe(73);
    expect(await db.newsArticle.count()).toBe(7);
    expect(await db.pressItem.count()).toBe(12);
    expect(await db.publication.count()).toBe(82);
    expect(await db.awardRecipient.count()).toBe(128);
    expect(await db.awardCategory.count()).toBe(6);
    expect(await db.artisan.count()).toBe(7);
    expect(await db.teamMember.count()).toBe(24);
    expect(await db.stateCouncil.count()).toBe(11);
    expect(await db.craftState.count()).toBe(34);
    expect(await db.craftLocation.count()).toBe(1226);
    expect(await db.craftProcess.count()).toBe(16);
    expect(await db.page.count()).toBe(20);
    expect(await db.role.count()).toBe(7);
    expect(await db.user.count()).toBe(0); // the importer and seed never create accounts
  });

  it("parses a start date for every event", async () => {
    expect(await db.event.count({ where: { startDate: null } })).toBe(0);
  });

  it("publishes imported content so the site renders it", async () => {
    expect(await db.event.count({ where: { status: { not: "PUBLISHED" } } })).toBe(0);
    expect(await db.page.count({ where: { status: { not: "PUBLISHED" } } })).toBe(0);
  });

  it("keeps legacy identifiers for traceability and redirects", async () => {
    const e = await db.event.findUnique({ where: { slug: "ugadi-celebrations-with-andhra-food" } });
    expect(e?.sourceLink).toBe("https://www.craftscouncilofindia.in/event/ugadi-celebrations-with-andhra-food/");
    const n = await db.newsArticle.findUnique({ where: { legacyId: "A-Symposium-on-The-Future-of-Handmade" } });
    expect(n?.slug).toBe("a-symposium-on-the-future-of-handmade");
  });

  it("is idempotent and never overwrites CMS edits", async () => {
    await db.event.update({ where: { slug: "kamala-awards-2025" }, data: { title: "Edited in CMS" } });
    const out = run(["tsx", "scripts/import-legacy-content/index.ts", "--skip-media", "--only=events"]);
    expect(out).toContain("matched");
    expect(await db.event.count()).toBe(116);
    expect((await db.event.findUnique({ where: { slug: "kamala-awards-2025" } }))?.title).toBe("Edited in CMS");
  });
});
