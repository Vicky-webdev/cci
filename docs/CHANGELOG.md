# Changelog

## 1.0.0 — 2026-10-15 — Next.js migration

### Added
- Next.js 16 application with PostgreSQL/Prisma content model for every legacy content type.
- Admin CMS at `/admin`: pages (section editor), events, news, press, publications, awards, artisans, team,
  state councils, crafts map, craft processes, media library, navigation, settings, redirects, form submissions,
  users, roles & permissions, audit log, revisions with restore, draft preview, JSON/CSV export.
- Role-based access control with 7 system roles, enforced server-side; Argon2id passwords; database sessions;
  login lockout; CLI account provisioning.
- Legacy importer with reconciliation report; asset sync; scoped legacy CSS generator; map geometry extractor.
- SEO: server rendering, metadata, canonical, Open Graph, JSON-LD (Organization, Event, BreadcrumbList), sitemap,
  environment-aware robots, permanent redirects for all legacy URLs, custom 404.
- Contact form stores enquiries before emailing; honeypot and rate limiting in addition to reCAPTCHA.
- Unit, integration and end-to-end test suites; documentation set.

### Changed (intentional, vs. legacy)
- URLs: `/about.html` → `/about`, `event-detail.html?id=x` → `/events/x` (308 redirects).
- One date parser for events (legacy listing mis-classified month-first dates such as "July 23–25, 2026" as past).
- Mobile menu now includes "Past Awards" (desktop already did) — both come from one CMS menu.
- About page history section has `id="history"` so the existing "About → History" menu link works.
- What-we-do sliders show one dot per slide (legacy always showed four).
- Contact enquiry errors no longer expose SMTP error text to visitors.
- Fonts self-hosted (no runtime request to Google Fonts).
- Organization JSON-LD logo points at the real logo file.

### Not migrated (by design)
- `instagram.js` (unused), `PHPMailer/` and `send_enquiry.php` (replaced), `config.js`/`loader.js` cache-busting
  (Next.js hashes assets), dead `nlSubscribe()` function on books/reports pages (no form existed).
