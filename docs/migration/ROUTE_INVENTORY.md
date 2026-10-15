# Route Inventory

Every legacy URL, its Next.js destination, and how the old URL is preserved.
Decision (see `docs/architecture/DECISIONS.md` ADR-004): public routes move to clean,
extension-less URLs; every legacy `.html` URL and every `?id=` detail URL issues a
**308/301 permanent redirect** to its new canonical URL so existing links and search
equity carry over. Redirects are implemented in `src/middleware.ts` (query-string
detail URLs) and `next.config.ts` (static `.html` URLs) and are tested in
`tests/e2e/redirects.spec.ts`.

Status legend: **Migrated** = rendered by Next.js from CMS data; **Redirect** = legacy URL redirects.

## Public pages

| # | Legacy URL | New URL | Source | Data source (new) | Status |
|---|---|---|---|---|---|
| 1 | `/`, `/index.html` | `/` | `index.html` | Page `home` sections + Events + Awardees + Artisans + Settings | Migrated |
| 2 | `/about.html` | `/about` | `about.html` | Page `about` sections + TeamMember | Migrated |
| 3 | `/what-we-do.html` | `/what-we-do` | `what-we-do.html` | Page `what-we-do` sections | Migrated |
| 4 | `/crafts-map.html` | `/crafts-map` | `crafts-map.html` | CraftState / CraftLocation / CraftStateImage | Migrated |
| 5 | `/craft-processes.html` | `/craft-processes` | `craft-processes.html` | CraftProcess | Migrated (still unlinked from nav, as in legacy) |
| 6 | `/awards.html` | `/awards` | `awards.html` | Page `awards` sections + AwardCategory + AwardRecipient | Migrated |
| 7 | `/past-awards.html` | `/past-awards` | `past-awards.html` | AwardRecipient (year ≤ 2019) | Migrated |
| 8 | `/events.html` | `/events` | `events.html` | Event (collection = CURRENT) | Migrated |
| 9 | `/past-events.html` | `/past-events` | `past-events.html` | Event (collection = ARCHIVE) | Migrated |
| 10 | `/event-detail.html?id={id}` | `/events/{id}` | `event-detail.html` + `events.js` | Event | Migrated + Redirect |
| 11 | `/news.html` | `/news` | `news.html` | NewsArticle | Migrated |
| 12 | `/news-detail.html?id={id}` | `/news/{id}` | `news-detail.html` + `news.js` | NewsArticle | Migrated + Redirect |
| 13 | `/press.html` | `/press` | `press.html` | PressItem | Migrated |
| 14 | `/press-details.html?id={id}` | `/press/{id}` | `press-details.html` + `press.js` | PressItem + PressGroup | Migrated + Redirect |
| 15 | `/books.html` | `/books` | `books.html` | Publication (BOOK) | Migrated |
| 16 | `/newsletters.html` | `/newsletters` | `newsletters.html` | Publication (NEWSLETTER, not archived) | Migrated |
| 17 | `/past-newsletters.html` | `/past-newsletters` | `past-newsletters.html` | Publication (NEWSLETTER, archived) | Migrated |
| 18 | `/happenings-in-handmade.html` | `/happenings-in-handmade` | same | Publication (HAPPENINGS) | Migrated |
| 19 | `/past-happenings-in-handmade.html` | `/past-happenings-in-handmade` | same | Publication (HAPPENINGS, archived) | Migrated |
| 20 | `/reports.html` | `/reports` | `reports.html` | Publication (REPORT) | Migrated |
| 21 | `/contact.html` | `/contact` | `contact.html` | Page `contact` + StateCouncil + Settings + FormSubmission | Migrated |
| 22 | `/privacy-policy.html` | `/privacy-policy` | `privacy-policy.html` | Page (rich text) | Migrated |
| 23 | `/disclaimer.html` | `/disclaimer` | `disclaimer.html` | Page (rich text) | Migrated |
| 24 | — | `/[slug]` | — | Any new CMS page with the `standard` template | New capability |

## Endpoints and generated routes

| Legacy | New | Notes |
|---|---|---|
| `POST /send_enquiry.php` | `POST /api/contact` (and `/send_enquiry.php` rewritten to it) | reCAPTCHA verification, validation, DB storage, SMTP notification |
| `/craft-data.json` | `/craft-data.json` (Route Handler, generated from DB) | Kept for any external consumer |
| — | `/sitemap.xml`, `/robots.txt` | New (none existed) |
| — | `/uploads/{...}` | Serves media uploaded through the CMS (local storage driver) |
| `/images/**`, `/docs/**` | unchanged | Synced from `_public_html` into `public/` at build (`npm run assets:sync`) |

## Previous-generation (WordPress) URLs

`events-final.js` records `source_link` values such as
`https://www.craftscouncilofindia.in/event/ugadi-celebrations-with-andhra-food/`.
These 73 URLs belonged to the site before the static rebuild; they are redirected
`/event/{slug}/` → `/events/{slug}` so any surviving inbound links resolve.

## Admin (new)

| Route | Purpose |
|---|---|
| `/admin/login` | Sign in (no public registration) |
| `/admin` | Dashboard |
| `/admin/pages`, `/admin/events`, `/admin/news`, `/admin/press`, `/admin/publications`, `/admin/awards`, `/admin/people`, `/admin/councils`, `/admin/crafts`, `/admin/processes` | Content modules |
| `/admin/media` | Media library |
| `/admin/navigation`, `/admin/settings`, `/admin/redirects` | Global site management |
| `/admin/submissions` | Contact-form submissions |
| `/admin/users`, `/admin/roles`, `/admin/audit` | Access control and audit log |

## Internal-link defects found in the legacy site

| Location | Defect | Handling |
|---|---|---|
| `nav.js` | "About → History" links `about.html#history`, but no element has `id="history"` | Fixed: history section gets `id="history"` |
| `nav.js` | "Archive → History gallery" and top-level "Resources"/"Archive" links are `href="#"` | Preserved as non-navigating menu parents; "History gallery" kept as `#` and logged in REMAINING_ISSUES (needs content decision) |
| `nav.js` mobile menu | "Past Awards" missing from mobile Archive submenu (present on desktop) | One CMS menu now feeds desktop and mobile, so mobile gains "Past Awards"; logged as an intentional consistency fix |
| `reports.html` | Report card "Read online"/download links are `href="#"` | Preserved as data with empty URL (button hidden); logged for decision |
| `index.html` | Logo links to absolute `https://craftscouncilofindia.in` (non-www) | Logo links to `/` |
