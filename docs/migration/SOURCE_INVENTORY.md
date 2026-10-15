# Source Inventory — Legacy Crafts Council of India Website

Audit date: 2026-10-15. Source of truth: `_public_html/` at commit `a53b10a` ("Initial commit").
The legacy tree is **read-only** for this migration; nothing in it is modified or deleted.

Machine-generated detail: [`ASSET_MANIFEST.csv`](./ASSET_MANIFEST.csv) (every file, size, SHA-1,
duplicate group, references, destination, status) and [`asset-audit.json`](./asset-audit.json).
Regenerate with `node scripts/audit/build-asset-manifest.mjs`.

## 1. Platform summary

| Aspect | Finding |
|---|---|
| Framework | None. Hand-written static HTML + vanilla JS on Apache (`.htaccess`), one PHP endpoint |
| Rendering | Most pages are static HTML; nav, footer, events, news, press and crafts map are **rendered client-side** by JS from in-file JS arrays / JSON |
| Data storage | JS array literals (`events.js`, `events-final.js`, `news.js`, `press.js`), `craft-data.json`, 34 `images/state_images/*/images.json`, plus content hard-coded in HTML |
| Server code | `send_enquiry.php` (contact form → reCAPTCHA verify → PHPMailer via ZeptoMail SMTP) |
| Secrets | `secrets.php` (git-ignored, not present); template `secrets.example.php` |
| Package manager / build | None |
| Total files | 4,078 (≈1.11 GB) |

## 2. Files by kind

| Kind | Count | Size |
|---|---:|---:|
| Images (jpg/jpeg/png/webp/gif + 2 `.GetMapImage`) | 3,835 | 504 MB |
| Documents (121 PDF + 6 DOCX) | 127 | 497 MB |
| Video (7 MP4 + 1 MOV) | 8 | 107 MB |
| HTML pages | 23 | 0.56 MB |
| JavaScript | 9 | 0.57 MB |
| CSS | 2 | 73 KB |
| JSON data | 35 | 161 KB |
| PHP (1 app + 1 template + 30 PHPMailer vendor) | 32 | 334 KB |
| Other (`.htaccess`, PHPMailer licence files) | 7 | 62 KB |

## 3. Application files

| File | Role | Notes |
|---|---|---|
| `index.html` | Home | Hero slider, marquee, quote, mission pillars, Kamala Awards call card, artisans scroll, Kamala shop slider, upcoming events grid (JS), awards scroll |
| `about.html` | About | History, Vision & Mission, Executive Committee lists |
| `what-we-do.html` | What we do | Support / Promote / Sustain blocks, each with an image slider; sticky anchor bar |
| `awards.html` | Recognition (Kamala Awards) | Call for applications, 6 award categories, 2024–25 awardee cards, 2020–2023 tables |
| `past-awards.html` | Past awards | Tables 2000–2019 (malformed rows, see risks) |
| `events.html` | Events listing | Client-rendered from `EVENTS`; filters All/Upcoming/Workshops/Exhibitions |
| `past-events.html` | Past events archive | Client-rendered from `PAST_EVENTS`; filters + "Load more" (6 per page) |
| `event-detail.html` | Event detail `?id=` | Rendered by `events.js` (`EVENTS` + `PAST_EVENTS`), lightbox gallery with video support |
| `news.html` / `news-detail.html` | News | Client-rendered from `NEWS`; detail supports raw HTML + YouTube embeds |
| `press.html` / `press-details.html` | Press | Client-rendered from `PRESS`; year filters; detail shows media groups (images + PDFs) |
| `books.html`, `newsletters.html`, `past-newsletters.html`, `happenings-in-handmade.html`, `past-happenings-in-handmade.html`, `reports.html` | Publications | Hard-coded "latest issue" + card grids (`nl-*` classes) linking to PDFs |
| `crafts-map.html` | Indian Crafts Map | Inline SVG map (37 paths), tooltip on hover, sidebar with district table on click, map-image lightbox; data from `craft-data.json` and `state_images/*/images.json` |
| `craft-processes.html` | Craft processes | 23 processes in an inline JS array; slide-in detail panel. **Not linked from any page** |
| `contact.html` | Contact | Enquiry form (reCAPTCHA v2) → `send_enquiry.php`; contact info; affiliated State Councils (visible section + a second hidden `display:none` section) |
| `privacy-policy.html`, `disclaimer.html` | Legal | Static prose ("Terms of Use" in footer links to `disclaimer.html`) |
| `nav.js` | Desktop + mobile navigation injected into `#main-nav` / `#mobileMenu` | |
| `footer.js` | Instagram feed (Behold) + footer + Google Analytics + Organization JSON-LD | |
| `loader.js` | Loads `nav.js`, `footer.js` and page data scripts in order, then fires `site-scripts-ready` | |
| `config.js` | `APP_VERSION` cache-buster | |
| `events.js` | `EVENTS` (43) + all event renderers | Contains commented-out template entries with placeholder links |
| `events-final.js` | `PAST_EVENTS` (73) scraped from the previous WordPress site (`source_link`) | |
| `news.js` | `NEWS` (7) + renderers | Descriptions mix plain text and raw HTML (iframes) |
| `press.js` | `PRESS` (12) + renderers | |
| `instagram.js` | Older Instagram Graph API widget | **Unused** — not loaded by any page |
| `craft-data.json` | 35 state records, crafts by district/village | Contains duplicate state names differing in case (merged at runtime) |
| `cci.css` (61 KB), `custom.css` (11 KB) | All styling | Breakpoints: 1024, 900, 768, 640, 480 px |
| `send_enquiry.php`, `secrets.example.php` | Contact backend | |
| `.htaccess` | HTTPS + www redirects, security headers, gzip, caching, secrets.php block | |
| `PHPMailer/` | Vendored PHPMailer (LGPL-2.1) | Replaced, not migrated |

## 4. Asset directories (top level)

| Directory | Contents |
|---|---|
| `images/Hero/` | Home hero slides |
| `images/artisans/`, `images/awardee/` | Home/awards portraits |
| `images/events/` (2024–2026) | Current event images, galleries, MP4s |
| `images/cci-past-events/` | Archive gallery images (73 events) |
| `images/news/` | News images |
| `images/press/` | Press clippings (images) + 25 PDFs (1980–1990 Hindu archive). Several folders exist twice: original names with spaces (e.g. `Dt Next/`) and slugged copies (`dt-next/`) — only the slugged copies are referenced |
| `images/books/`, `images/News letter images/`, `images/happenings-in-handmade/`, `images/reports/` | Publication covers |
| `images/state_images/<state>/` | State map + craft photos + `images.json` manifest + `thumbs/` (thumbs are unreferenced) |
| `images/craft_process/<Process>/` | Craft process covers and step images |
| `images/councils/` | State council logos |
| `docs/` | Newsletters, books, reports PDFs; `docs/happenings-in-handmade/` monthly PDFs |

## 5. Reference integrity (from automated scan)

* 3,113 files referenced; 965 not referenced by any scanned source (≈298 MB) — kept, flagged `unreferenced-review` in the manifest. Largest groups: `images/events/2024-events/kamala-awards-2023` (38), `images/events/2025-events/New folder` (37), `state_images/*/thumbs` (~300), `craft_process/*` step images (~170), un-slugged press folders.
* 310 duplicate-content groups (354 redundant copies), e.g. the same "-1.png" placeholder across 28 archive events, `cci-logo.png` ×3.
* **Missing**: `images/pottery-bg.jpg` (referenced by `cci.css`), `images/logo.png` (referenced by Organization JSON-LD in `footer.js`; actual logo is `images/cci-logo.png`).
* Case-sensitive mismatches: none detected.

## 6. Inaccessible / ambiguous items

* `secrets.php` — not in repository (by design). Production reCAPTCHA secret and ZeptoMail token must be supplied as environment variables.
* Live site (`https://www.craftscouncilofindia.in`) was not crawled; no Search Console / analytics data was available. SEO baseline is derived from source only.
* `.GetMapImage` files (2) are images with an unusual extension (unreferenced).
* 6 DOCX files under `images/` — unreferenced; manual review.
