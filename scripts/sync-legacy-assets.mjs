#!/usr/bin/env node
// Mirrors the legacy asset folders (_public_html/images, _public_html/docs) into public/ so
// they keep their original URLs (/images/..., /docs/...). Files are hard-linked when possible
// (no extra disk space) and copied otherwise. The originals are never modified. Idempotent.
import fs from "node:fs";
import path from "node:path";

const SRC = path.resolve(process.env.LEGACY_ROOT ?? "_public_html");
const DEST = path.resolve("public");
const DIRS = ["images", "docs"];
let linked = 0, copied = 0, unchanged = 0;

function sync(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) { sync(s, d); continue; }
    const st = fs.statSync(s);
    if (fs.existsSync(d)) {
      const dt = fs.statSync(d);
      if (dt.ino === st.ino || (dt.size === st.size && dt.mtimeMs >= st.mtimeMs)) { unchanged++; continue; }
      fs.rmSync(d);
    }
    try { fs.linkSync(s, d); linked++; }
    catch { fs.copyFileSync(s, d); copied++; }
  }
}

if (!fs.existsSync(SRC)) {
  console.warn(`[assets:sync] ${SRC} not found — skipping (set LEGACY_ROOT or provide assets another way).`);
  process.exit(0);
}
for (const dir of DIRS) if (fs.existsSync(path.join(SRC, dir))) sync(path.join(SRC, dir), path.join(DEST, dir));
console.log(`[assets:sync] linked ${linked}, copied ${copied}, unchanged ${unchanged}`);
