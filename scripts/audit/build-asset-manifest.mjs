#!/usr/bin/env node
// Builds docs/migration/ASSET_MANIFEST.csv and an audit summary from the legacy
// static site in _public_html/. Read-only against the legacy tree; safe to rerun.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const ROOT = path.resolve(process.argv[2] || '_public_html');
const OUT_CSV = path.resolve(process.argv[3] || 'docs/migration/ASSET_MANIFEST.csv');
const OUT_JSON = path.resolve(process.argv[4] || 'docs/migration/asset-audit.json');

const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
  const p = path.join(dir, d.name);
  return d.isDirectory() ? walk(p) : [p];
});

const files = walk(ROOT).map((abs) => path.relative(ROOT, abs).split(path.sep).join('/')).sort();
const fileSet = new Set(files);
const lowerMap = new Map(files.map((f) => [f.toLowerCase(), f]));

const kindOf = (f) => {
  const ext = path.extname(f).slice(1).toLowerCase();
  if (['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg', 'avif', 'getmapimage'].includes(ext)) return 'image';
  if (['mp4', 'mov', 'webm'].includes(ext)) return 'video';
  if (['pdf', 'docx'].includes(ext)) return 'document';
  if (ext === 'html') return 'page';
  if (['js'].includes(ext)) return 'script';
  if (ext === 'css') return 'stylesheet';
  if (ext === 'json') return 'data';
  if (ext === 'php') return 'server-code';
  if (f.startsWith('PHPMailer/')) return 'vendor';
  return 'other';
};

// Source files whose text is scanned for references.
const sources = files.filter((f) => /\.(html|js|css|json|php)$/i.test(f) && !f.startsWith('PHPMailer/'));
const refs = new Map(); // asset -> Set(source)
const missing = []; // {source, ref}
const addRef = (asset, src) => { if (!refs.has(asset)) refs.set(asset, new Set()); refs.get(asset).add(src); };

const resolveRef = (raw, srcFile) => {
  let r = raw.trim().replace(/\\ /g, ' ').replace(/^\.\//, '').replace(/^\//, '');
  r = r.split('?')[0].split('#')[0];
  try { r = decodeURI(r); } catch { /* keep raw */ }
  if (srcFile.startsWith('images/state_images/') && srcFile.endsWith('images.json')) {
    r = path.posix.join(path.posix.dirname(srcFile), r);
  }
  if (fileSet.has(r)) return { found: r };
  if (lowerMap.has(r.toLowerCase())) return { found: lowerMap.get(r.toLowerCase()), caseMismatch: true };
  return { missing: r };
};

const REF_RE = /(?:["'(`]|url\()\s*\.?\/?((?:images|docs|PHPMailer)\/[^"'`)\n]+?\.(?:jpe?g|png|webp|gif|svg|avif|mp4|mov|webm|pdf|docx|json|GetMapImage))\s*["'`)]/gi;
const LOCAL_RE = /(?:src|href)\s*=\s*["']((?!https?:|mailto:|tel:|#|javascript:|data:)[^"'?#]+\.(?:css|js|png|webp|jpe?g|html|pdf))["'?#]/gi;

for (const src of sources) {
  const text = fs.readFileSync(path.join(ROOT, src), 'utf8');
  if (src.endsWith('images.json')) {
    try {
      const j = JSON.parse(text);
      for (const v of [j.map, ...(j.crafts || [])].filter(Boolean)) {
        const res = resolveRef(v, src);
        if (res.found) addRef(res.found, src); else missing.push({ source: src, ref: res.missing });
      }
    } catch { missing.push({ source: src, ref: '(invalid JSON)' }); }
    continue;
  }
  for (const re of [REF_RE, LOCAL_RE]) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(text))) {
      const res = resolveRef(m[1], src);
      if (res.found) addRef(res.found, src); else missing.push({ source: src, ref: res.missing });
    }
  }
}
// Runtime-constructed references (crafts-map loads every state's images.json).
for (const f of files) if (/^images\/state_images\/[^/]+\/images\.json$/.test(f)) addRef(f, 'crafts-map.html (runtime fetch)');
// Shared scripts are loaded by loader.js on every page.
for (const f of ['nav.js', 'footer.js', 'events.js', 'events-final.js', 'news.js', 'press.js', 'craft-data.json'])
  if (fileSet.has(f)) addRef(f, f === 'craft-data.json' ? 'crafts-map.html (runtime fetch)' : 'loader.js (runtime)');

const hashes = new Map();
const rows = files.map((f) => {
  const buf = fs.readFileSync(path.join(ROOT, f));
  const sha1 = crypto.createHash('sha1').update(buf).digest('hex');
  if (!hashes.has(sha1)) hashes.set(sha1, []);
  hashes.get(sha1).push(f);
  return { f, size: buf.length, sha1, kind: kindOf(f) };
});

const destOf = (r) => {
  if (r.f.startsWith('images/') || r.f.startsWith('docs/')) return `public/${r.f} (synced, URL /${r.f} unchanged)`;
  if (r.kind === 'page') return 'Next.js route (see ROUTE_INVENTORY.md)';
  if (['cci.css', 'custom.css'].includes(r.f)) return `src/styles/legacy/${r.f}`;
  if (r.f === 'cci-logo.png') return 'public/cci-logo.png';
  if (r.kind === 'script' || r.f === 'craft-data.json') return 'Imported into DB / replaced by React components';
  if (r.f === 'send_enquiry.php' || r.f === 'secrets.example.php') return 'Replaced by src/app/api/contact (Route Handler)';
  if (r.f.startsWith('PHPMailer/')) return 'Not migrated (replaced by nodemailer)';
  if (r.f === '.htaccess') return 'next.config.ts headers/redirects + middleware';
  return 'manual review';
};

const csvEsc = (v) => /[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v);
const header = ['source_path', 'kind', 'bytes', 'sha1', 'duplicate_of', 'referenced_by_count', 'referenced_by', 'destination', 'status'];
const lines = [header.join(',')];
let stats = { total: 0, referenced: 0, unreferenced: 0, duplicates: 0, bytes: 0 };
const byKind = {};
for (const r of rows) {
  const group = hashes.get(r.sha1);
  const dupOf = group.length > 1 && group[0] !== r.f ? group[0] : '';
  const rb = [...(refs.get(r.f) || [])].sort();
  let status;
  if (r.f.startsWith('PHPMailer/')) status = 'vendor-not-migrated';
  else if (rb.length) status = 'referenced';
  else if (r.kind === 'page') status = 'route';
  else status = 'unreferenced-review';
  stats.total++; stats.bytes += r.size;
  if (rb.length) stats.referenced++; else stats.unreferenced++;
  if (dupOf) stats.duplicates++;
  byKind[r.kind] = byKind[r.kind] || { count: 0, bytes: 0 };
  byKind[r.kind].count++; byKind[r.kind].bytes += r.size;
  lines.push([r.f, r.kind, r.size, r.sha1, dupOf, rb.length, rb.slice(0, 6).join(' | ') + (rb.length > 6 ? ` | +${rb.length - 6} more` : ''), destOf(r), status].map(csvEsc).join(','));
}
fs.mkdirSync(path.dirname(OUT_CSV), { recursive: true });
fs.writeFileSync(OUT_CSV, lines.join('\n') + '\n');
const uniqMissing = [...new Map(missing.map((m) => [m.source + '→' + m.ref, m])).values()];
fs.writeFileSync(OUT_JSON, JSON.stringify({ stats, byKind, missing: uniqMissing,
  duplicateGroups: [...hashes.values()].filter((g) => g.length > 1) }, null, 2));
console.log(JSON.stringify({ stats, byKind, missingCount: uniqMissing.length }, null, 2));
