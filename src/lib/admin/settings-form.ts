import type { Fieldset } from "./fields";

/** Admin form layout for site settings; keys match SETTINGS_SCHEMA. */
export const SETTINGS_FIELDSETS: Fieldset[] = [
  {
    legend: "Brand",
    fields: [
      { name: "site.name", label: "Site name", type: "text", required: true },
      { name: "site.shortName", label: "Short name", type: "text" },
      { name: "site.logo", label: "Logo", type: "image" },
      { name: "site.favicon", label: "Favicon", type: "image" },
      { name: "site.themeColor", label: "Browser theme colour", type: "color" },
      { name: "site.copyright", label: "Footer copyright line", type: "text" },
    ],
  },
  {
    legend: "Header & footer",
    fields: [
      { name: "nav.ctaLabel", label: "Header button label", type: "text" },
      { name: "nav.ctaHref", label: "Header button link", type: "url" },
      { name: "footer.quickLinksTitle", label: "Footer column 1 title", type: "text" },
      { name: "footer.resourcesTitle", label: "Footer column 2 title", type: "text" },
      { name: "footer.connectTitle", label: "Footer column 3 title", type: "text" },
    ],
  },
  {
    legend: "Contact details",
    fields: [
      { name: "contact.addressLines", label: "Address lines", type: "strings" },
      { name: "contact.email", label: "Email", type: "text" },
      { name: "contact.phones", label: "Phone numbers (contact page)", type: "strings" },
      { name: "contact.footerPhone", label: "Phone number (footer & structured data)", type: "text" },
      { name: "contact.officeHours", label: "Office hours", type: "strings" },
    ],
  },
  {
    legend: "Social media",
    fields: [
      {
        name: "social.links",
        label: "Profiles",
        type: "list",
        itemLabel: "Profile",
        fields: [
          {
            name: "platform",
            label: "Platform",
            type: "select",
            options: ["facebook", "instagram", "youtube", "linkedin", "x", "other"].map((v) => ({ value: v, label: v })),
          },
          { name: "label", label: "Label", type: "text" },
          { name: "url", label: "URL", type: "url" },
        ],
      },
      { name: "instagram.enabled", label: "Show the Instagram band above the footer", type: "boolean" },
      { name: "instagram.handle", label: "Instagram handle", type: "text" },
      { name: "instagram.profileUrl", label: "Instagram profile URL", type: "url" },
      { name: "instagram.beholdFeedUrl", label: "Behold.so feed URL", type: "url", help: "Free plan has a monthly view limit; the site caches the feed for 6 hours per visitor." },
      { name: "instagram.fallbackImages", label: "Fallback images when the feed is unavailable (paths)", type: "strings" },
    ],
  },
  {
    legend: "Search engines & analytics",
    fields: [
      { name: "seo.titleTemplate", label: "Title template", type: "text", help: "%s is replaced by the page title." },
      { name: "seo.defaultTitle", label: "Default title", type: "text" },
      { name: "seo.defaultDescription", label: "Default meta description", type: "textarea" },
      { name: "seo.defaultOgImage", label: "Default social sharing image", type: "image" },
      { name: "seo.organizationJsonLd", label: "Output Organization structured data", type: "boolean" },
      { name: "analytics.gaMeasurementId", label: "Google Analytics 4 measurement ID", type: "text", help: "e.g. G-XXXXXXX. Leave empty to disable analytics." },
    ],
  },
  {
    legend: "Contact form",
    fields: [
      { name: "forms.contact.enabled", label: "Accept enquiries", type: "boolean" },
      { name: "forms.contact.notifyTo", label: "Send enquiries to (email)", type: "text" },
      { name: "forms.contact.subject", label: "Notification email subject", type: "text" },
      { name: "forms.contact.successMessage", label: "Success message", type: "text" },
    ],
  },
];
