# Migration Risks

| # | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| R1 | **SEO loss from URL changes** (`.html` → clean URLs, `?id=` detail pages → path segments) | Medium | High | Permanent redirects for every legacy pattern incl. old WordPress `/event/{slug}/`; redirect e2e tests; sitemap submitted at cut-over; monitor Search Console 404s for 4 weeks |
| R2 | **Free-text event dates** ("9, 10 & 12 October 2026", "31 July, 1 & 3 August 2026 (Closed on 2 August)") drive upcoming/past status and sort order | High | Medium | Keep verbatim `dateText` for display; parse once into `startDate`/`endDate` at import with a unit-tested parser; report unparseable values; editors can correct dates in the CMS |
| R3 | **Three different legacy date parsers** produce different upcoming/past results on events list vs. home grid vs. archive | Certain | Low | One parser; documented behavioural difference in FEATURE_PARITY_MATRIX |
| R4 | **Raw HTML in content** (news iframes, `<em>`, links in marquee) → XSS if rendered unsanitized | Medium | High | All rich text passes through an allow-list sanitizer at save and at render; iframes restricted to YouTube |
| R5 | **1.1 GB of binary assets** — doubling them in git or the build output | High | Medium | Assets stay in `_public_html/` (single copy in git); `assets:sync` hard-links into `public/` (git-ignored). Production: serve from the same disk or object storage/CDN (DEPLOYMENT.md) |
| R6 | Visual regressions from re-implementing hand-written sliders/lightboxes | Medium | Medium | Legacy CSS reused verbatim with identical class names; components emit the same DOM structure; screenshot comparisons in e2e |
| R7 | Contact form spam/abuse once moved to a JSON API | Medium | Medium | reCAPTCHA verification, server validation, per-IP rate limit, honeypot |
| R8 | Unknown live-site differences (production may contain files not in git, e.g. `secrets.php`, server-side edits) | Medium | Medium | Diff production docroot against `_public_html/` before cut-over |
| R9 | Data-quality defects in legacy data (scraped footer text in craft processes, malformed award tables, duplicate state records) | Certain | Low | Imported verbatim, flagged in RECONCILIATION_REPORT and REMAINING_ISSUES for editors; never silently "fixed" |
| R10 | Licensing of the India SVG map geodata (amCharts) | Unknown | Medium | Flagged for confirmation |
| R11 | Admin account compromise | Low | High | Argon2id, DB sessions with expiry + revocation, login rate limiting, no public registration, audit log, least-privilege roles |
| R12 | Hosting change: legacy is Apache/PHP shared hosting; Next.js needs a Node runtime + PostgreSQL | Certain | High | **Business decision required** (see DECISIONS.md ADR-002 and DEPLOYMENT.md options) |
| R13 | Uploads on ephemeral/serverless filesystems disappear | Medium | High | Storage abstraction; local driver only for single-server deployments with a persistent volume; documented |
| R14 | Large archive galleries (up to 96 images/event) slow pages | Medium | Low | Lazy loading; Next image optimisation for new uploads |
