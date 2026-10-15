import type { Fieldset } from "./fields";

/**
 * Admin resource registry. One entry per CMS content type; drives list pages, edit forms,
 * validation and permission checks. Persistence lives in resource-store.ts (server only).
 */

export type ResourceKind = "content" | "simple";

export interface ListColumn {
  name: string;
  label: string;
  format?: "date" | "datetime" | "status" | "boolean" | "image" | "code";
}

export interface ResourceDef {
  key: string;
  label: string;
  singular: string;
  /** Permission prefix, e.g. "events" → events.read / events.update … or awards.manage for simple resources. */
  permission: string;
  kind: ResourceKind;
  titleField: string;
  columns: ListColumn[];
  searchFields: string[];
  filters?: { name: string; label: string; options: { value: string; label: string }[] }[];
  fieldsets: Fieldset[];
  /** Public URL of a record (for "View" links); null when not publicly routable. */
  publicPath?: (r: Record<string, unknown>) => string | null;
  previewable?: boolean;
  description?: string;
}

const seo: Fieldset = {
  legend: "Search engines & sharing",
  fields: [
    { name: "metaTitle", label: "Meta title", type: "text", help: "Full <title>. Leave empty to use the default." },
    { name: "metaDescription", label: "Meta description", type: "textarea", help: "About 150 characters." },
    { name: "noindex", label: "Hide from search engines (noindex)", type: "boolean" },
  ],
};

const publishing: Fieldset = {
  legend: "Publishing",
  fields: [
    {
      name: "status",
      label: "Status",
      type: "select",
      options: [
        { value: "DRAFT", label: "Draft" },
        { value: "IN_REVIEW", label: "In review" },
        { value: "SCHEDULED", label: "Scheduled" },
        { value: "PUBLISHED", label: "Published" },
        { value: "ARCHIVED", label: "Archived" },
      ],
      help: "Publishing, scheduling and archiving need publish permission.",
    },
    { name: "publishAt", label: "Publish at (for Scheduled)", type: "datetime" },
    { name: "sortOrder", label: "Sort order", type: "number" },
  ],
};

/** Pages are ordered by slug, so their publishing block has no sort order. */
const pagePublishing: Fieldset = { legend: "Publishing", fields: publishing.fields.filter((f) => f.name !== "sortOrder") };

const STATUS_FILTER = {
  name: "status",
  label: "Status",
  options: [
    { value: "DRAFT", label: "Draft" },
    { value: "IN_REVIEW", label: "In review" },
    { value: "SCHEDULED", label: "Scheduled" },
    { value: "PUBLISHED", label: "Published" },
    { value: "ARCHIVED", label: "Archived" },
  ],
};

export const RESOURCES: ResourceDef[] = [
  {
    key: "pages",
    label: "Pages",
    singular: "Page",
    permission: "pages",
    kind: "content",
    titleField: "title",
    columns: [
      { name: "title", label: "Title" },
      { name: "slug", label: "Slug", format: "code" },
      { name: "template", label: "Template" },
      { name: "status", label: "Status", format: "status" },
      { name: "updatedAt", label: "Updated", format: "datetime" },
    ],
    searchFields: ["title", "slug"],
    filters: [STATUS_FILTER],
    publicPath: (r) => (r.slug === "home" ? "/" : `/${r.slug}`),
    previewable: true,
    fieldsets: [
      {
        legend: "Page",
        fields: [
          { name: "title", label: "Title", type: "text", required: true },
          { name: "slug", label: "Slug (URL)", type: "slug", help: '"home" is the home page. Built-in pages keep their URL.' },
          {
            name: "template",
            label: "Template",
            type: "select",
            options: ["standard", "home", "about", "what-we-do", "awards", "contact", "listing", "publications"].map((v) => ({ value: v, label: v })),
          },
          { name: "sections", label: "Sections", type: "sections" },
        ],
      },
      pagePublishing,
      {
        legend: "Search engines & sharing",
        fields: [...seo.fields, { name: "canonicalUrl", label: "Canonical URL override", type: "url" }, { name: "ogImage", label: "Social sharing image", type: "image" }],
      },
    ],
  },
  {
    key: "events",
    label: "Events",
    singular: "Event",
    permission: "events",
    kind: "content",
    titleField: "title",
    columns: [
      { name: "image", label: "", format: "image" },
      { name: "title", label: "Title" },
      { name: "dateText", label: "Dates" },
      { name: "collection", label: "Collection" },
      { name: "status", label: "Status", format: "status" },
    ],
    searchFields: ["title", "slug", "venue", "city", "dateText"],
    filters: [
      STATUS_FILTER,
      { name: "collection", label: "Collection", options: [{ value: "CURRENT", label: "Events page" }, { value: "ARCHIVE", label: "Past events archive" }] },
    ],
    publicPath: (r) => `/events/${r.slug}`,
    previewable: true,
    fieldsets: [
      {
        legend: "Event",
        fields: [
          { name: "title", label: "Title", type: "text", required: true },
          { name: "slug", label: "Slug (URL)", type: "slug" },
          { name: "subtitle", label: "Short description", type: "textarea" },
          {
            name: "collection",
            label: "Shown on",
            type: "select",
            options: [
              { value: "CURRENT", label: "Events page" },
              { value: "ARCHIVE", label: "Past events archive" },
            ],
          },
          { name: "type", label: "Type", type: "text", help: "e.g. exhibition, workshop, award, conference, event. Filters use exhibition/workshop." },
          { name: "image", label: "Hero / card image", type: "image" },
          { name: "descriptionHtml", label: "About this event", type: "html" },
          { name: "writeupHtml", label: "Exhibition overview (optional)", type: "html" },
        ],
      },
      {
        legend: "Date & place",
        fields: [
          { name: "dateText", label: "Dates as displayed", type: "text", help: 'Free text, e.g. "9, 10 & 12 October 2026".' },
          { name: "startDate", label: "Start date", type: "date", help: "Controls upcoming/past and sort order. Filled automatically from the text if left empty." },
          { name: "endDate", label: "End date", type: "date" },
          { name: "timeText", label: "Time", type: "text" },
          { name: "venue", label: "Venue", type: "text" },
          { name: "city", label: "City", type: "text" },
          { name: "address", label: "Address", type: "textarea" },
          { name: "mapLink", label: "Google Maps link", type: "url" },
          { name: "parking", label: "Parking", type: "text" },
        ],
      },
      {
        legend: "Tickets & contact",
        fields: [
          { name: "entryFee", label: "Entry fee (register card)", type: "text" },
          { name: "ticketPrice", label: "Fee (details card)", type: "text" },
          { name: "ageGroup", label: "Age group", type: "text" },
          { name: "contact", label: "Contact numbers", type: "strings" },
          { name: "registrationUrl", label: "Registration link", type: "url" },
          {
            name: "legacyStatus",
            label: "Sidebar card",
            type: "select",
            options: [
              { value: "", label: "None" },
              { value: "upcoming", label: "Registration (needs a registration link)" },
              { value: "past", label: "\"This event has ended\"" },
            ],
          },
          { name: "pdfUrl", label: "Downloadable PDF", type: "file" },
        ],
      },
      {
        legend: "Programme & media",
        fields: [
          { name: "highlights", label: "Highlights", type: "list", itemLabel: "Highlight", fields: [
            { name: "icon", label: "Icon (emoji)", type: "text" },
            { name: "title", label: "Title", type: "text" },
            { name: "text", label: "Text", type: "textarea" },
          ] },
          { name: "schedule", label: "Schedule", type: "list", itemLabel: "Session", fields: [
            { name: "time", label: "Time", type: "text" },
            { name: "title", label: "Title", type: "text" },
            { name: "desc", label: "Description", type: "textarea" },
          ] },
          { name: "people", label: "People (artisans / facilitators / awardees)", type: "list", itemLabel: "Person", fields: [
            { name: "initials", label: "Initials", type: "text" },
            { name: "name", label: "Name", type: "text" },
            { name: "role", label: "Role", type: "text" },
            { name: "color", label: "Avatar colour", type: "color" },
          ] },
          { name: "gallery", label: "Gallery (images or MP4 videos)", type: "list", itemLabel: "Item", fields: [{ name: "src", label: "File", type: "image" }] },
          { name: "relatedSlugs", label: "Related event slugs", type: "strings" },
        ],
      },
      {
        legend: "Appearance",
        fields: [
          { name: "tagLabel", label: "Tag label", type: "text" },
          { name: "tagClass", label: "Tag style", type: "select", options: [{ value: "", label: "Default" }, { value: "upcoming", label: "Upcoming" }, { value: "past", label: "Past" }] },
          { name: "heroGradient", label: "Fallback gradient (CSS)", type: "text" },
          { name: "heroEmoji", label: "Fallback emoji", type: "text" },
          { name: "sourceLink", label: "Original URL on the old site", type: "readonly" },
        ],
      },
      publishing,
      seo,
    ],
  },
  {
    key: "news",
    label: "News",
    singular: "News article",
    permission: "news",
    kind: "content",
    titleField: "title",
    columns: [
      { name: "image", label: "", format: "image" },
      { name: "title", label: "Title" },
      { name: "city", label: "City" },
      { name: "status", label: "Status", format: "status" },
      { name: "updatedAt", label: "Updated", format: "datetime" },
    ],
    searchFields: ["title", "slug", "subtitle"],
    filters: [STATUS_FILTER],
    publicPath: (r) => `/news/${r.slug}`,
    previewable: true,
    fieldsets: [
      {
        legend: "Article",
        fields: [
          { name: "title", label: "Title", type: "text", required: true },
          { name: "slug", label: "Slug (URL)", type: "slug" },
          { name: "subtitle", label: "Subtitle", type: "textarea" },
          { name: "image", label: "Hero / card image", type: "image" },
          { name: "bodyHtml", label: "Body", type: "html", help: "YouTube embeds are allowed (paste the iframe in HTML view)." },
          { name: "gallery", label: "Gallery", type: "list", itemLabel: "Item", fields: [
            { name: "type", label: "Type", type: "select", options: [{ value: "image", label: "Image" }, { value: "youtube", label: "YouTube video" }] },
            { name: "src", label: "Image", type: "image" },
            { name: "url", label: "YouTube URL", type: "url" },
          ] },
        ],
      },
      {
        legend: "Details",
        fields: [
          { name: "type", label: "Type", type: "text" },
          { name: "dateText", label: "Date (as displayed)", type: "text" },
          { name: "venue", label: "Venue", type: "text" },
          { name: "city", label: "City", type: "text" },
          { name: "tagLabel", label: "Tag label", type: "text" },
          { name: "tagClass", label: "Tag style", type: "text" },
          { name: "heroGradient", label: "Fallback gradient (CSS)", type: "text" },
          { name: "heroEmoji", label: "Fallback emoji", type: "text" },
        ],
      },
      publishing,
      seo,
    ],
  },
  {
    key: "press",
    label: "Press",
    singular: "Press coverage",
    permission: "press",
    kind: "content",
    titleField: "title",
    columns: [
      { name: "title", label: "Title" },
      { name: "year", label: "Year" },
      { name: "status", label: "Status", format: "status" },
      { name: "updatedAt", label: "Updated", format: "datetime" },
    ],
    searchFields: ["title", "slug", "year"],
    filters: [STATUS_FILTER],
    publicPath: (r) => `/press/${r.slug}`,
    previewable: true,
    fieldsets: [
      {
        legend: "Coverage",
        fields: [
          { name: "title", label: "Title", type: "text", required: true },
          { name: "slug", label: "Slug (URL)", type: "slug" },
          { name: "year", label: "Year (or range, e.g. 1980-1990)", type: "text", required: true },
          { name: "subtitle", label: "Description", type: "textarea" },
          { name: "image", label: "Cover image", type: "image" },
          { name: "heroGradient", label: "Fallback gradient (CSS)", type: "text" },
          { name: "groups", label: "Media outlets", type: "list", itemLabel: "Outlet", fields: [
            { name: "media", label: "Publication name", type: "text", required: true },
            { name: "dateText", label: "Date", type: "text" },
            { name: "readOnlineUrl", label: "Read online link", type: "url" },
            { name: "items", label: "Clippings (images or PDFs)", type: "list", itemLabel: "Clipping", fields: [{ name: "src", label: "File", type: "image" }] },
          ] },
        ],
      },
      publishing,
      seo,
    ],
  },
  {
    key: "publications",
    label: "Publications",
    singular: "Publication",
    permission: "publications",
    kind: "content",
    titleField: "title",
    description: "Books, newsletters, Happenings in Handmade and reports.",
    columns: [
      { name: "coverImage", label: "", format: "image" },
      { name: "title", label: "Title" },
      { name: "kind", label: "Type" },
      { name: "cardSubtitle", label: "Date / author" },
      { name: "isFeatured", label: "Featured", format: "boolean" },
      { name: "isArchived", label: "Archive page", format: "boolean" },
      { name: "status", label: "Status", format: "status" },
    ],
    searchFields: ["title", "cardSubtitle", "dateLabel"],
    filters: [
      STATUS_FILTER,
      {
        name: "kind",
        label: "Type",
        options: [
          { value: "BOOK", label: "Books" },
          { value: "NEWSLETTER", label: "Newsletters" },
          { value: "HAPPENINGS", label: "Happenings in Handmade" },
          { value: "REPORT", label: "Reports" },
        ],
      },
    ],
    fieldsets: [
      {
        legend: "Publication",
        fields: [
          {
            name: "kind",
            label: "Type",
            type: "select",
            options: [
              { value: "BOOK", label: "Book" },
              { value: "NEWSLETTER", label: "Newsletter" },
              { value: "HAPPENINGS", label: "Happenings in Handmade" },
              { value: "REPORT", label: "Report" },
            ],
          },
          { name: "title", label: "Title", type: "text", required: true },
          { name: "cardTitleHtml", label: "Card title (line breaks allowed)", type: "inline-html" },
          { name: "cardSubtitle", label: "Line under the title (date or author)", type: "text" },
          { name: "coverImage", label: "Cover image", type: "image" },
          { name: "coverAlt", label: "Cover alt text", type: "text" },
          { name: "fileUrl", label: "PDF file", type: "file" },
          { name: "isFeatured", label: "Featured as \"latest\" at the top of the page", type: "boolean" },
          { name: "isArchived", label: "Show on the past/archive page", type: "boolean" },
          { name: "groupLabel", label: "Archive group heading (e.g. year)", type: "text" },
        ],
      },
      {
        legend: "Card & featured block details",
        fields: [
          { name: "coverLogoHtml", label: "Cover logo text", type: "inline-html" },
          { name: "coverHeadline", label: "Cover headline", type: "inline-html" },
          { name: "coverBackground", label: "Cover background (CSS)", type: "text" },
          { name: "dateLabel", label: "Featured block date", type: "text" },
          { name: "descriptionHtml", label: "Featured block description", type: "inline-html" },
          { name: "actionLabel", label: "Button / link label", type: "text" },
          { name: "showRead", label: "Show \"Read online\" link", type: "boolean" },
          { name: "showDownload", label: "Show download icon", type: "boolean" },
        ],
      },
      publishing,
    ],
  },
  {
    key: "awards",
    label: "Award recipients",
    singular: "Award recipient",
    permission: "awards",
    kind: "simple",
    titleField: "name",
    columns: [
      { name: "photo", label: "", format: "image" },
      { name: "year", label: "Year" },
      { name: "name", label: "Name" },
      { name: "award", label: "Award" },
      { name: "listing", label: "Page" },
      { name: "isFeatured", label: "Featured", format: "boolean" },
      { name: "isPublished", label: "Visible", format: "boolean" },
    ],
    searchFields: ["name", "award", "craft", "state", "year"],
    filters: [{ name: "listing", label: "Page", options: [{ value: "awards", label: "Awards" }, { value: "past-awards", label: "Past awards" }] }],
    fieldsets: [
      {
        legend: "Recipient",
        fields: [
          { name: "year", label: "Year", type: "text", required: true },
          { name: "name", label: "Name", type: "text" },
          { name: "award", label: "Award", type: "text" },
          { name: "craft", label: "Craft", type: "text" },
          { name: "state", label: "State", type: "text" },
          { name: "photo", label: "Photo (featured cards)", type: "image" },
          { name: "photoAlt", label: "Photo alt text", type: "text" },
          { name: "isFeatured", label: "Featured (photo card + home page scroller)", type: "boolean" },
          { name: "listing", label: "Table on", type: "select", options: [{ value: "awards", label: "Awards page" }, { value: "past-awards", label: "Past awards page" }] },
          { name: "sortOrder", label: "Sort order", type: "number" },
          { name: "isPublished", label: "Visible on the site", type: "boolean" },
        ],
      },
    ],
  },
  {
    key: "award-categories",
    label: "Award categories",
    singular: "Award category",
    permission: "awards",
    kind: "simple",
    titleField: "name",
    columns: [
      { name: "name", label: "Name" },
      { name: "sortOrder", label: "Order" },
      { name: "isPublished", label: "Visible", format: "boolean" },
    ],
    searchFields: ["name"],
    fieldsets: [
      {
        legend: "Category",
        fields: [
          { name: "name", label: "Name", type: "text", required: true },
          { name: "description", label: "Description", type: "inline-html" },
          { name: "sortOrder", label: "Sort order", type: "number" },
          { name: "isPublished", label: "Visible", type: "boolean" },
        ],
      },
    ],
  },
  {
    key: "artisans",
    label: "Artisans",
    singular: "Artisan",
    permission: "people",
    kind: "simple",
    titleField: "name",
    columns: [
      { name: "photo", label: "", format: "image" },
      { name: "name", label: "Name" },
      { name: "craft", label: "Craft" },
      { name: "sortOrder", label: "Order" },
      { name: "isPublished", label: "Visible", format: "boolean" },
    ],
    searchFields: ["name", "craft"],
    fieldsets: [
      {
        legend: "Artisan",
        fields: [
          { name: "name", label: "Name", type: "text", required: true },
          { name: "craft", label: "Craft", type: "text" },
          { name: "photo", label: "Photo", type: "image" },
          { name: "sortOrder", label: "Sort order", type: "number" },
          { name: "isPublished", label: "Visible", type: "boolean" },
        ],
      },
    ],
  },
  {
    key: "team",
    label: "Team",
    singular: "Team member",
    permission: "people",
    kind: "simple",
    titleField: "name",
    columns: [
      { name: "name", label: "Name" },
      { name: "group", label: "Group" },
      { name: "role", label: "Role" },
      { name: "sortOrder", label: "Order" },
      { name: "isPublished", label: "Visible", format: "boolean" },
    ],
    searchFields: ["name", "role"],
    filters: [{ name: "group", label: "Group", options: [{ value: "EC_MEMBER", label: "EC members" }, { value: "OFFICE_BEARER", label: "Office bearers" }] }],
    fieldsets: [
      {
        legend: "Member",
        fields: [
          { name: "name", label: "Name", type: "text", required: true },
          { name: "group", label: "Group", type: "select", options: [{ value: "EC_MEMBER", label: "EC member" }, { value: "OFFICE_BEARER", label: "Office bearer" }] },
          { name: "role", label: "Role (office bearers)", type: "text" },
          { name: "sortOrder", label: "Sort order", type: "number" },
          { name: "isPublished", label: "Visible", type: "boolean" },
        ],
      },
    ],
  },
  {
    key: "councils",
    label: "State councils",
    singular: "State council",
    permission: "councils",
    kind: "simple",
    titleField: "name",
    columns: [
      { name: "logo", label: "", format: "image" },
      { name: "name", label: "Name" },
      { name: "abbreviation", label: "Short" },
      { name: "state", label: "State" },
      { name: "isPublished", label: "Visible", format: "boolean" },
    ],
    searchFields: ["name", "abbreviation", "state"],
    fieldsets: [
      {
        legend: "Council",
        fields: [
          { name: "name", label: "Name", type: "text", required: true },
          { name: "abbreviation", label: "Abbreviation", type: "text", required: true },
          { name: "logo", label: "Logo", type: "image" },
          { name: "established", label: "Established", type: "text" },
          { name: "state", label: "State", type: "text" },
          { name: "focusLabel", label: "Third fact label", type: "text", help: '"Focus" or "Members"' },
          { name: "focus", label: "Third fact", type: "text" },
          { name: "description", label: "Description", type: "textarea" },
          { name: "address", label: "Address (one line per row)", type: "textarea" },
          { name: "phone", label: "Phone (one per row)", type: "textarea" },
          { name: "email", label: "Email", type: "text" },
          { name: "sortOrder", label: "Sort order", type: "number" },
          { name: "isPublished", label: "Visible", type: "boolean" },
        ],
      },
    ],
  },
  {
    key: "craft-states",
    label: "Crafts map",
    singular: "State / UT",
    permission: "crafts",
    kind: "simple",
    titleField: "name",
    columns: [
      { name: "name", label: "State / UT" },
      { name: "code", label: "Map id", format: "code" },
      { name: "isPublished", label: "Visible", format: "boolean" },
    ],
    searchFields: ["name", "code"],
    fieldsets: [
      {
        legend: "State",
        fields: [
          { name: "name", label: "Name", type: "text", required: true },
          { name: "code", label: "Map id (two letters used by the SVG map)", type: "text", required: true },
          { name: "mapImage", label: "State craft map image", type: "image" },
          { name: "isPublished", label: "Visible", type: "boolean" },
          { name: "sortOrder", label: "Sort order", type: "number" },
          { name: "locations", label: "Crafts by district", type: "list", itemLabel: "Craft", fields: [
            { name: "craft", label: "Craft", type: "text", required: true },
            { name: "district", label: "District", type: "text" },
            { name: "village", label: "Villages", type: "text" },
          ] },
          { name: "images", label: "Craft photos", type: "list", itemLabel: "Photo", fields: [{ name: "src", label: "Image", type: "image" }] },
        ],
      },
    ],
  },
  {
    key: "processes",
    label: "Craft processes",
    singular: "Craft process",
    permission: "processes",
    kind: "simple",
    titleField: "title",
    columns: [
      { name: "icon", label: "", format: "image" },
      { name: "title", label: "Title" },
      { name: "category", label: "Category" },
      { name: "isPublished", label: "Visible", format: "boolean" },
    ],
    searchFields: ["title", "category"],
    fieldsets: [
      {
        legend: "Process",
        fields: [
          { name: "title", label: "Title", type: "text", required: true },
          { name: "slug", label: "Identifier", type: "text", required: true },
          { name: "category", label: "Category", type: "text" },
          { name: "icon", label: "Cover image", type: "image" },
          { name: "color", label: "Background (CSS)", type: "text" },
          { name: "subtitle", label: "Subtitle", type: "textarea" },
          { name: "intro", label: "Introduction", type: "textarea" },
          { name: "materials", label: "Materials", type: "strings" },
          { name: "steps", label: "Steps", type: "list", itemLabel: "Step", fields: [
            { name: "title", label: "Title", type: "text" },
            { name: "text", label: "Text", type: "textarea" },
          ] },
          { name: "states", label: "Practised in", type: "strings" },
          { name: "sortOrder", label: "Sort order", type: "number" },
          { name: "isPublished", label: "Visible", type: "boolean" },
        ],
      },
    ],
  },
  {
    key: "menu-items",
    label: "Navigation",
    singular: "Menu item",
    permission: "navigation",
    kind: "simple",
    titleField: "label",
    columns: [
      { name: "menu", label: "Menu" },
      { name: "label", label: "Label" },
      { name: "href", label: "Link", format: "code" },
      { name: "parentLabel", label: "Parent" },
      { name: "sortOrder", label: "Order" },
      { name: "isVisible", label: "Visible", format: "boolean" },
    ],
    searchFields: ["label", "href"],
    filters: [
      {
        name: "menu",
        label: "Menu",
        options: [
          { value: "main", label: "Main navigation" },
          { value: "footer-quick", label: "Footer: quick links" },
          { value: "footer-resources", label: "Footer: resources" },
          { value: "footer-connect", label: "Footer: connect" },
          { value: "legal", label: "Footer: legal" },
        ],
      },
    ],
    fieldsets: [
      {
        legend: "Menu item",
        fields: [
          {
            name: "menu",
            label: "Menu",
            type: "select",
            options: [
              { value: "main", label: "Main navigation" },
              { value: "footer-quick", label: "Footer: quick links" },
              { value: "footer-resources", label: "Footer: resources" },
              { value: "footer-connect", label: "Footer: connect" },
              { value: "legal", label: "Footer: legal" },
            ],
          },
          { name: "label", label: "Label", type: "text", required: true },
          { name: "href", label: "Link", type: "url", help: 'Internal paths start with "/", e.g. /about#team. Use # for a dropdown parent.' },
          { name: "parentId", label: "Parent item id (dropdown)", type: "text", help: "Copy the id of a top-level item in the same menu; leave empty for top level." },
          { name: "sortOrder", label: "Sort order", type: "number" },
          { name: "openInNewTab", label: "Open in a new tab", type: "boolean" },
          { name: "isVisible", label: "Visible", type: "boolean" },
        ],
      },
    ],
  },
  {
    key: "redirects",
    label: "Redirects",
    singular: "Redirect",
    permission: "redirects",
    kind: "simple",
    titleField: "source",
    description: "Applied to URLs that do not match any page. Legacy .html URLs are already redirected automatically.",
    columns: [
      { name: "source", label: "From", format: "code" },
      { name: "destination", label: "To", format: "code" },
      { name: "permanent", label: "Permanent", format: "boolean" },
      { name: "hits", label: "Hits" },
      { name: "isActive", label: "Active", format: "boolean" },
    ],
    searchFields: ["source", "destination"],
    fieldsets: [
      {
        legend: "Redirect",
        fields: [
          { name: "source", label: "From path", type: "text", required: true, help: "Starts with /, e.g. /old-page" },
          { name: "destination", label: "To URL", type: "url", required: true },
          { name: "permanent", label: "Permanent (301/308)", type: "boolean" },
          { name: "isActive", label: "Active", type: "boolean" },
          { name: "note", label: "Note", type: "text" },
        ],
      },
    ],
  },
];

export const resourceByKey = (key: string) => RESOURCES.find((r) => r.key === key);

/** Permission string for an action on a resource (simple resources use .manage for all writes). */
const MANAGE_ONLY = new Set(["navigation", "redirects"]);

export function permissionFor(def: ResourceDef, action: "read" | "create" | "update" | "delete" | "publish"): string {
  if (def.kind === "simple") {
    return action === "read" && !MANAGE_ONLY.has(def.permission) ? `${def.permission}.read` : `${def.permission}.manage`;
  }
  return `${def.permission}.${action}`;
}
