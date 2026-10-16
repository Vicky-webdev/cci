import "server-only";
import sharp from "sharp";
import { db } from "@/lib/db";
import { buildUploadPath, detectFileType, sha1, storage } from "@/lib/storage";

export interface MediaUsage {
  type: string;
  id: string;
  title: string;
  href: string;
}

/**
 * Finds every place a media path is referenced (plain path or URL-encoded form inside HTML/JSON),
 * so files in use cannot be deleted by accident.
 */
export async function findMediaUsage(path: string): Promise<MediaUsage[]> {
  const encoded = encodeURI(path);
  const pats = [...new Set([`%${path}%`, `%${encoded}%`])];
  const like = (col: string) => pats.map((_, i) => `${col} ILIKE $${i + 1}`).join(" OR ");
  const q = async (sql: string) => (await db.$queryRawUnsafe<{ id: string; title: string }[]>(sql, ...pats)) ?? [];
  const [pages, events, news, press, groups, pubs, awards, artisans, councils, states, stateImgs, procs, settings] = await Promise.all([
    q(`SELECT id, title FROM "Page" WHERE ${like(`sections::text`)} OR ${like(`coalesce("ogImage",'')`)}`),
    q(`SELECT id, title FROM "Event" WHERE ${like(`image`)} OR ${like(`"pdfUrl"`)} OR ${like(`array_to_string(gallery, '|')`)} OR ${like(`"descriptionHtml"`)} OR ${like(`"writeupHtml"`)}`),
    q(`SELECT id, title FROM "NewsArticle" WHERE ${like(`image`)} OR ${like(`"bodyHtml"`)} OR ${like(`gallery::text`)}`),
    q(`SELECT id, title FROM "PressItem" WHERE ${like(`image`)}`),
    q(`SELECT p.id, p.title FROM "PressGroup" g JOIN "PressItem" p ON p.id = g."pressItemId" WHERE ${like(`array_to_string(g.items, '|')`)}`),
    q(`SELECT id, title FROM "Publication" WHERE ${like(`"coverImage"`)} OR ${like(`"fileUrl"`)} OR ${like(`"descriptionHtml"`)}`),
    q(`SELECT id, name AS title FROM "AwardRecipient" WHERE ${like(`photo`)}`),
    q(`SELECT id, name AS title FROM "Artisan" WHERE ${like(`photo`)}`),
    q(`SELECT id, name AS title FROM "StateCouncil" WHERE ${like(`logo`)}`),
    q(`SELECT id, name AS title FROM "CraftState" WHERE ${like(`"mapImage"`)}`),
    q(`SELECT s.id, s.name AS title FROM "CraftStateImage" i JOIN "CraftState" s ON s.id = i."stateId" WHERE ${like(`i.src`)}`),
    q(`SELECT id, title FROM "CraftProcess" WHERE ${like(`icon`)}`),
    q(`SELECT key AS id, key AS title FROM "SiteSetting" WHERE ${like(`value::text`)}`),
  ]);
  const map = (type: string, key: string | null, rows: { id: string; title: string }[]) =>
    rows.map((r) => ({ type, id: r.id, title: r.title, href: key ? `/admin/content/${key}/${r.id}` : "/admin/settings" }));
  const all = [
    ...map("Page", "pages", pages),
    ...map("Event", "events", events),
    ...map("News", "news", news),
    ...map("Press", "press", [...press, ...groups]),
    ...map("Publication", "publications", pubs),
    ...map("Award recipient", "awards", awards),
    ...map("Artisan", "artisans", artisans),
    ...map("State council", "councils", councils),
    ...map("Crafts map", "craft-states", [...states, ...stateImgs]),
    ...map("Craft process", "processes", procs),
    ...map("Setting", null, settings),
  ];
  return [...new Map(all.map((u) => [`${u.type}:${u.id}`, u])).values()];
}

export class UploadError extends Error {}

/** Validates (size + magic bytes), stores and registers an upload. Byte-identical files are reused. */
export async function storeUpload(file: File, uploadedById: string) {
  const max = Number(process.env.UPLOAD_MAX_BYTES ?? 25 * 1024 * 1024);
  if (file.size === 0) throw new UploadError("The file is empty.");
  if (file.size > max) throw new UploadError(`The file is larger than ${Math.round(max / 1024 / 1024)} MB.`);
  const data = Buffer.from(await file.arrayBuffer());
  const type = detectFileType(data);
  if (!type) throw new UploadError("Unsupported file type. Upload JPEG, PNG, GIF, WebP, AVIF, PDF, MP4 or WebM.");
  const digest = sha1(data);
  const duplicate = await db.media.findFirst({ where: { sha1: digest } });
  if (duplicate) return { media: duplicate, reused: true };
  let width: number | null = null;
  let height: number | null = null;
  if (type.mime.startsWith("image/")) {
    try {
      const meta = await sharp(data).metadata();
      width = meta.width ?? null;
      height = meta.height ?? null;
    } catch {
      throw new UploadError("The image could not be read. It may be corrupted.");
    }
  }
  const rel = buildUploadPath(file.name || "upload", type.ext);
  await storage.put(rel, data);
  const media = await db.media.create({
    data: {
      path: `uploads/${rel}`,
      storage: "LOCAL",
      originalName: file.name.slice(0, 200) || `upload.${type.ext}`,
      mimeType: type.mime,
      size: data.length,
      width,
      height,
      sha1: digest,
      folder: `uploads/${rel.split("/").slice(0, 2).join("/")}`,
      title: file.name.replace(/\.[^.]+$/, "").slice(0, 200),
      uploadedById,
    },
  });
  return { media, reused: false };
}
