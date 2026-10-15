import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { LEGACY_ROOT } from "./legacy";

const MIME: Record<string, string> = {
  jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", gif: "image/gif", webp: "image/webp",
  avif: "image/avif", svg: "image/svg+xml", pdf: "application/pdf", mp4: "video/mp4", mov: "video/quicktime",
  webm: "video/webm", docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

export interface MediaRecord {
  path: string;
  originalName: string;
  mimeType: string;
  size: number;
  width: number | null;
  height: number | null;
  sha1: string;
  folder: string;
}

function walk(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = path.join(dir, d.name);
    return d.isDirectory() ? walk(p) : [p];
  });
}

/** Every file under images/ and docs/ becomes a LEGACY media record (originals untouched). */
export async function scanLegacyMedia(onProgress?: (n: number) => void): Promise<MediaRecord[]> {
  const files = ["images", "docs"].flatMap((d) => walk(path.join(LEGACY_ROOT, d)));
  const out: MediaRecord[] = [];
  for (const abs of files) {
    const rel = path.relative(LEGACY_ROOT, abs).split(path.sep).join("/");
    const ext = path.extname(rel).slice(1).toLowerCase();
    if (rel.endsWith("images.json")) continue; // crafts-map manifests are data, imported separately
    const buf = fs.readFileSync(abs);
    let width: number | null = null;
    let height: number | null = null;
    if (["jpg", "jpeg", "png", "gif", "webp", "avif"].includes(ext)) {
      try {
        const meta = await sharp(buf).metadata();
        width = meta.width ?? null;
        height = meta.height ?? null;
      } catch {
        /* unreadable image: recorded without dimensions */
      }
    }
    out.push({
      path: rel,
      originalName: path.basename(rel),
      mimeType: MIME[ext] ?? "application/octet-stream",
      size: buf.length,
      width,
      height,
      sha1: createHash("sha1").update(buf).digest("hex"),
      folder: path.posix.dirname(rel),
    });
    if (onProgress && out.length % 500 === 0) onProgress(out.length);
  }
  return out;
}
