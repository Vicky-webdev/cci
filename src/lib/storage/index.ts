import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { del as blobDel, get as blobGet, head as blobHead, put as blobPut } from "@vercel/blob";

/**
 * Media storage abstraction. Uploads are served by the /uploads/[...path] route whichever
 * driver stores them. The local-disk driver writes under UPLOAD_DIR (a persistent volume in
 * production); the Vercel Blob driver is used automatically when BLOB_READ_WRITE_TOKEN is set
 * (serverless hosting, where the local disk is read-only and not shared between instances).
 */
export interface StorageDriver {
  put(relativePath: string, data: Buffer): Promise<void>;
  get(relativePath: string): Promise<Buffer>;
  remove(relativePath: string): Promise<void>;
  exists(relativePath: string): Promise<boolean>;
}

const uploadRoot = () => path.resolve(process.env.UPLOAD_DIR ?? "./storage/uploads");

/** Resolves a path inside the upload root, refusing traversal outside it. */
export function safeUploadPath(relativePath: string): string {
  const root = uploadRoot();
  const resolved = path.resolve(root, relativePath);
  if (resolved !== root && !resolved.startsWith(root + path.sep)) throw new Error("Invalid storage path");
  return resolved;
}

export const localDriver: StorageDriver = {
  async put(rel, data) {
    const target = safeUploadPath(rel);
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, data, { flag: "wx" }); // never overwrite an existing file
  },
  get: (rel) => readFile(safeUploadPath(rel)),
  remove: (rel) => rm(safeUploadPath(rel), { force: true }),
  async exists(rel) {
    try {
      await stat(safeUploadPath(rel));
      return true;
    } catch {
      return false;
    }
  },
};

/** Vercel Blob driver. Blobs are private and keyed `uploads/<relativePath>`. */
const blobKey = (rel: string) => {
  safeUploadPath(rel); // same traversal rules as the local driver
  return `uploads/${rel}`;
};

export const blobDriver: StorageDriver = {
  async put(rel, data) {
    await blobPut(blobKey(rel), data, { access: "private", addRandomSuffix: false, allowOverwrite: false });
  },
  async get(rel) {
    const res = await blobGet(blobKey(rel), { access: "private" });
    if (!res || res.statusCode !== 200) throw new Error("Not found");
    return Buffer.from(await new Response(res.stream).arrayBuffer());
  },
  remove: (rel) => blobDel(blobKey(rel)),
  async exists(rel) {
    try {
      await blobHead(blobKey(rel));
      return true;
    } catch {
      return false;
    }
  },
};

export const storage: StorageDriver = process.env.BLOB_READ_WRITE_TOKEN ? blobDriver : localDriver;

/** Allowed upload types, identified by file signature (magic bytes), not by name or client MIME. */
const SIGNATURES: { mime: string; ext: string; test: (b: Buffer) => boolean }[] = [
  { mime: "image/jpeg", ext: "jpg", test: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  { mime: "image/png", ext: "png", test: (b) => b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) },
  { mime: "image/gif", ext: "gif", test: (b) => b.subarray(0, 4).toString("latin1") === "GIF8" },
  { mime: "image/webp", ext: "webp", test: (b) => b.subarray(0, 4).toString("latin1") === "RIFF" && b.subarray(8, 12).toString("latin1") === "WEBP" },
  { mime: "image/avif", ext: "avif", test: (b) => b.subarray(4, 12).toString("latin1") === "ftypavif" },
  { mime: "application/pdf", ext: "pdf", test: (b) => b.subarray(0, 5).toString("latin1") === "%PDF-" },
  { mime: "video/mp4", ext: "mp4", test: (b) => b.subarray(4, 8).toString("latin1") === "ftyp" && b.subarray(4, 12).toString("latin1") !== "ftypavif" },
  { mime: "video/webm", ext: "webm", test: (b) => b.subarray(0, 4).equals(Buffer.from([0x1a, 0x45, 0xdf, 0xa3])) },
];

export const ALLOWED_UPLOAD_DESCRIPTION = "JPEG, PNG, GIF, WebP, AVIF, PDF, MP4 or WebM";

export function detectFileType(data: Buffer): { mime: string; ext: string } | null {
  const hit = SIGNATURES.find((s) => data.length >= 12 && s.test(data));
  return hit ? { mime: hit.mime, ext: hit.ext } : null;
}

export function slugifyFileName(name: string): string {
  const base = name.replace(/\.[^.]+$/, "");
  return (
    base
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "file"
  );
}

export function buildUploadPath(originalName: string, ext: string, now = new Date()): string {
  const y = now.getUTCFullYear();
  const m = String(now.getUTCMonth() + 1).padStart(2, "0");
  return `${y}/${m}/${randomBytes(4).toString("hex")}-${slugifyFileName(originalName)}.${ext}`;
}

export const sha1 = (data: Buffer) => createHash("sha1").update(data).digest("hex");
