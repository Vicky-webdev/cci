import { z } from "zod";

/** Every editable site-wide setting, with defaults matching the legacy site. */
export const SETTINGS_SCHEMA = z.object({
  "site.name": z.string().default("Crafts Council of India"),
  "site.shortName": z.string().default("CCI"),
  "site.logo": z.string().default("images/cci-logo.png"),
  "site.favicon": z.string().default("images/favico.png"),
  "site.themeColor": z.string().default("#8B3A1E"),
  "site.copyright": z.string().default("© Crafts Council of India, 2026. All rights reserved."),
  "nav.ctaLabel": z.string().default("Contact us"),
  "nav.ctaHref": z.string().default("/contact"),
  "footer.quickLinksTitle": z.string().default("Quick Links"),
  "footer.resourcesTitle": z.string().default("Resources"),
  "footer.connectTitle": z.string().default("Connect"),
  "contact.addressLines": z.array(z.string()).default([
    "GF, Temple Trees Apartments",
    "37 Venkatanarayana Road, T. Nagar",
    "Chennai – 600017, Tamil Nadu",
  ]),
  "contact.email": z.string().default("info@craftscouncilofindia.in"),
  "contact.phones": z.array(z.string()).default(["+91-44-24341456", "+91-98405 41456"]),
  "contact.footerPhone": z.string().default("+91-44-24341456"),
  "contact.officeHours": z.array(z.string()).default([
    "Monday – Friday: 10:00 AM – 5:00 PM",
    "Saturday: Closed on 2nd & 4th Saturdays",
    "Sunday: Closed",
  ]),
  "social.links": z
    .array(z.object({ platform: z.enum(["facebook", "instagram", "youtube", "linkedin", "x", "other"]), label: z.string(), url: z.string() }))
    .default([
      { platform: "facebook", label: "Facebook", url: "https://facebook.com/craftscouncilofindia" },
      { platform: "instagram", label: "Instagram", url: "https://instagram.com/craftscouncilofindia" },
      { platform: "youtube", label: "YouTube", url: "https://www.youtube.com/@thecraftscouncilofindia6335" },
      { platform: "linkedin", label: "LinkedIn", url: "https://linkedin.com/company/craftscouncilofindia" },
    ]),
  "instagram.enabled": z.boolean().default(true),
  "instagram.handle": z.string().default("@craftscouncilofindia"),
  "instagram.profileUrl": z.string().default("https://www.instagram.com/craftscouncilofindia"),
  "instagram.beholdFeedUrl": z.string().default("https://feeds.behold.so/nUTFUE5VrVvIS91W91Ta"),
  "instagram.fallbackImages": z.array(z.string()).default([
    "images/promote1.webp", "images/sustain1.webp", "images/support2.webp",
    "images/promote2.webp", "images/sustain2.webp", "images/promote3.webp",
  ]),
  "analytics.gaMeasurementId": z.string().default("G-MPHGJB3T4E"),
  "seo.titleTemplate": z.string().default("%s - Crafts Council of India"),
  "seo.defaultTitle": z.string().default("Crafts Council of India | Preserving India’s Living Crafts"),
  "seo.defaultDescription": z
    .string()
    .default(
      "The Crafts Council of India champions artisan communities, preserves traditional craft forms, and connects the makers of the crafts of India to the world.",
    ),
  "seo.defaultOgImage": z.string().default("images/Hero/Hero_Banner1.webp"),
  "seo.organizationJsonLd": z.boolean().default(true),
  "forms.contact.enabled": z.boolean().default(true),
  "forms.contact.notifyTo": z.string().default("info@craftscouncilofindia.in"),
  "forms.contact.subject": z.string().default("New Contact Form Enquiry"),
  "forms.contact.successMessage": z.string().default("✓ Message sent successfully. We will contact you shortly."),
});

export type Settings = z.infer<typeof SETTINGS_SCHEMA>;
export type SettingKey = keyof Settings;
export const SETTING_KEYS = Object.keys(SETTINGS_SCHEMA.shape) as SettingKey[];
