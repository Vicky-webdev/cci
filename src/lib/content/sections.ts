import { z } from "zod";

/**
 * Page sections ("blocks"). Each section type declares its fields once; the same
 * declaration drives server-side validation (zod) and the admin form builder.
 * Rendering lives in src/components/sections/.
 */

export type FieldDef =
  | {
      name: string;
      label: string;
      type: "text" | "textarea" | "html" | "inline-html" | "url" | "image" | "file" | "color";
      help?: string;
      required?: boolean;
    }
  | { name: string; label: string; type: "number"; help?: string; required?: boolean; min?: number; max?: number }
  | { name: string; label: string; type: "boolean"; help?: string }
  | { name: string; label: string; type: "select"; options: { value: string; label: string }[]; help?: string }
  | { name: string; label: string; type: "list"; fields: FieldDef[]; itemLabel: string; help?: string };

export interface SectionDef {
  type: string;
  label: string;
  description: string;
  fields: FieldDef[];
}

const cta = (prefix: string, label: string): FieldDef[] => [
  { name: `${prefix}Label`, label: `${label} label`, type: "text" },
  { name: `${prefix}Href`, label: `${label} link`, type: "url" },
];

const slides = (withCaption = false): FieldDef => ({
  name: "slides",
  label: "Slides",
  type: "list",
  itemLabel: "Slide",
  fields: [
    { name: "image", label: "Image", type: "image", required: true },
    { name: "alt", label: "Alt text", type: "text" },
    ...(withCaption ? [{ name: "caption", label: "Caption", type: "text" } as FieldDef] : []),
  ],
});

export const SECTION_DEFS: SectionDef[] = [
  {
    type: "pageHero",
    label: "Page hero",
    description: "Title banner at the top of inner pages.",
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "subtitle", label: "Subtitle", type: "textarea" },
      {
        name: "variant",
        label: "Style",
        type: "select",
        options: [
          { value: "default", label: "Default" },
          { value: "gold", label: "Gold (Kamala Awards)" },
        ],
      },
      { name: "watermark", label: "Background watermark text", type: "text", help: 'e.g. "KAMALA" on the awards pages' },
    ],
  },
  {
    type: "heroSlider",
    label: "Home hero with slider",
    description: "Headline, description, two buttons and an auto-playing image slider.",
    fields: [
      { name: "eyebrow", label: "Eyebrow", type: "inline-html" },
      { name: "titleHtml", label: "Headline", type: "inline-html", required: true, help: "Wrap words in <em> for the italic accent." },
      { name: "description", label: "Description", type: "textarea" },
      ...cta("primary", "Primary button"),
      ...cta("secondary", "Secondary button"),
      { name: "intervalMs", label: "Autoplay interval (ms)", type: "number", min: 1000, max: 60000 },
      slides(),
    ],
  },
  {
    type: "marquee",
    label: "Scrolling announcement strip",
    description: "Announcements scrolling across the page; links allowed.",
    fields: [{ name: "items", label: "Items", type: "list", itemLabel: "Item", fields: [{ name: "html", label: "Text", type: "inline-html", required: true }] }],
  },
  {
    type: "quote",
    label: "Quote band",
    description: "Large quotation with attribution.",
    fields: [
      { name: "text", label: "Quote", type: "textarea", required: true },
      { name: "attribution", label: "Attribution", type: "text" },
    ],
  },
  {
    type: "mission",
    label: "Mission pillars + feature card",
    description: "Home page mission statement, pillars and the Kamala Awards feature card.",
    fields: [
      { name: "title", label: "Title", type: "text" },
      { name: "subtitle", label: "Subtitle", type: "textarea" },
      { name: "pillars", label: "Pillars", type: "list", itemLabel: "Pillar", fields: [
        { name: "title", label: "Title", type: "text", required: true },
        { name: "text", label: "Text", type: "textarea" },
      ] },
      { name: "cardEnabled", label: "Show feature card", type: "boolean" },
      { name: "cardHref", label: "Card link", type: "url" },
      { name: "cardCoverOrg", label: "Cover: organisation line", type: "text" },
      { name: "cardCoverTitle", label: "Cover: script title", type: "text" },
      { name: "cardCoverYear", label: "Cover: year", type: "text" },
      { name: "cardCoverCta", label: "Cover: call to action", type: "text" },
      { name: "cardHeading", label: "Card heading", type: "text" },
      { name: "cardSubheading", label: "Card subheading", type: "text" },
      { name: "cardDateLabel", label: "Date label", type: "text" },
      { name: "cardDate", label: "Date", type: "text" },
      { name: "cardLinkLabel", label: "Link label", type: "text" },
    ],
  },
  {
    type: "artisans",
    label: "Artisans scroller",
    description: "Horizontally scrolling artisan portraits (managed under People → Artisans).",
    fields: [
      { name: "tag", label: "Eyebrow", type: "text" },
      { name: "title", label: "Title", type: "text" },
      ...cta("button", "Button"),
    ],
  },
  {
    type: "retail",
    label: "Shop feature with slider",
    description: "Kamala Craft Shop text, two buttons and an image slider.",
    fields: [
      { name: "tag", label: "Eyebrow", type: "text" },
      { name: "title", label: "Title", type: "text" },
      { name: "paragraphs", label: "Paragraphs", type: "list", itemLabel: "Paragraph", fields: [{ name: "text", label: "Text", type: "textarea" }] },
      ...cta("primary", "Primary button"),
      ...cta("secondary", "Secondary button"),
      { name: "intervalMs", label: "Autoplay interval (ms)", type: "number", min: 1000, max: 60000 },
      slides(),
    ],
  },
  {
    type: "homeEvents",
    label: "Upcoming events grid",
    description: "Next upcoming events (first one featured). Data comes from Events.",
    fields: [
      { name: "tag", label: "Eyebrow", type: "text" },
      { name: "title", label: "Title", type: "text" },
      ...cta("link", "Link"),
      { name: "limit", label: "Number of events", type: "number", min: 1, max: 12 },
      { name: "emptyText", label: "Text when there are no upcoming events", type: "text" },
    ],
  },
  {
    type: "homeAwards",
    label: "Awardees scroller",
    description: "Featured award recipients (managed under Awards).",
    fields: [
      { name: "tag", label: "Eyebrow", type: "text" },
      { name: "title", label: "Title", type: "text" },
      ...cta("link", "Link"),
    ],
  },
  {
    type: "history",
    label: "History with portrait",
    description: "About page history block.",
    fields: [
      { name: "anchor", label: "Anchor id", type: "text" },
      { name: "tag", label: "Eyebrow", type: "text" },
      { name: "title", label: "Title", type: "text" },
      { name: "portraitImage", label: "Portrait image", type: "image" },
      { name: "portraitAlt", label: "Portrait alt text", type: "text" },
      { name: "portraitName", label: "Portrait name", type: "text" },
      { name: "portraitYears", label: "Portrait years", type: "text" },
      { name: "portraitDescHtml", label: "Portrait description", type: "inline-html" },
      { name: "pill", label: "Pill label", type: "text" },
      { name: "quote", label: "Quote", type: "textarea" },
      { name: "bodyHtml", label: "Body", type: "html" },
    ],
  },
  {
    type: "visionMission",
    label: "Vision & mission cards",
    description: "Cards with an accent bar.",
    fields: [
      { name: "anchor", label: "Anchor id", type: "text" },
      { name: "tag", label: "Eyebrow", type: "text" },
      { name: "title", label: "Title", type: "text" },
      { name: "cards", label: "Cards", type: "list", itemLabel: "Card", fields: [
        { name: "anchor", label: "Anchor id", type: "text" },
        { name: "title", label: "Title", type: "text" },
        { name: "html", label: "Text", type: "inline-html" },
        { name: "accent", label: "Accent colour (CSS)", type: "text" },
      ] },
    ],
  },
  {
    type: "team",
    label: "Team lists",
    description: "Executive Committee and Office Bearers (managed under People → Team).",
    fields: [
      { name: "anchor", label: "Anchor id", type: "text" },
      { name: "tag", label: "Eyebrow", type: "text" },
      { name: "title", label: "Title", type: "text" },
      { name: "note", label: "Note", type: "textarea" },
      { name: "membersTitle", label: "Members column title", type: "text" },
      { name: "bearersTitle", label: "Office bearers column title", type: "text" },
    ],
  },
  {
    type: "anchorBar",
    label: "Sticky anchor bar",
    description: "In-page navigation that highlights the section in view.",
    fields: [{ name: "links", label: "Links", type: "list", itemLabel: "Link", fields: [
      { name: "label", label: "Label", type: "text", required: true },
      { name: "anchor", label: "Anchor id", type: "text", required: true },
    ] }],
  },
  {
    type: "featureBlock",
    label: "Text + image slider block",
    description: "What-we-do style block with text on one side and a slider on the other.",
    fields: [
      { name: "anchor", label: "Anchor id", type: "text" },
      { name: "title", label: "Title", type: "text" },
      {
        name: "layout",
        label: "Image position",
        type: "select",
        options: [
          { value: "img-right", label: "Image right" },
          { value: "img-left", label: "Image left" },
        ],
      },
      { name: "dividerColor", label: "Divider colour (CSS)", type: "text" },
      { name: "bodyHtml", label: "Body", type: "html" },
      { name: "intervalMs", label: "Autoplay interval (ms)", type: "number", min: 1000, max: 60000 },
      slides(true),
    ],
  },
  {
    type: "kamalaCall",
    label: "Awards call for applications",
    description: "Cover art, deadline and application links.",
    fields: [
      { name: "anchor", label: "Anchor id", type: "text" },
      { name: "coverOrg", label: "Cover: organisation line", type: "text" },
      { name: "coverTitle", label: "Cover: script title", type: "text" },
      { name: "coverYear", label: "Cover: year", type: "text" },
      { name: "coverCta", label: "Cover: call to action", type: "text" },
      { name: "badge", label: "Badge", type: "text" },
      { name: "title", label: "Title", type: "text" },
      { name: "subtitle", label: "Subtitle", type: "text" },
      { name: "introHtml", label: "Introduction", type: "html" },
      { name: "deadlineLabel", label: "Deadline label", type: "text" },
      { name: "deadline", label: "Deadline", type: "text" },
      ...cta("primary", "Primary button"),
      ...cta("secondary", "Secondary button"),
    ],
  },
  {
    type: "awardCategories",
    label: "Award categories",
    description: "Intro text plus the categories managed under Awards.",
    fields: [
      { name: "title", label: "Title", type: "text" },
      { name: "introHtml", label: "Introduction", type: "inline-html" },
    ],
  },
  {
    type: "awardeeCards",
    label: "Featured awardee cards",
    description: "Photo cards for featured recipients, optionally followed by yearly tables.",
    fields: [
      { name: "tag", label: "Eyebrow", type: "text" },
      { name: "title", label: "Title", type: "text" },
      {
        name: "tablesListing",
        label: "Tables shown below the cards",
        type: "select",
        options: [
          { value: "none", label: "None" },
          { value: "awards", label: "Recent (awards page)" },
          { value: "past-awards", label: "Past (archive page)" },
        ],
      },
    ],
  },
  {
    type: "awardTables",
    label: "Award recipient tables",
    description: "Yearly tables of recipients.",
    fields: [
      {
        name: "listing",
        label: "Which recipients",
        type: "select",
        options: [
          { value: "awards", label: "Recent (awards page)" },
          { value: "past-awards", label: "Past (archive page)" },
        ],
      },
      { name: "tag", label: "Eyebrow", type: "text" },
      { name: "title", label: "Title", type: "text" },
    ],
  },
  {
    type: "contact",
    label: "Contact form + details",
    description: "Enquiry form and contact information from Settings.",
    fields: [
      { name: "formTitle", label: "Form title", type: "text" },
      { name: "formIntro", label: "Form introduction", type: "textarea" },
      { name: "successMessage", label: "Success message", type: "text" },
      { name: "infoTitle", label: "Details title", type: "text" },
    ],
  },
  {
    type: "councils",
    label: "State councils grid",
    description: "Affiliated State Councils (managed under Councils).",
    fields: [
      { name: "tag", label: "Eyebrow", type: "text" },
      { name: "title", label: "Title", type: "text" },
      { name: "intro", label: "Introduction", type: "textarea" },
      { name: "networkTag", label: "Network block: eyebrow", type: "text" },
      { name: "networkTitle", label: "Network block: title", type: "text" },
      { name: "networkHtml", label: "Network block: text", type: "html" },
      { name: "networkImage", label: "Network block: map image", type: "image" },
      { name: "networkImageAlt", label: "Network block: map alt text", type: "text" },
    ],
  },
  {
    type: "richText",
    label: "Rich text",
    description: "Free-form formatted text.",
    fields: [
      { name: "html", label: "Content", type: "html" },
      {
        name: "wrapper",
        label: "Layout",
        type: "select",
        options: [
          { value: "privacy", label: "Privacy-policy style page" },
          { value: "terms", label: "Terms style page" },
          { value: "section", label: "Standard section" },
        ],
      },
    ],
  },
  {
    type: "publications",
    label: "Publications listing",
    description: "Featured issue plus card grid for one publication type.",
    fields: [
      {
        name: "kind",
        label: "Publication type",
        type: "select",
        options: [
          { value: "BOOK", label: "Books" },
          { value: "NEWSLETTER", label: "Newsletters" },
          { value: "HAPPENINGS", label: "Happenings in Handmade" },
          { value: "REPORT", label: "Reports" },
        ],
      },
      { name: "archived", label: "Show archived issues (past page)", type: "boolean" },
      { name: "featuredBadge", label: "Featured badge text", type: "text" },
      { name: "gridClass", label: "Grid style", type: "select", options: [
        { value: "nl-grid-newsletter", label: "Newsletter grid" },
        { value: "nl-grid-reports", label: "Reports grid" },
        { value: "nl-grid", label: "Default grid" },
      ] },
      { name: "showCardActions", label: "Show read/download links on cards", type: "boolean" },
      ...cta("footer", "Footer link"),
    ],
  },
  {
    type: "listingFilters",
    label: "Listing labels",
    description: "Intro and labels for listing pages (events, news, press, crafts map, processes).",
    fields: [
      { name: "intro", label: "Introduction", type: "textarea" },
      { name: "emptyText", label: "Empty-state heading", type: "text" },
      { name: "emptyHint", label: "Empty-state hint", type: "text" },
      ...cta("footer", "Footer link"),
    ],
  },
];

export const SECTION_TYPES = SECTION_DEFS.map((d) => d.type);
export const sectionDef = (type: string) => SECTION_DEFS.find((d) => d.type === type);

function fieldSchema(f: FieldDef): z.ZodTypeAny {
  switch (f.type) {
    case "number": {
      let s = z.coerce.number();
      if (f.min !== undefined) s = s.min(f.min);
      if (f.max !== undefined) s = s.max(f.max);
      return f.required ? s : s.optional();
    }
    case "boolean":
      return z.boolean().optional();
    case "select":
      return z.enum(f.options.map((o) => o.value) as [string, ...string[]]).optional();
    case "list":
      return z.array(z.object(Object.fromEntries(f.fields.map((x) => [x.name, fieldSchema(x)])))).default([]);
    case "url":
      return f.required
        ? z.string().trim().min(1).max(2000)
        : z.string().trim().max(2000).optional();
    default: {
      const max = f.type === "html" ? 200_000 : f.type === "textarea" || f.type === "inline-html" ? 10_000 : 500;
      return f.required ? z.string().trim().min(1, `${f.label} is required`).max(max) : z.string().max(max).optional();
    }
  }
}

const schemaCache = new Map<string, z.ZodTypeAny>();
export function sectionDataSchema(type: string): z.ZodTypeAny {
  const def = sectionDef(type);
  if (!def) throw new Error(`Unknown section type "${type}"`);
  if (!schemaCache.has(type)) {
    schemaCache.set(type, z.object(Object.fromEntries(def.fields.map((f) => [f.name, fieldSchema(f)]))));
  }
  return schemaCache.get(type)!;
}

export interface Section<T = Record<string, unknown>> {
  id: string;
  type: string;
  hidden?: boolean;
  data: T;
}

export const sectionsSchema = z
  .array(
    z.object({
      id: z.string().min(1).max(64),
      type: z.enum(SECTION_TYPES as [string, ...string[]]),
      hidden: z.boolean().optional(),
      data: z.record(z.string(), z.unknown()),
    }),
  )
  .max(60)
  .superRefine((sections, ctx) => {
    sections.forEach((s, i) => {
      const r = sectionDataSchema(s.type).safeParse(s.data);
      if (!r.success) {
        for (const issue of r.error.issues) {
          ctx.addIssue({ code: "custom", path: [i, "data", ...issue.path], message: issue.message });
        }
      }
    });
  });

/** Parses stored JSON into sections, skipping (and reporting) invalid entries instead of crashing a public page. */
export function readSections(value: unknown): Section[] {
  if (!Array.isArray(value)) return [];
  return value.filter((s): s is Section => {
    const ok = !!s && typeof s === "object" && typeof (s as Section).type === "string" && !!sectionDef((s as Section).type);
    if (!ok) console.warn("[sections] skipping invalid section", s);
    return ok;
  });
}
