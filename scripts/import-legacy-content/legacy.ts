/**
 * Read-only access to the legacy static site in _public_html/.
 * JS data files are executed in an isolated VM context with browser globals stubbed,
 * exactly as the browser would evaluate them, so no record is re-typed by hand.
 */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import * as cheerio from "cheerio";

export const LEGACY_ROOT = path.resolve(process.env.LEGACY_ROOT ?? "_public_html");

export function legacyPath(rel: string) {
  return path.join(LEGACY_ROOT, rel);
}

export function readLegacy(rel: string): string {
  return fs.readFileSync(legacyPath(rel), "utf8");
}

export function legacyFileExists(rel: string): boolean {
  if (!rel) return false;
  let clean = rel.replace(/^\.?\//, "").split("?")[0].split("#")[0];
  try {
    clean = decodeURI(clean);
  } catch {
    /* keep */
  }
  return fs.existsSync(legacyPath(clean));
}

type LegacyData = {
  EVENTS: Record<string, unknown>[];
  PAST_EVENTS: Record<string, unknown>[];
  NEWS: Record<string, unknown>[];
  PRESS: Record<string, unknown>[];
  PROCESSES: Record<string, unknown>[];
};

let cachedData: LegacyData | undefined;

export function loadLegacyData(): LegacyData {
  if (cachedData) return cachedData;
  const noop = () => undefined;
  const fakeElement = { innerHTML: "", style: {}, classList: { add: noop, remove: noop, toggle: noop } };
  const document = {
    getElementById: () => null,
    querySelector: () => null,
    querySelectorAll: () => [],
    addEventListener: noop,
    createElement: () => fakeElement,
    head: { appendChild: noop },
    body: { appendChild: noop, insertAdjacentHTML: noop },
    readyState: "loading",
  };
  const window = { addEventListener: noop, location: { search: "", href: "" }, document };
  const context = vm.createContext({ window, document, console: { log: noop, warn: noop, error: noop }, setTimeout: noop, URLSearchParams });
  const run = (file: string, exportNames: string[], source?: string) => {
    let src = source ?? readLegacy(file);
    for (const name of exportNames) src = src.replace(new RegExp(`^\\s*var ${name}\\s*=`, "m"), `globalThis.${name} =`);
    vm.runInContext(src, context, { filename: file, timeout: 5000 });
  };
  run("events-final.js", ["PAST_EVENTS"]);
  run("events.js", ["EVENTS"]);
  run("news.js", ["NEWS"]);
  run("press.js", ["PRESS"]);
  // Craft processes live in an inline <script> of craft-processes.html.
  const $ = cheerio.load(readLegacy("craft-processes.html"));
  const processScript = $("script")
    .toArray()
    .map((s) => $(s).html() ?? "")
    .find((s) => s.includes("var PROCESSES"));
  if (!processScript) throw new Error("PROCESSES array not found in craft-processes.html");
  const onlyData = processScript.slice(0, processScript.indexOf("];", processScript.indexOf("var PROCESSES")) + 2);
  run("craft-processes.html#inline", ["PROCESSES"], onlyData);

  const g = context as unknown as LegacyData;
  // Round-trip through JSON to detach from the VM realm.
  cachedData = JSON.parse(
    JSON.stringify({ EVENTS: g.EVENTS, PAST_EVENTS: g.PAST_EVENTS, NEWS: g.NEWS, PRESS: g.PRESS, PROCESSES: g.PROCESSES }),
  ) as LegacyData;
  return cachedData;
}

export function loadHtml(rel: string) {
  return cheerio.load(readLegacy(rel), { xml: false });
}

/** Normalises whitespace in text extracted from HTML (keeps single spaces and line breaks meaningful to display). */
export function clean(text: string | undefined | null): string {
  return (text ?? "").replace(/\s+/g, " ").trim();
}

/** Inner HTML with collapsed whitespace, for fields that legitimately carry inline markup. */
export function innerHtml(html: string | null | undefined): string {
  return (html ?? "").replace(/\s+/g, " ").replace(/>\s+</g, "><").trim();
}

/** Normalises a legacy asset reference to a public path without leading slash. */
export function assetPath(ref: string | undefined | null): string {
  if (!ref) return "";
  let p = ref.trim().replace(/\\ /g, " ").replace(/^\.?\//, "");
  try {
    p = decodeURI(p);
  } catch {
    /* keep */
  }
  return p;
}
