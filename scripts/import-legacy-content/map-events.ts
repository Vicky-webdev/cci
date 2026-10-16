import { parseDateRange } from "../../src/lib/dates";
import { rewriteHtmlLinks, slugifyId } from "../../src/lib/links";
import { sanitizeInline, sanitizeRichText } from "../../src/lib/sanitize";
import { assetPath, legacyFileExists } from "./legacy";
import type { ImportReport } from "./report";

type Raw = Record<string, unknown>;
const str = (v: unknown) => (typeof v === "string" ? v : v == null ? "" : String(v));
const arr = <T = unknown>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);

export const toSlug = slugifyId;

/** Legacy events.js renderEvent() wrapped every description entry in <p>. */
export const paragraphsToHtml = (paras: unknown[]) =>
  rewriteHtmlLinks(paras.map((p) => `<p>${sanitizeInlineOrBlock(str(p))}</p>`).join(""));

function sanitizeInlineOrBlock(html: string) {
  // Paragraph bodies may hold inline markup (<em>, <a>, <strong>); keep it, strip anything else.
  return /<(div|iframe|h[1-6]|ul|ol|table|img|video)\b/i.test(html) ? sanitizeRichText(html) : sanitizeInline(html);
}

export function checkAsset(report: ImportReport, type: string, key: string, ref: string, field: string) {
  if (!ref) return;
  if (/^https?:\/\//i.test(ref)) return;
  if (!legacyFileExists(ref)) report.issue(type, key, "warning", `Missing file for ${field}: ${ref}`);
}

export interface EventRecord {
  legacyId: string;
  slug: string;
  sourceLink: string | null;
  collection: "CURRENT" | "ARCHIVE";
  type: string;
  title: string;
  subtitle: string;
  dateText: string;
  startDate: Date | null;
  endDate: Date | null;
  timeText: string;
  venue: string;
  city: string;
  address: string;
  mapLink: string;
  entryFee: string;
  ticketPrice: string;
  ageGroup: string;
  parking: string;
  contact: string[];
  registrationUrl: string;
  pdfUrl: string;
  image: string;
  heroGradient: string;
  heroEmoji: string;
  tagLabel: string;
  tagClass: string;
  legacyStatus: string;
  descriptionHtml: string;
  writeupHtml: string;
  highlights: { icon: string; title: string; text: string }[];
  schedule: { time: string; title: string; desc: string }[];
  people: { initials: string; name: string; role: string; color: string }[];
  gallery: string[];
  relatedSlugs: string[];
  extra: Record<string, unknown>;
  sortOrder: number;
}

const KNOWN = new Set([
  "id", "source_link", "type", "title", "subtitle", "dates", "time", "venue", "city", "address", "mapLink",
  "entryFee", "ticketPrice", "ageGroup", "parking", "contact", "registration", "pdf", "image", "heroGradient",
  "heroEmoji", "tagLabel", "tagClass", "status", "description", "eventWriteup", "highlights", "schedule",
  "people", "gallery", "related",
]);

export function mapEvent(raw: Raw, index: number, collection: "CURRENT" | "ARCHIVE", report: ImportReport): EventRecord {
  const legacyId = str(raw.id);
  const key = `${collection}:${legacyId}`;
  const dateText = str(raw.dates);
  const range = parseDateRange(dateText);
  if (!range) report.issue("events", key, "warning", `Could not parse date "${dateText}" — event has no start date and sorts last`);

  const image = assetPath(str(raw.image));
  checkAsset(report, "events", key, image, "image");
  const gallery = arr(raw.gallery).map((g) => assetPath(str(g))).filter(Boolean);
  gallery.forEach((g) => checkAsset(report, "events", key, g, "gallery"));
  const pdfUrl = assetPath(str(raw.pdf));
  checkAsset(report, "events", key, pdfUrl, "pdf");

  const extra: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(raw)) if (!KNOWN.has(k)) extra[k] = v;
  if (Object.keys(extra).length) {
    report.issue("events", key, "info", `Stored but not displayed (legacy renderer ignored them): ${Object.keys(extra).join(", ")}`);
  }
  const registrationUrl = str(raw.registration);
  if (/your-registration-link|forms\.google\.com\/thari|example\.com/i.test(registrationUrl)) {
    report.issue("events", key, "warning", `Placeholder registration link kept as-is: ${registrationUrl}`);
  }

  return {
    legacyId,
    slug: toSlug(legacyId),
    sourceLink: raw.source_link ? str(raw.source_link) : null,
    collection,
    type: str(raw.type) || "event",
    title: str(raw.title),
    subtitle: str(raw.subtitle),
    dateText,
    startDate: range?.start ?? null,
    endDate: range?.end ?? null,
    timeText: str(raw.time),
    venue: str(raw.venue),
    city: str(raw.city),
    address: str(raw.address),
    mapLink: str(raw.mapLink),
    entryFee: str(raw.entryFee),
    ticketPrice: str(raw.ticketPrice),
    ageGroup: str(raw.ageGroup),
    parking: str(raw.parking),
    contact: arr(raw.contact).map(str),
    registrationUrl,
    pdfUrl,
    image,
    heroGradient: str(raw.heroGradient),
    heroEmoji: str(raw.heroEmoji),
    tagLabel: str(raw.tagLabel),
    tagClass: str(raw.tagClass),
    legacyStatus: str(raw.status),
    descriptionHtml: paragraphsToHtml(arr(raw.description)),
    writeupHtml: paragraphsToHtml(arr(raw.eventWriteup)),
    highlights: arr<Raw>(raw.highlights).map((h) => ({ icon: str(h.icon), title: str(h.title), text: str(h.text) })),
    schedule: arr<Raw>(raw.schedule).map((s) => ({ time: str(s.time), title: str(s.title), desc: str(s.desc) })),
    people: arr<Raw>(raw.people).map((p) => ({ initials: str(p.initials), name: str(p.name), role: str(p.role), color: str(p.color) })),
    gallery,
    relatedSlugs: arr(raw.related).map((r) => toSlug(str(r))),
    extra,
    sortOrder: index,
  };
}

export interface NewsRecord {
  legacyId: string;
  slug: string;
  type: string;
  title: string;
  subtitle: string;
  dateText: string;
  venue: string;
  city: string;
  image: string;
  heroGradient: string;
  heroEmoji: string;
  tagLabel: string;
  tagClass: string;
  bodyHtml: string;
  gallery: ({ type: "image"; src: string } | { type: "youtube"; url: string })[];
  sortOrder: number;
}

/** news.js renderNews(): entries containing block markup are emitted raw, others wrapped in <p>. */
export function newsBodyHtml(paras: unknown[]): string {
  return rewriteHtmlLinks(paras
    .map((p) => {
      const s = str(p);
      return /<(div|iframe|img|a|h1|h2|h3)\b/i.test(s) ? sanitizeRichText(s) : `<p>${sanitizeInline(s)}</p>`;
    })
    .join(""));
}

export function mapNews(raw: Raw, index: number, report: ImportReport): NewsRecord {
  const legacyId = str(raw.id);
  const image = assetPath(str(raw.image));
  checkAsset(report, "news", legacyId, image, "image");
  const gallery = arr(raw.gallery).map((g) => {
    if (g && typeof g === "object" && (g as Raw).type === "youtube") return { type: "youtube" as const, url: str((g as Raw).url) };
    const src = assetPath(str(g));
    checkAsset(report, "news", legacyId, src, "gallery");
    return { type: "image" as const, src };
  });
  const rawBody = arr(raw.description).map(str).join("\n");
  const body = newsBodyHtml(arr(raw.description));
  const droppedTags = (rawBody.match(/<(script|style|object|embed|form)\b/gi) ?? []).length;
  if (droppedTags) report.issue("news", legacyId, "warning", `${droppedTags} disallowed tag(s) removed by the sanitizer`);
  return {
    legacyId,
    slug: toSlug(legacyId),
    type: str(raw.type),
    title: str(raw.title),
    subtitle: str(raw.subtitle),
    dateText: str(raw.dates),
    venue: str(raw.venue),
    city: str(raw.city),
    image,
    heroGradient: str(raw.heroGradient),
    heroEmoji: str(raw.heroEmoji),
    tagLabel: str(raw.tagLabel),
    tagClass: str(raw.tagClass),
    bodyHtml: body,
    gallery,
    sortOrder: index,
  };
}

export interface PressRecord {
  legacyId: string;
  slug: string;
  year: string;
  title: string;
  subtitle: string;
  image: string;
  heroGradient: string;
  sortOrder: number;
  groups: { media: string; dateText: string; readOnlineUrl: string; items: string[]; sortOrder: number }[];
}

export function mapPress(raw: Raw, index: number, report: ImportReport): PressRecord {
  const legacyId = str(raw.id);
  const image = assetPath(str(raw.image));
  checkAsset(report, "press", legacyId, image, "image");
  return {
    legacyId,
    slug: toSlug(legacyId),
    year: str(raw.year),
    title: str(raw.title),
    subtitle: str(raw.subtitle),
    image,
    heroGradient: str(raw.heroGradient),
    sortOrder: index,
    groups: arr<Raw>(raw.galleries).map((g, gi) => {
      const items = arr(g.images).map((i) => assetPath(str(i)));
      items.forEach((i) => checkAsset(report, "press", legacyId, i, `gallery "${str(g.media)}"`));
      return { media: str(g.media), dateText: str(g.date), readOnlineUrl: str(g.readOnline), items, sortOrder: gi };
    }),
  };
}
