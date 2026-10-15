/**
 * Parsers for content that the legacy site hard-coded in HTML pages.
 */
import { sanitizeInline, sanitizeRichText } from "../../src/lib/sanitize";
import { assetPath, clean, innerHtml, loadHtml } from "./legacy";
import { checkAsset } from "./map-events";
import type { ImportReport } from "./report";

type CheerioAPI = ReturnType<typeof loadHtml>;

// ───────────── Publications ─────────────

export type PubKind = "BOOK" | "NEWSLETTER" | "HAPPENINGS" | "REPORT";

export interface PublicationRecord {
  legacyKey: string;
  kind: PubKind;
  title: string;
  cardTitleHtml: string;
  cardSubtitle: string;
  coverLogoHtml: string;
  coverHeadline: string;
  coverImage: string;
  coverAlt: string;
  coverBackground: string;
  dateLabel: string;
  descriptionHtml: string;
  fileUrl: string;
  actionLabel: string;
  isFeatured: boolean;
  isArchived: boolean;
  groupLabel: string;
  showRead: boolean;
  showDownload: boolean;
  sortOrder: number;
}

export const PUBLICATION_PAGES: { file: string; kind: PubKind; archived: boolean }[] = [
  { file: "books.html", kind: "BOOK", archived: false },
  { file: "newsletters.html", kind: "NEWSLETTER", archived: false },
  { file: "past-newsletters.html", kind: "NEWSLETTER", archived: true },
  { file: "happenings-in-handmade.html", kind: "HAPPENINGS", archived: false },
  { file: "past-happenings-in-handmade.html", kind: "HAPPENINGS", archived: true },
  { file: "reports.html", kind: "REPORT", archived: false },
];

const cleanHref = (href: string | undefined) => {
  const h = (href ?? "").trim();
  return h === "#" ? "" : assetPath(h);
};

export function parsePublications(report: ImportReport): PublicationRecord[] {
  const out: PublicationRecord[] = [];
  for (const page of PUBLICATION_PAGES) {
    const $ = loadHtml(page.file);
    let order = 0;
    const latest = $(".nl-latest").first();
    if (latest.length) {
      const img = latest.find(".nl-cover-card img").first();
      const action = latest.find(".nl-latest-actions a").first();
      const title = clean(latest.find(".nl-latest-title").text());
      const rec: PublicationRecord = {
        legacyKey: `${page.file}#latest`,
        kind: page.kind,
        title,
        cardTitleHtml: sanitizeInline(innerHtml(latest.find(".nl-cover-title").html())),
        cardSubtitle: clean(latest.find(".nl-cover-card-top .nl-latest-date").text()),
        coverLogoHtml: sanitizeInline(innerHtml(latest.find(".nl-cover-logo").html())),
        coverHeadline: "",
        coverImage: assetPath(img.attr("src")),
        coverAlt: img.attr("alt") ?? "",
        coverBackground: "",
        dateLabel: clean(latest.find(".nl-latest-info .nl-latest-date").text()),
        descriptionHtml: sanitizeInline(innerHtml(latest.find(".nl-latest-desc").html())),
        fileUrl: cleanHref(action.attr("href")),
        actionLabel: clean(action.text()),
        isFeatured: true,
        isArchived: page.archived,
        groupLabel: "",
        showRead: true,
        showDownload: true,
        sortOrder: order++,
      };
      checkAsset(report, "publications", rec.legacyKey, rec.coverImage, "cover");
      checkAsset(report, "publications", rec.legacyKey, rec.fileUrl, "file");
      out.push(rec);
    }
    $(".nl-card").each((i, el) => {
      const card = $(el);
      const img = card.find(".nl-card-img").first();
      const read = card.find(".nl-card-footer .nl-card-read").first();
      const dl = card.find(".nl-card-footer .nl-card-dl").first();
      const group = card.closest(".nl-year-group").find(".newsletter-year h2").first();
      const titleHtml = sanitizeInline(innerHtml(card.find(".nl-card-title").html()));
      const fileUrl = cleanHref(read.attr("href") ?? dl.attr("href"));
      const rec: PublicationRecord = {
        legacyKey: `${page.file}#card-${i + 1}`,
        kind: page.kind,
        title: clean(card.find(".nl-card-title").text()),
        cardTitleHtml: titleHtml,
        cardSubtitle: clean(card.find(".nl-card-date").text()),
        coverLogoHtml: sanitizeInline(innerHtml(card.find(".nl-card-cover-logo").html())),
        coverHeadline: sanitizeInline(innerHtml(card.find(".nl-card-cover-headline").html())),
        coverImage: assetPath(img.attr("src")),
        coverAlt: img.attr("alt") ?? "",
        coverBackground: (card.find(".nl-card-cover").attr("style") ?? "").replace(/^\s*background:\s*/i, "").replace(/;\s*$/, ""),
        dateLabel: clean(card.find(".nl-card-date").text()),
        descriptionHtml: "",
        fileUrl,
        actionLabel: clean(read.text()) || "Read online →",
        isFeatured: false,
        isArchived: page.archived,
        groupLabel: clean(group.text()),
        showRead: read.length > 0,
        showDownload: dl.length > 0,
        sortOrder: order++,
      };
      if ((read.length || dl.length) && !fileUrl) {
        report.issue("publications", rec.legacyKey, "warning", `"${rec.title}" card links to "#" (no file) — links hidden until a file is set`);
        rec.showRead = false;
        rec.showDownload = false;
      }
      checkAsset(report, "publications", rec.legacyKey, rec.coverImage, "cover");
      checkAsset(report, "publications", rec.legacyKey, rec.fileUrl, "file");
      out.push(rec);
    });
  }
  return out;
}

// ───────────── Awards ─────────────

export interface AwardRecipientRecord {
  legacyKey: string;
  year: string;
  name: string;
  award: string;
  craft: string;
  state: string;
  photo: string;
  photoAlt: string;
  isFeatured: boolean;
  listing: "awards" | "past-awards";
  sortOrder: number;
}

export function parseAwardRecipients(report: ImportReport): AwardRecipientRecord[] {
  const out: AwardRecipientRecord[] = [];
  const $a = loadHtml("awards.html");
  const featuredYear = clean($a(".awardees-grid").closest(".section").find(".s-title").first().text()).replace(/\s*Awardees$/i, "");
  $a(".awardee-card").each((i, el) => {
    const c = $a(el);
    const img = c.find(".awardee-photo img");
    out.push({
      legacyKey: `awards.html#card-${i + 1}`,
      year: featuredYear || "2024 - 2025",
      name: clean(c.find(".awardee-name").text()),
      award: clean(c.find(".awardee-year").text()),
      craft: clean(c.find(".awardee-craft").text()),
      state: "",
      photo: assetPath(img.attr("src")),
      photoAlt: img.attr("alt") ?? "",
      isFeatured: true,
      listing: "awards",
      sortOrder: i,
    });
  });
  for (const [file, listing] of [["awards.html", "awards"], ["past-awards.html", "past-awards"]] as const) {
    const $ = file === "awards.html" ? $a : loadHtml(file);
    $(".awards-table-section").each((_, section) => {
      const year = clean($(section).find(".awards-table-year").text());
      let order = 0;
      let prev: AwardRecipientRecord | undefined;
      $(section)
        .find("tbody tr")
        .each((ri, tr) => {
          const cells = $(tr).find("td").toArray().map((td) => clean($(td).text()));
          const [name = "", award = "", state = ""] = cells;
          const key = `${file}#${year}-row-${ri + 1}`;
          // Continuation rows (empty name and state, award text only) belong to the previous recipient.
          if (!name && !state && prev && prev.name && /^[a-z&]|^tradition/i.test(award) && !/kamala samman/i.test(award)) {
            prev.award = `${prev.award} ${award}`.trim();
            report.issue("awards", key, "info", `Continuation row merged into "${prev.name}" (${year})`);
            report.outcome("awards", "duplicate");
            report.discovered("awards");
            return;
          }
          if (cells.length > 3 && cells.slice(3).some(Boolean)) {
            report.issue("awards", key, "info", `Extra table cell ignored: "${cells.slice(3).join(" ")}"`);
          }
          if (!name) report.issue("awards", key, "info", `Row has no recipient name ("${award}") — imported as displayed`);
          const rec: AwardRecipientRecord = {
            legacyKey: key,
            year,
            name,
            award,
            craft: "",
            state,
            photo: "",
            photoAlt: "",
            isFeatured: false,
            listing,
            sortOrder: order++,
          };
          out.push(rec);
          prev = rec;
        });
    });
  }
  out.filter((r) => r.photo).forEach((r) => checkAsset(report, "awards", r.legacyKey, r.photo, "photo"));
  return out;
}

export function parseAwardCategories() {
  const $ = loadHtml("awards.html");
  return $(".category-card")
    .toArray()
    .map((el, i) => ({
      name: clean($(el).find(".category-title").text()),
      description: sanitizeInline(innerHtml($(el).find(".category-desc").html())),
      sortOrder: i,
    }));
}

// ───────────── People ─────────────

export function parseArtisans(report: ImportReport) {
  const $ = loadHtml("index.html");
  const seen = new Map<string, { name: string; craft: string; photo: string; sortOrder: number; legacyKey: string }>();
  $(".artisan-grid .a-card").each((i, el) => {
    const c = $(el);
    const style = c.find(".a-img").attr("style") ?? "";
    const photo = assetPath(style.match(/url\(['"]?(.*?)['"]?\)/)?.[1]?.replace(/\\ /g, " "));
    const name = clean(c.find(".a-name").text());
    const craft = clean(c.find(".a-region").text());
    report.discovered("artisans");
    if (seen.has(photo)) {
      report.outcome("artisans", "duplicate");
      report.issue("artisans", `index.html#a-card-${i + 1}`, "info", `Loop duplicate of "${seen.get(photo)!.name}" (CSS infinite scroll) — rendered automatically now`);
      return;
    }
    if (!name) report.issue("artisans", `index.html#a-card-${i + 1}`, "warning", "Card has no name");
    seen.set(photo, { name, craft, photo, sortOrder: seen.size, legacyKey: `index.html#artisan-${slug(photo)}` });
    checkAsset(report, "artisans", name, photo, "photo");
  });
  return [...seen.values()];
}

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export function parseTeam() {
  const $ = loadHtml("about.html");
  const cols = $(".team-cols > div").toArray();
  const out: { name: string; group: "EC_MEMBER" | "OFFICE_BEARER"; role: string; sortOrder: number; legacyKey: string }[] = [];
  cols.forEach((col, ci) => {
    const group = ci === 0 ? "EC_MEMBER" : "OFFICE_BEARER";
    $(col)
      .find(".tc-list li")
      .each((i, li) => {
        const role = clean($(li).find(".tc-role").text());
        const name = clean($(li).clone().find(".tc-role").remove().end().text());
        out.push({ name, group, role, sortOrder: i, legacyKey: `about.html#${group}-${i + 1}` });
      });
  });
  return out;
}

export function parseCouncils(report: ImportReport) {
  const $ = loadHtml("contact.html");
  const visible = $(".affiliates-section").not(".d-none").first();
  return visible
    .find(".affiliate-card")
    .toArray()
    .map((el, i) => {
      const c = $(el);
      const quick: Record<string, string> = {};
      const quickLabels: string[] = [];
      c.find(".affiliate-quick-row").each((_, row) => {
        const label = clean($(row).find(".affiliate-quick-label").text());
        quickLabels.push(label);
        quick[label] = clean($(row).children("span").last().text());
      });
      const contact: Record<string, string> = {};
      c.find(".affiliate-contact-row").each((_, row) => {
        const label = clean($(row).find(".affiliate-contact-label").text());
        const value = ($(row).children("span").last().html() ?? "")
          .split(/<br\s*\/?>/i)
          .map((part) => clean(part.replace(/<[^>]+>/g, "")))
          .filter(Boolean)
          .join("\n");
        contact[label] = value;
      });
      const logo = assetPath(c.find(".affiliate-logo img").attr("src"));
      const abbreviation = clean(c.find(".affiliate-state-tag").text());
      checkAsset(report, "councils", abbreviation, logo, "logo");
      const focusLabel = quickLabels[2] ?? "Focus";
      return {
        legacyKey: `contact.html#${abbreviation.toLowerCase()}`,
        name: clean(c.find(".affiliate-name").text()),
        abbreviation,
        logo,
        established: quick["Est."] ?? "",
        state: quick["State"] ?? "",
        focusLabel,
        focus: quick[focusLabel] ?? "",
        description: clean(c.find(".affiliate-desc").text()),
        address: contact["Address"] ?? "",
        phone: contact["Phone"] ?? "",
        email: contact["Email"] ?? "",
        sortOrder: i,
      };
    });
}

// ───────────── Legal / rich text ─────────────

export function parseRichPage(file: string, selector: string): string {
  const $: CheerioAPI = loadHtml(file);
  return sanitizeRichText(innerHtml($(selector).first().html()));
}
