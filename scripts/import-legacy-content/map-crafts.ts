import fs from "node:fs";
import { assetPath, legacyFileExists, legacyPath, readLegacy } from "./legacy";
import { checkAsset } from "./map-events";
import type { ImportReport } from "./report";

// Copied from crafts-map.html (STATE_ID_MAP / STATE_ALIAS / normalize) so that the
// mapping of craft-data.json records to map ids is exactly what the legacy page did.
const STATE_ID_MAP: Record<string, string> = {
  "andhra pradesh": "ap", "arunachal pradesh": "ar", assam: "as", bihar: "br", chhattisgarh: "cg",
  delhi: "dl", goa: "ga", gujarat: "gj", haryana: "hr", "himachal pradesh": "hp", "jammu and kashmir": "jk",
  jharkhand: "jh", karnataka: "ka", kerala: "kl", "madhya pradesh": "mp", maharashtra: "mh", manipur: "mn",
  meghalaya: "ml", mizoram: "mz", nagaland: "nl", odisha: "or", puducherry: "py", punjab: "pb",
  rajasthan: "rj", sikkim: "sk", "tamil nadu": "tn", telangana: "tg", tripura: "tr", "uttar pradesh": "up",
  uttarakhand: "ut", "west bengal": "wb", "dadra and nagar haveli": "dh", "daman and diu": "dd", chandigarh: "ch",
};
const STATE_ALIAS: Record<string, string> = {
  uttar: "uttar pradesh", jammu: "jammu and kashmir", andhra: "andhra pradesh", arunachal: "arunachal pradesh",
  madhya: "madhya pradesh", himachal: "himachal pradesh", chattisgarh: "chhattisgarh", daman: "daman and diu",
  pondicherry: "puducherry", "dadra and nagar haveli": "dadra and nagar haveli", chandigarh: "chandigarh",
};
const normalize = (name: string) =>
  name.toLowerCase().replace(".xlsx", "").replace("&", "and").replace(/[^a-z\s]/g, "").replace(/\s+/g, " ").trim();
const titleCase = (s: string) => s.replace(/\b\w/g, (l) => l.toUpperCase());

export interface CraftStateRecord {
  code: string;
  name: string;
  imageFolder: string;
  mapImage: string;
  sourceNames: string[];
  sortOrder: number;
  locations: { craft: string; district: string; village: string; sortOrder: number }[];
  images: string[];
}

export function parseCraftStates(report: ImportReport): CraftStateRecord[] {
  const data = JSON.parse(readLegacy("craft-data.json")) as { state: string; crafts?: { craft?: string; district?: string; village?: string }[] }[];
  const byCode = new Map<string, CraftStateRecord>();
  data.forEach((entry, i) => {
    report.discovered("craftStates");
    let key = normalize(entry.state);
    if (STATE_ALIAS[key]) key = STATE_ALIAS[key];
    const code = STATE_ID_MAP[key];
    if (!code) {
      report.outcome("craftStates", "unresolved");
      report.issue("craftStates", entry.state, "error", "State name has no map id (legacy page skipped it too)");
      return;
    }
    let rec = byCode.get(code);
    if (rec) {
      report.outcome("craftStates", "duplicate");
      report.issue("craftStates", entry.state, "info", `Duplicate state record merged into "${rec.name}" (legacy merged it at runtime)`);
      rec.sourceNames.push(entry.state);
    } else {
      const name = titleCase(key);
      let folder = name.toLowerCase().replace(/\s+/g, "");
      if (folder === "puducherry") folder = "Puducherry";
      rec = { code, name, imageFolder: folder, mapImage: "", sourceNames: [entry.state], sortOrder: i, locations: [], images: [] };
      byCode.set(code, rec);
    }
    for (const c of entry.crafts ?? []) {
      const craft = (c.craft ?? "").trim();
      if (!craft) {
        report.issue("craftStates", entry.state, "warning", "Craft entry with empty name skipped (legacy skipped it too)");
        continue;
      }
      rec.locations.push({ craft, district: (c.district ?? "").trim() || "Unknown", village: (c.village ?? "").trim(), sortOrder: rec.locations.length });
    }
  });
  for (const rec of byCode.values()) {
    const manifest = `images/state_images/${rec.imageFolder}/images.json`;
    if (!legacyFileExists(manifest)) {
      report.issue("craftStates", rec.name, "warning", `No image manifest at ${manifest} (legacy shows "No map image")`);
      continue;
    }
    const m = JSON.parse(fs.readFileSync(legacyPath(manifest), "utf8")) as { map?: string; crafts?: string[] };
    const base = `images/state_images/${rec.imageFolder}/`;
    rec.mapImage = m.map ? assetPath(base + m.map) : "";
    rec.images = (m.crafts ?? []).map((f) => assetPath(base + f));
    checkAsset(report, "craftStates", rec.name, rec.mapImage, "map image");
    rec.images.forEach((img) => checkAsset(report, "craftStates", rec.name, img, "craft image"));
  }
  return [...byCode.values()];
}

export interface ProcessRecord {
  slug: string;
  category: string;
  icon: string;
  color: string;
  title: string;
  subtitle: string;
  intro: string;
  materials: string[];
  steps: { title: string; text: string }[];
  states: string[];
  sortOrder: number;
}

export function mapProcesses(raw: Record<string, unknown>[], report: ImportReport): ProcessRecord[] {
  return raw.map((p, i) => {
    const slug = String(p.id ?? "");
    const steps = (Array.isArray(p.steps) ? p.steps : []) as { title?: string; text?: string }[];
    const materials = (Array.isArray(p.materials) ? p.materials : []).map(String);
    if (steps.some((s) => /Copyright ©|Scroll to top/.test(s.text ?? ""))) {
      report.issue("processes", slug, "warning", "Step text contains scraped site-footer text (\"Copyright … Scroll to top\") — imported verbatim, needs editorial clean-up");
    }
    if (materials.some((m) => /^(Publications|Instagram|Privacy Policy|About Us|Facebook)$/i.test(m))) {
      report.issue("processes", slug, "warning", "Materials list contains navigation labels scraped from the old site — imported verbatim");
    }
    const icon = assetPath(String(p.icon ?? ""));
    checkAsset(report, "processes", slug, icon, "icon");
    return {
      slug,
      category: String(p.category ?? ""),
      icon,
      color: String(p.color ?? ""),
      title: String(p.title ?? ""),
      subtitle: String(p.subtitle ?? ""),
      intro: String(p.intro ?? ""),
      materials,
      steps: steps.map((s) => ({ title: String(s.title ?? ""), text: String(s.text ?? "") })),
      states: (Array.isArray(p.states) ? p.states : []).map(String),
      sortOrder: i,
    };
  });
}
