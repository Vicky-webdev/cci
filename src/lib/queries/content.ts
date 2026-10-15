import "server-only";
import { cache } from "react";
import { db } from "@/lib/db";
import { publishedWhere } from "@/lib/content/publishing";
import { todayInIndia } from "@/lib/dates";
import type { PublicationKind } from "@/generated/prisma/enums";

// ── Events ──────────────────────────────────────────────

export const listEvents = cache((collection: "CURRENT" | "ARCHIVE") =>
  db.event.findMany({
    where: { collection, ...publishedWhere() },
    orderBy: [{ startDate: { sort: "desc", nulls: "last" } }, { sortOrder: "asc" }],
  }),
);

/** Home grid: current events whose start date is today or later, nearest first. */
export function upcomingEvents(limit: number) {
  return db.event.findMany({
    where: { collection: "CURRENT", startDate: { gte: todayInIndia() }, ...publishedWhere() },
    orderBy: [{ startDate: "asc" }, { sortOrder: "asc" }],
    take: limit,
  });
}

export const getEvent = cache(async (slug: string) =>
  db.event.findFirst({ where: { slug, ...publishedWhere() } }),
);

/** Resolves old ?id= values (case-insensitive) to the canonical slug, for redirects. */
export async function findEventSlugByLegacyId(id: string) {
  const e = await db.event.findFirst({
    where: { legacyId: { equals: id, mode: "insensitive" }, ...publishedWhere() },
    select: { slug: true },
  });
  return e?.slug ?? null;
}

export function getEventsBySlugs(slugs: string[]) {
  if (!slugs.length) return Promise.resolve([]);
  return db.event.findMany({ where: { slug: { in: slugs }, ...publishedWhere() } });
}

// ── News ────────────────────────────────────────────────

export const listNews = cache(() =>
  db.newsArticle.findMany({ where: publishedWhere(), orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] }),
);

export const getNews = cache(async (slug: string) => db.newsArticle.findFirst({ where: { slug, ...publishedWhere() } }));

export async function findNewsSlugByLegacyId(id: string) {
  const n = await db.newsArticle.findFirst({
    where: { legacyId: { equals: id, mode: "insensitive" }, ...publishedWhere() },
    select: { slug: true },
  });
  return n?.slug ?? null;
}

// ── Press ───────────────────────────────────────────────

export const listPress = cache(() =>
  db.pressItem.findMany({ where: publishedWhere(), orderBy: [{ sortOrder: "asc" }] }),
);

export const getPress = cache(async (slug: string) =>
  db.pressItem.findFirst({
    where: { slug, ...publishedWhere() },
    include: { groups: { orderBy: { sortOrder: "asc" } } },
  }),
);

export async function findPressSlugByLegacyId(id: string) {
  const p = await db.pressItem.findFirst({
    where: { legacyId: { equals: id, mode: "insensitive" }, ...publishedWhere() },
    select: { slug: true },
  });
  return p?.slug ?? null;
}

// ── Publications ────────────────────────────────────────

export function listPublications(kind: PublicationKind, archived: boolean) {
  return db.publication.findMany({
    where: { kind, isArchived: archived, ...publishedWhere() },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
}

// ── Awards & people ─────────────────────────────────────

export const listAwardCategories = cache(() =>
  db.awardCategory.findMany({ where: { isPublished: true }, orderBy: { sortOrder: "asc" } }),
);

export const listFeaturedAwardees = cache(() =>
  db.awardRecipient.findMany({ where: { isPublished: true, isFeatured: true }, orderBy: { sortOrder: "asc" } }),
);

export async function listAwardTables(listing: string) {
  const rows = await db.awardRecipient.findMany({
    where: { isPublished: true, isFeatured: false, listing },
    orderBy: [{ sortOrder: "asc" }],
  });
  const years = [...new Set(rows.map((r) => r.year))].sort((a, b) => b.localeCompare(a, undefined, { numeric: true }));
  return years.map((year) => ({ year, rows: rows.filter((r) => r.year === year) }));
}

export const listArtisans = cache(() =>
  db.artisan.findMany({ where: { isPublished: true }, orderBy: { sortOrder: "asc" } }),
);

export const listTeam = cache(() =>
  db.teamMember.findMany({ where: { isPublished: true }, orderBy: [{ group: "asc" }, { sortOrder: "asc" }] }),
);

export const listCouncils = cache(() =>
  db.stateCouncil.findMany({ where: { isPublished: true }, orderBy: { sortOrder: "asc" } }),
);

// ── Crafts ──────────────────────────────────────────────

export const listCraftStates = cache(() =>
  db.craftState.findMany({
    where: { isPublished: true },
    orderBy: { sortOrder: "asc" },
    include: { locations: { orderBy: { sortOrder: "asc" } }, images: { orderBy: { sortOrder: "asc" } } },
  }),
);

export const listProcesses = cache(() =>
  db.craftProcess.findMany({ where: { isPublished: true }, orderBy: { sortOrder: "asc" } }),
);
