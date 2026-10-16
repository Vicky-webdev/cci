/**
 * Converts each legacy page's hard-coded markup into structured CMS sections.
 * All text is read from the HTML (never re-typed); links are rewritten to the new URLs.
 */
import { randomBytes } from "node:crypto";
import { legacyHrefToNew } from "../../src/lib/links";
import { sanitizeInline, sanitizeRichText } from "../../src/lib/sanitize";
import { assetPath, clean, innerHtml, loadHtml } from "./legacy";

type Sec = { id: string; type: string; data: Record<string, unknown> };
export interface PageRecord {
  slug: string;
  title: string;
  template: string;
  metaTitle: string;
  legacyPath: string;
  sections: Sec[];
}

const sec = (type: string, data: Record<string, unknown>): Sec => ({ id: randomBytes(6).toString("hex"), type, data });
const href = (h: string | undefined) => legacyHrefToNew(h ?? "");
const inline = (h: string | null | undefined) => sanitizeInline(innerHtml(h)).replace(/href="([^"]*)"/g, (_, x) => `href="${legacyHrefToNew(x)}"`);
const rich = (h: string | null | undefined) =>
  sanitizeRichText(innerHtml(h)).replace(/href="([^"]*)"/g, (_, x) => `href="${legacyHrefToNew(x)}"`);
const bgUrl = (style: string | undefined) => assetPath((style ?? "").match(/url\(['"]?(.*?)['"]?\)/)?.[1]);

function hero($: ReturnType<typeof loadHtml>) {
  const h = $(".page-hero").first();
  return sec("pageHero", {
    title: clean(h.find(".page-title").text()),
    subtitle: clean(h.find(".page-subtitle").text()),
    variant: h.hasClass("gold-hero") ? "gold" : "default",
    watermark: clean(h.find(".kamala-bg").text()),
  });
}

const titleOf = ($: ReturnType<typeof loadHtml>) => clean($("title").text());

function home(): PageRecord {
  const $ = loadHtml("index.html");
  const left = $(".hero-left");
  const primary = left.find(".hero-actions .btn-primary");
  const secondary = left.find(".hero-actions .btn-ghost");
  const mission = $(".mission-grid");
  const card = mission.find(".kc-card");
  const sections = $(".section");
  const artisans = sections.filter((_, s) => $(s).find(".artisan-grid").length > 0).first();
  const events = sections.filter((_, s) => $(s).find("#home-events-container").length > 0).first();
  const awards = sections.filter((_, s) => $(s).find(".awards-scroll .aw-card").length > 0 && $(s).find(".artisan-grid").length === 0).first();
  const retail = $(".retail-section");
  return {
    slug: "home",
    title: "Home",
    template: "home",
    metaTitle: titleOf($),
    legacyPath: "index.html",
    sections: [
      sec("heroSlider", {
        eyebrow: inline(left.find(".eyebrow").html()),
        titleHtml: inline(left.find(".hero-title").html()),
        description: clean(left.find(".hero-desc").text()),
        primaryLabel: clean(primary.text()),
        primaryHref: href(primary.attr("href")),
        secondaryLabel: clean(secondary.text()),
        secondaryHref: href(secondary.attr("href")),
        intervalMs: 5000,
        slides: $(".slider-track .slide")
          .toArray()
          .map((s) => ({ image: bgUrl($(s).attr("style")), alt: "" })),
      }),
      sec("marquee", { items: $(".marquee-inner .m-item").toArray().map((m) => ({ html: inline($(m).html()) })) }),
      sec("quote", {
        text: clean($(".quote-band-text").text()),
        attribution: clean($(".quote-attribution").text()),
      }),
      sec("mission", {
        title: clean(mission.find(".s-title").first().text()),
        subtitle: clean(mission.find(".s-sub").first().text()),
        pillars: mission
          .find(".pillar")
          .toArray()
          .map((p) => ({ title: clean($(p).find(".p-title").text()), text: clean($(p).find(".p-desc").text()) })),
        cardEnabled: card.length > 0,
        cardHref: href(card.find("a.kc-cover").attr("href")),
        cardCoverOrg: clean(card.find(".kc-org").text()),
        cardCoverTitle: clean(card.find(".kc-script").text()),
        cardCoverYear: clean(card.find(".kc-title > span").last().text()),
        cardCoverCta: clean(card.find(".kc-cta").text()),
        cardHeading: clean(card.find(".kc-card-body h3").text()),
        cardSubheading: clean(card.find(".kc-card-sub").text()),
        cardDateLabel: clean(card.find(".kc-card-date").clone().find("strong").remove().end().text()).replace(/:\s*$/, ""),
        cardDate: clean(card.find(".kc-card-date strong").text()),
        cardLinkLabel: clean(card.find(".kc-card-link").text()).replace(/\s*→\s*$/, ""),
      }),
      sec("artisans", {
        tag: clean(artisans.find(".s-tag").first().text()),
        title: clean(artisans.find(".s-title").first().text()),
        buttonLabel: clean(artisans.find(".meet-artisian-btn").text()),
        buttonHref: "", // legacy button had no action; shown only once a link is set
      }),
      sec("retail", {
        tag: clean(retail.find(".s-tag").first().text()),
        title: clean(retail.find(".s-title").first().text()),
        paragraphs: retail.find(".retail-desc").toArray().map((p) => ({ text: clean($(p).text()) })),
        primaryLabel: clean(retail.find("a.btn-primary").text()),
        primaryHref: href(retail.find("a.btn-primary").attr("href")),
        secondaryLabel: clean(retail.find("a.btn-ghost").text()),
        secondaryHref: href(retail.find("a.btn-ghost").attr("href")),
        intervalMs: 4000,
        slides: retail
          .find(".retail-slide img")
          .toArray()
          .map((img) => ({ image: assetPath($(img).attr("src")), alt: $(img).attr("alt") ?? "" })),
      }),
      sec("homeEvents", {
        tag: clean(events.find(".s-tag").first().text()),
        title: clean(events.find(".s-title").first().text()),
        linkLabel: clean(events.find(".s-header-row a").text()),
        linkHref: href(events.find(".s-header-row a").attr("href")),
        limit: 3,
        emptyText: "No upcoming events at the moment.",
      }),
      sec("homeAwards", {
        tag: clean(awards.find(".s-tag").first().text()),
        title: clean(awards.find(".s-title").first().text()),
        linkLabel: clean(awards.find(".s-header-row a").text()),
        linkHref: href(awards.find(".s-header-row a").attr("href")),
      }),
    ],
  };
}

function about(): PageRecord {
  const $ = loadHtml("about.html");
  const h = $(".history-section");
  const img = h.find(".portrait-image");
  const vm = $(".vm-section");
  const team = $(".team-section");
  return {
    slug: "about",
    title: "About",
    template: "about",
    metaTitle: titleOf($),
    legacyPath: "about.html",
    sections: [
      hero($),
      sec("history", {
        anchor: "history", // nav linked about#history but the legacy section had no id
        tag: clean(h.find(".s-tag").first().text()),
        title: clean(h.find(".s-title").first().text()),
        portraitImage: assetPath(img.attr("src")),
        portraitAlt: img.attr("alt") ?? "",
        portraitName: clean(h.find(".portrait-name").text()),
        portraitYears: clean(h.find(".portrait-years").text()),
        portraitDescHtml: inline(h.find(".portrait-desc").html()),
        pill: clean(h.find(".history-pill").text()),
        quote: clean(h.find(".history-quote").text()),
        bodyHtml: rich(h.find(".history-body").html()),
      }),
      sec("visionMission", {
        anchor: vm.attr("id") ?? "vision",
        tag: clean(vm.find(".s-tag").first().text()),
        title: clean(vm.find(".s-title").first().text()),
        cards: vm
          .find(".vm-card")
          .toArray()
          .map((c) => ({
            anchor: $(c).attr("id") ?? "",
            title: clean($(c).find(".vm-title").text()),
            html: inline($(c).find(".vm-text").html()),
            accent: ($(c).find(".vm-accent").attr("style") ?? "").match(/background:\s*([^;]+)/)?.[1]?.trim() ?? "",
          })),
      }),
      sec("team", {
        anchor: team.attr("id") ?? "team",
        tag: clean(team.find(".s-tag").first().text()),
        title: clean(team.find(".s-title").first().text()),
        note: clean(team.find(".team-note").text()),
        membersTitle: clean(team.find(".tc-title").eq(0).text()),
        bearersTitle: clean(team.find(".tc-title").eq(1).text()),
      }),
    ],
  };
}

function whatWeDo(): PageRecord {
  const $ = loadHtml("what-we-do.html");
  const blocks = $("section.wwd-block").toArray();
  return {
    slug: "what-we-do",
    title: "What We Do",
    template: "what-we-do",
    metaTitle: titleOf($),
    legacyPath: "what-we-do.html",
    sections: [
      hero($),
      sec("anchorBar", {
        links: $(".anchor-bar .anchor-link")
          .toArray()
          .map((a) => ({ label: clean($(a).text()), anchor: ($(a).attr("href") ?? "").replace(/^#/, "") })),
      }),
      ...blocks.map((b) => {
        const el = $(b);
        const slider = el.find(".wwd-slider");
        return sec("featureBlock", {
          anchor: el.attr("id") ?? "",
          title: clean(el.find(".wwd-title").text()),
          layout: el.hasClass("img-left") ? "img-left" : "img-right",
          dividerColor: (el.find(".wwd-divider").attr("style") ?? "").match(/background:\s*([^;]+)/)?.[1]?.trim() ?? "",
          bodyHtml: rich(el.find(".wwd-body").html()),
          intervalMs: Number(slider.attr("data-autoplay")) || 4000,
          slides: slider
            .find(".wwd-slide")
            .toArray()
            .map((s) => ({
              image: assetPath($(s).find("img").attr("src")),
              alt: $(s).find("img").attr("alt") ?? "",
              caption: clean($(s).find(".wwd-slide-caption").text()),
            }))
            .filter((s) => s.image),
        });
      }),
    ],
  };
}

function awards(): PageRecord {
  const $ = loadHtml("awards.html");
  const call = $("#kamala-call");
  const primary = call.find(".kc-actions .btn-primary");
  const secondary = call.find(".kc-actions .btn-ghost");
  const intro = $(".award-categories").closest(".section");
  const recent = $(".awardees-grid").closest(".section");
  return {
    slug: "awards",
    title: "Kamala Awards",
    template: "awards",
    metaTitle: titleOf($),
    legacyPath: "awards.html",
    sections: [
      hero($),
      sec("kamalaCall", {
        anchor: "kamala-call",
        coverOrg: clean(call.find(".kc-org").text()),
        coverTitle: clean(call.find(".kc-script").text()),
        coverYear: clean(call.find(".kc-title > span").last().text()),
        coverCta: clean(call.find(".kc-cover .kc-cta").text()),
        badge: clean(call.find(".kc-badge").text()),
        title: clean(call.find(".kc-info h2").text()),
        subtitle: clean(call.find(".kc-info-sub").text()),
        introHtml: rich(call.find(".kc-info > p").toArray().map((p) => `<p>${$(p).html()}</p>`).join("")),
        deadlineLabel: clean(call.find(".kc-deadline-label").text()),
        deadline: clean(call.find(".kc-deadline-date").text()),
        primaryLabel: clean(primary.text()),
        primaryHref: primary.attr("href") ?? "",
        secondaryLabel: clean(secondary.text()),
        secondaryHref: secondary.attr("href") ?? "",
      }),
      sec("awardCategories", {
        title: clean(intro.find(".s-title").first().text()),
        introHtml: inline(intro.find(".s-text").first().html()),
      }),
      sec("awardeeCards", {
        tag: clean(recent.find(".s-tag").first().text()),
        title: clean(recent.find(".s-title").first().text()),
        tablesListing: "awards",
      }),
    ],
  };
}

function pastAwards(): PageRecord {
  const $ = loadHtml("past-awards.html");
  const s = $(".section").first();
  return {
    slug: "past-awards",
    title: "Past Award Recipients",
    template: "awards",
    metaTitle: titleOf($),
    legacyPath: "past-awards.html",
    sections: [
      hero($),
      sec("awardTables", { listing: "past-awards", tag: clean(s.find(".s-tag").first().text()), title: clean(s.find(".s-title").first().text()) }),
    ],
  };
}

function contact(): PageRecord {
  const $ = loadHtml("contact.html");
  const grid = $(".contact-grid");
  const aff = $(".affiliates-section").not(".d-none").first();
  // Rendered visibly by browsers in the legacy page (unbalanced markup pushes it out of the hidden block).
  const net = $(".network-grid").first();
  return {
    slug: "contact",
    title: "Contact",
    template: "contact",
    metaTitle: titleOf($),
    legacyPath: "contact.html",
    sections: [
      hero($),
      sec("contact", {
        formTitle: clean(grid.find("h2").first().text()),
        formIntro: clean(grid.find("h2").first().next("p").text()),
        successMessage: "✓ Message sent successfully. We will contact you shortly.",
        infoTitle: clean(grid.find(".info-title").text()),
      }),
      sec("councils", {
        tag: clean(aff.find(".s-tag").first().text()),
        title: clean(aff.find(".s-title").first().text()),
        intro: clean(aff.find(".affiliates-intro").text()),
        networkTag: clean(net.find(".s-tag").first().text()),
        networkTitle: clean(net.find(".s-title").first().text()),
        networkHtml: rich(net.children("div").first().find("p").not(".s-tag").toArray().map((p) => `<p>${$(p).html()}</p>`).join("")),
        networkImage: assetPath(net.find("img").attr("src")),
        networkImageAlt: "Map of the Crafts Council of India's affiliated State Councils",
      }),
    ],
  };
}

function listing(file: string, slug: string, title: string, labels: Record<string, string>): PageRecord {
  const $ = loadHtml(file);
  return {
    slug,
    title,
    template: "listing",
    metaTitle: titleOf($),
    legacyPath: file,
    sections: [hero($), sec("listingFilters", labels)],
  };
}

function publications(file: string, slug: string, title: string, kind: string, archived: boolean, footer?: { label: string; href: string }): PageRecord {
  const $ = loadHtml(file);
  const gridClass = ($(".nl-grid").first().attr("class") ?? "").split(/\s+/).find((c) => c.startsWith("nl-grid-")) ?? "nl-grid";
  const badge = clean($(".nl-latest-badge").first().text());
  return {
    slug,
    title,
    template: "publications",
    metaTitle: titleOf($),
    legacyPath: file,
    sections: [
      hero($),
      sec("publications", {
        kind,
        archived,
        featuredBadge: badge,
        gridClass,
        showCardActions: true,
        footerLabel: footer?.label ?? "",
        footerHref: footer?.href ?? "",
      }),
    ],
  };
}

function legal(file: string, slug: string, title: string, wrapper: "privacy" | "terms", selector: string): PageRecord {
  const $ = loadHtml(file);
  return {
    slug,
    title,
    template: "standard",
    metaTitle: titleOf($),
    legacyPath: file,
    sections: [hero($), sec("richText", { wrapper, html: rich($(selector).first().html()) })],
  };
}

export function buildPages(): PageRecord[] {
  const pastFooter = (file: string) => {
    const $ = loadHtml(file);
    const a = $("a").filter((_, el) => /past-/.test($(el).attr("href") ?? "") && /See Past/i.test($(el).text())).first();
    return a.length ? { label: clean(a.text()), href: legacyHrefToNew(a.attr("href") ?? "") } : undefined;
  };
  const eventsFooter = pastFooter("events.html");
  return [
    home(),
    about(),
    whatWeDo(),
    awards(),
    pastAwards(),
    contact(),
    listing("events.html", "events", "Events & Exhibitions", {
      emptyText: "No events found",
      emptyHint: "Try another filter",
      footerLabel: eventsFooter?.label ?? "",
      footerHref: eventsFooter?.href ?? "",
    }),
    listing("past-events.html", "past-events", "Past Events Archive", { emptyText: "No past events found" }),
    listing("news.html", "news", "News", { emptyText: "No news found", emptyHint: "Try another filter" }),
    listing("press.html", "press", "Press & Media", { emptyText: "No press coverage found" }),
    listing("crafts-map.html", "crafts-map", "Indian Crafts Map", {
      intro: clean(loadHtml("crafts-map.html")(".sidebar-placeholder p").text()),
    }),
    listing("craft-processes.html", "craft-processes", "Craft Processes", {
      intro: clean(loadHtml("craft-processes.html")(".process-inner .s-text").first().text()),
    }),
    publications("books.html", "books", "Books", "BOOK", false),
    publications("newsletters.html", "newsletters", "Newsletters", "NEWSLETTER", false, pastFooter("newsletters.html")),
    publications("past-newsletters.html", "past-newsletters", "Newsletters Archive", "NEWSLETTER", true),
    publications("happenings-in-handmade.html", "happenings-in-handmade", "Happenings in Handmade", "HAPPENINGS", false, pastFooter("happenings-in-handmade.html")),
    publications("past-happenings-in-handmade.html", "past-happenings-in-handmade", "Past Happenings in Handmade", "HAPPENINGS", true),
    publications("reports.html", "reports", "Reports", "REPORT", false),
    legal("privacy-policy.html", "privacy-policy", "Privacy Policy", "privacy", ".privacy-content"),
    legal("disclaimer.html", "disclaimer", "Terms & Conditions", "terms", ".terms-inner"),
  ];
}
