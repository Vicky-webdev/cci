import vm from "node:vm";
import * as cheerio from "cheerio";
import { legacyHrefToNew } from "../../src/lib/links";
import { clean, readLegacy } from "./legacy";
import type { ImportReport } from "./report";

export interface MenuNode {
  label: string;
  href: string;
  openInNewTab: boolean;
  children: MenuNode[];
}

/** Desktop navigation from the template literal in nav.js (the mobile menu is derived from the same tree). */
export function parseMainMenu(): MenuNode[] {
  const src = readLegacy("nav.js");
  const tpl = src.match(/navEl\.innerHTML\s*=\s*`([\s\S]*?)`;/)?.[1];
  if (!tpl) throw new Error("Desktop nav template not found in nav.js");
  const $ = cheerio.load(tpl);
  return $(".nav-center > li.nav-item")
    .toArray()
    .map((li) => {
      const top = $(li).children("a").first();
      return {
        label: clean(top.text()),
        href: legacyHrefToNew(top.attr("href") ?? ""),
        openInNewTab: false,
        children: $(li)
          .find(".dropdown a")
          .toArray()
          .map((a) => ({ label: clean($(a).text()), href: legacyHrefToNew($(a).attr("href") ?? ""), openInNewTab: false, children: [] })),
      };
    });
}

function evalArray(src: string, name: string): { label: string; href: string }[] {
  const literal = src.match(new RegExp(`var ${name}\\s*=\\s*(\\[[\\s\\S]*?\\]);`))?.[1];
  if (!literal) throw new Error(`${name} not found in footer.js`);
  return vm.runInNewContext(`(${literal})`, {}, { timeout: 1000 }) as { label: string; href: string }[];
}

export function parseFooterMenus(): Record<string, MenuNode[]> {
  const src = readLegacy("footer.js");
  const toNodes = (items: { label: string; href: string }[]) =>
    items.map((l) => ({ label: l.label, href: legacyHrefToNew(l.href), openInNewTab: /^https?:/.test(l.href), children: [] }));
  const $ = cheerio.load(src.match(/'<span class="f-legal-links">'([\s\S]*?)'<\/span>'/)?.[1]?.replace(/'\s*\+\s*'/g, "") ?? "");
  return {
    "footer-quick": toNodes(evalArray(src, "NAV_LINKS")),
    "footer-resources": toNodes(evalArray(src, "RESOURCE_LINKS")),
    "footer-connect": toNodes(evalArray(src, "ARCHIVE_LINKS")),
    legal: $("a")
      .toArray()
      .map((a) => ({ label: clean($(a).text()), href: legacyHrefToNew($(a).attr("href") ?? ""), openInNewTab: false, children: [] })),
  };
}

/** Column headings used by footer.js (stored as the menus' display names in settings). */
export function footerHeadings() {
  const src = readLegacy("footer.js");
  const titles = [...src.matchAll(/f-col-title">([^<]+)</g)].map((m) => m[1]);
  return titles;
}

/**
 * Settings defaults in src/lib/settings.ts were transcribed from footer.js and contact.html.
 * This check proves they still match the legacy source, so nothing was mistyped.
 */
export function verifySettingDefaults(settings: Record<string, unknown>, report: ImportReport) {
  const footer = readLegacy("footer.js");
  const contact = readLegacy("contact.html");
  const checks: [string, string, string][] = [
    ["contact.email", String(settings["contact.email"]), footer],
    ["contact.footerPhone", String(settings["contact.footerPhone"]), footer],
    ["instagram.beholdFeedUrl", String(settings["instagram.beholdFeedUrl"]), footer],
    ["analytics.gaMeasurementId", String(settings["analytics.gaMeasurementId"]), footer],
    ...(settings["contact.addressLines"] as string[]).map((l, i): [string, string, string] => [`contact.addressLines[${i}]`, l.replace("–", "\\u2013"), footer]),
    ...(settings["contact.phones"] as string[]).map((p, i): [string, string, string] => [`contact.phones[${i}]`, p, contact]),
    ...(settings["instagram.fallbackImages"] as string[]).map((p, i): [string, string, string] => [`instagram.fallbackImages[${i}]`, p, footer]),
    ...(settings["social.links"] as { url: string }[]).map((s, i): [string, string, string] => [`social.links[${i}]`, s.url, footer]),
  ];
  for (const [key, value, source] of checks) {
    if (!source.includes(value)) report.issue("settings", key, "error", `Default "${value}" not found in legacy source — check transcription`);
  }
}
