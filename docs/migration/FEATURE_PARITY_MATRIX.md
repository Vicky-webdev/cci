# Feature Parity Matrix

Status: **Planned** → **Implemented** (code exists) → **Verified** (observed working in a test or
browser run, with the evidence column filled). Nothing is marked Verified without evidence.

| # | Feature (legacy behaviour) | Legacy source | New implementation | Status | Evidence |
|---|---|---|---|---|---|
| F1 | Desktop nav with hover dropdowns | `nav.js` | `SiteHeader` (server) + CMS menu `main` | Planned | |
| F2 | Mobile hamburger menu, accordion submenus, outside-click close | `nav.js` | `MobileMenu` client component | Planned | |
| F3 | Footer columns, address, email, phone, socials, legal links | `footer.js` | `SiteFooter` (server) + settings + menus | Planned | |
| F4 | Instagram grid via Behold: lazy on scroll, 6 h cache, stale fallback, static fallback | `footer.js` | `InstagramFeed` client component | Planned | |
| F5 | GA4 analytics | `footer.js` | `next/script`, ID from settings | Planned | |
| F6 | Organization JSON-LD | `footer.js` | Root layout JSON-LD (logo URL fixed) | Planned | |
| F7 | Home hero slider: 4 slides, arrows, dots, 5 s autoplay | `index.html` | `HeroSlider` client component | Planned | |
| F8 | Home marquee strip | `index.html` | CSS marquee, items from CMS | Planned | |
| F9 | Home upcoming events: next 3 by start date, first featured, "No upcoming events" fallback | `events.js renderHomeGrid` | Server query + `HomeEvents` | Planned | |
| F10 | Home artisans & awards infinite horizontal scroll | `index.html` + CSS | Server components, records doubled for loop | Planned | |
| F11 | Kamala Craft Shop slider: 4 s autoplay, pause on hover, swipe | `index.html` | `RetailSlider` client component | Planned | |
| F12 | What-we-do sliders (per-section autoplay delay, dots, arrows, swipe sync) | `what-we-do.html` | `SectionSlider` client component | Planned | |
| F13 | What-we-do sticky anchor bar with smooth scroll + active highlight | `what-we-do.html` | `AnchorBar` client component | Planned | |
| F14 | Events list: filters All/Upcoming/Workshops/Exhibitions; upcoming first then newest | `events.html` | `/events` server render + `EventFilters` client | Planned | |
| F15 | Past events archive: filters, newest first, Load more (6) | `past-events.html` | `/past-events` | Planned | |
| F16 | Event detail: hero, breadcrumbs, description, overview, PDF download, highlights, schedule, people, gallery (img+video), register/ended card, info card (date/time/venue/fee/age/contact/address/parking/map), share (WhatsApp, copy link), related | `events.js renderEvent` | `/events/[slug]` | Planned | |
| F17 | Gallery lightbox: click, prev/next, Esc/arrow keys, backdrop close, video playback | `events.js`, `news.js`, `press.js` | `Lightbox` client component | Planned | |
| F18 | News list + detail with raw HTML, YouTube embeds (referrer/allow attrs), gallery | `news.js` | `/news`, `/news/[slug]` + sanitizer | Planned | |
| F19 | Press list with year filters (All/2026/2025/1980-1990), cover fallback for PDFs | `press.html` | `/press` | Planned | |
| F20 | Press detail: media groups, date, read-online link, image gallery + PDF tiles, lightbox (images only) | `press.js` | `/press/[slug]` | Planned | |
| F21 | Publications pages (latest + grid, read online / download) ×6 | publication pages | `PublicationPage` | Planned | |
| F22 | Kamala Awards page: call, categories, recipient cards, yearly tables | `awards.html` | `/awards` | Planned | |
| F23 | Past awards tables 2000–2019 | `past-awards.html` | `/past-awards` | Planned | |
| F24 | Crafts map: SVG states, hover tooltip (first 4 crafts), click → sidebar with state map image + district table; map image lightbox; UT links | `crafts-map.html` | `/crafts-map` + `CraftsMap` client | Planned | |
| F25 | Craft processes grid + slide-in detail panel | `craft-processes.html` | `/craft-processes` | Planned | |
| F26 | Contact form: required fields, reCAPTCHA, loading state, success/error message, email to info@ | `contact.html`, `send_enquiry.php` | `ContactForm` + `/api/contact` | Planned | |
| F27 | State councils grid | `contact.html` | `/contact` from `StateCouncil` | Planned | |
| F28 | Legal pages | `privacy-policy.html`, `disclaimer.html` | Standard CMS pages | Planned | |
| F29 | Security headers, secrets protection | `.htaccess` | `next.config.ts` headers; env vars | Planned | |
| F30 | Cache-busting via APP_VERSION | `config.js`, `loader.js` | Not needed — Next.js content-hashes assets; data is server-rendered | Planned (replaced) | |
| F31 | Book page "nlSubscribe" function | `books.html`, `reports.html` | **Dead code** in legacy (no form elements exist) — not migrated | Planned (documented exception) | |

## Intentional behaviour differences

* **Single date parser.** Legacy used three different parsers. New: one parser, start date
  decides upcoming (start date ≥ today) for listing and home grid. Editors can override dates.
* **Server rendering.** Lists render fully in HTML; filters run client-side over that HTML
  (same UX, crawlable content).
