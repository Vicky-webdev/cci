# Feature Parity Matrix

Status: **Planned** → **Implemented** (code exists, behaviour ported) → **Verified** (observed working in an
automated test or a recorded browser/screenshot run — see Evidence). Nothing is marked Verified without evidence.
Test files are in `tests/e2e/` (run against the production build) and `tests/unit/`.

| # | Feature (legacy behaviour) | Legacy source | New implementation | Status | Evidence |
|---|---|---|---|---|---|
| F1 | Desktop nav with hover dropdowns | `nav.js` | `SiteHeader` (server) + CMS menu `main` | Verified | public.spec.ts (nav on every page); screenshots |
| F2 | Mobile hamburger menu, accordion submenus, outside-click close | `nav.js` | `MobileMenu` client component | Verified | public.spec.ts "mobile menu opens, expands a submenu and closes on outside click" |
| F3 | Footer columns, address, email, phone, socials, legal links | `footer.js` | `SiteFooter` (server) + settings + menus | Verified | public.spec.ts (footer on every page); settings change test in workflow.spec.ts |
| F4 | Instagram grid via Behold: lazy on scroll, 6 h cache, stale fallback, static fallback | `footer.js` | `InstagramFeed` client component | Implemented | Feed unreachable in the sandbox; fallback grid path observed in screenshots; caching logic ported 1:1 |
| F5 | GA4 analytics | `footer.js` | `next/script`, ID from settings | Implemented | Script tag rendered when a valid G- ID is set; GA unreachable in sandbox |
| F6 | Organization JSON-LD | `footer.js` | Root layout JSON-LD (logo URL fixed) | Verified | seo.spec.ts structured data |
| F7 | Home hero slider: 4 slides, arrows, dots, 5 s autoplay | `index.html` | `HeroSlider` client component | Verified | Screenshots; arrows/dots wired to the same transform logic |
| F8 | Home marquee strip | `index.html` | CSS marquee, items from CMS | Verified | Screenshots (home) |
| F9 | Home upcoming events: next 3 by start date, first featured, "No upcoming events" fallback | `events.js renderHomeGrid` | Server query + `HomeEvents` | Verified | workflow.spec.ts (new future event appears in Upcoming); screenshots |
| F10 | Home artisans & awards infinite horizontal scroll | `index.html` + CSS | Server components, records doubled for loop | Verified | Screenshots (home) after removing lazy-loading in scrollers |
| F11 | Kamala Craft Shop slider: 4 s autoplay, pause on hover, swipe | `index.html` | `RetailSlider` client component | Implemented | Screenshots; autoplay/hover/swipe ported |
| F12 | What-we-do sliders (per-section autoplay delay, dots, arrows, swipe sync) | `what-we-do.html` | `SectionSlider` client component | Implemented | Screenshots (what-we-do); dots now one per slide |
| F13 | What-we-do sticky anchor bar with smooth scroll + active highlight | `what-we-do.html` | `AnchorBar` client component | Implemented | Smooth scroll + IntersectionObserver ported |
| F14 | Events list: filters All/Upcoming/Workshops/Exhibitions; upcoming first then newest | `events.html` | `/events` server render + `EventFilters` client | Verified | public.spec.ts "events filters behave like the legacy page" |
| F15 | Past events archive: filters, newest first, Load more (6) | `past-events.html` | `/past-events` | Verified | public.spec.ts "past events load six at a time" |
| F16 | Event detail: hero, breadcrumbs, description, overview, PDF download, highlights, schedule, people, gallery (img+video), register/ended card, info card (date/time/venue/fee/age/contact/address/parking/map), share (WhatsApp, copy link), related | `events.js renderEvent` | `/events/[slug]` | Verified | public.spec.ts detail pages; JS-off test counts 7 awardees; screenshots |
| F17 | Gallery lightbox: click, prev/next, Esc/arrow keys, backdrop close, video playback | `events.js`, `news.js`, `press.js` | `Lightbox` client component | Verified | public.spec.ts lightbox open/arrow/Escape |
| F18 | News list + detail with raw HTML, YouTube embeds (referrer/allow attrs), gallery | `news.js` | `/news`, `/news/[slug]` + sanitizer | Verified | public.spec.ts news detail; sanitize.test.ts YouTube iframes |
| F19 | Press list with year filters (All/2026/2025/1980-1990), cover fallback for PDFs | `press.html` | `/press` | Verified | public.spec.ts "press year filter" |
| F20 | Press detail: media groups, date, read-online link, image gallery + PDF tiles, lightbox (images only) | `press.js` | `/press/[slug]` | Verified | public.spec.ts press detail pages; screenshots |
| F21 | Publications pages (latest + grid, read online / download) ×6 | publication pages | `PublicationPage` | Verified | public.spec.ts (6 pages) + PDF link check |
| F22 | Kamala Awards page: call, categories, recipient cards, yearly tables | `awards.html` | `/awards` | Verified | public.spec.ts; screenshots after alignment fix |
| F23 | Past awards tables 2000–2019 | `past-awards.html` | `/past-awards` | Verified | public.spec.ts |
| F24 | Crafts map: SVG states, hover tooltip (first 4 crafts), click → sidebar with state map image + district table; map image lightbox; UT links | `crafts-map.html` | `/crafts-map` + `CraftsMap` client | Verified | public.spec.ts crafts map hover/click |
| F25 | Craft processes grid + slide-in detail panel | `craft-processes.html` | `/craft-processes` | Verified | public.spec.ts process panel |
| F26 | Contact form: required fields, reCAPTCHA, loading state, success/error message, email to info@ | `contact.html`, `send_enquiry.php` | `ContactForm` + `/api/contact` | Verified | media-contact.spec.ts (submit, stored, CSV); reCAPTCHA/SMTP need production keys |
| F27 | State councils grid | `contact.html` | `/contact` from `StateCouncil` | Verified | Screenshots (contact), import.test.ts (11 councils) |
| F28 | Legal pages | `privacy-policy.html`, `disclaimer.html` | Standard CMS pages | Verified | public.spec.ts |
| F29 | Security headers, secrets protection | `.htaccess` | `next.config.ts` headers; env vars | Verified | seo.spec.ts security headers |
| F30 | Cache-busting via APP_VERSION | `config.js`, `loader.js` | Not needed — Next.js content-hashes assets; data is server-rendered | Replaced | Next.js content-hashes assets; data is server-rendered |
| F31 | Book page "nlSubscribe" function | `books.html`, `reports.html` | **Dead code** in legacy (no form elements exist) — not migrated | Not migrated (dead code) | Legacy function referenced elements that did not exist |

## Intentional behaviour differences

* **Single date parser.** Legacy used three different parsers; the events list mis-classified month-first
  dates ("July 23–25, 2026") as past. Now one parser for all lists: upcoming = start date ≥ today (India time).
  Editors can override the parsed dates.
* **Server rendering.** Lists render fully in HTML; filters run client-side over that HTML (same UX, crawlable).
* **Past events "Load more"** shows 6 cards initially as before; every archive event is also in the sitemap.
* **What-we-do sliders**: one dot per slide (legacy always showed four dots).
* **Mobile menu** gains "Past Awards" (single menu source for desktop and mobile).
* **About → History** menu link now scrolls to the history section (legacy anchor was missing).
* **Contact page**: email address is a mailto link; SMTP errors are no longer shown to visitors.
* **Dead controls**: "Meet all artisans" (no action in legacy) is hidden until a link is configured;
  report card links pointing to `#` are hidden until a PDF is set.
