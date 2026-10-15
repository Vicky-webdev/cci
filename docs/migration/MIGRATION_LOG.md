# Migration Log

Chronological record of the migration work (branch `claude/ecstatic-hopper-0mq149`).

## 2026-10-15

### Phase 0 — Audit
* Inventoried 4,078 files (1.11 GB): 23 HTML pages, 9 JS, 2 CSS, 35 JSON, 127 documents, 8 videos, 3,835 images.
* Executed legacy data files in a sandbox to count records (43 + 73 events, 7 news, 12 press, 16 processes).
* Found inline per-page `<style>` blocks (20 pages), two invalid CSS constructs, a missing CSS image, a broken
  JSON-LD logo URL, a broken `about.html#history` anchor, dead buttons/links, and three inconsistent date parsers.
* Wrote SOURCE/ROUTE/CONTENT/SEO/INTEGRATION inventories, risks, parity matrix, `ASSET_MANIFEST.csv`.

### Phase 1–2 — Architecture and data model
* Chose Next.js 16 + Prisma 7/PostgreSQL + own session auth (ADRs 001–011). Read the bundled Next 16 docs
  (proxy rename, async request APIs, caching model).
* Schema: 28 models; migrations `init`, `publication_card_links`.

### Phase 6 — Import
* Importer reads legacy JS (VM sandbox) and HTML (cheerio); idempotent; reconciliation report.
* First full run: 0 errors, 38 warnings/notes; all 116 event dates parsed. Re-run matched everything (idempotent).

### Phase 4 — Public site
* Legacy CSS kept verbatim; per-page inline styles scoped automatically; fonts self-hosted.
* All routes rendered from the CMS; legacy URLs redirect; 23/23 legacy HTML URLs verified.
* Screenshot comparison with the legacy site found and fixed: lazy-loaded scroller images, breadcrumb picking up
  global `nav` styles, footer legal-link spacing, awardee card alignment/table band, missing Contact network section.

### Phase 3 — Admin & RBAC
* Resource registry, section editor, media library, settings, submissions, users, roles, audit, revisions, preview, exports.
* Bugs found by tests and fixed: Page had no `sortOrder` (save failed) → registry/schema unit test added;
  reviewers couldn't approve without edit rights → dedicated approve/return action; React form reset cleared the
  login email; first edit of imported records had no "before" snapshot → original snapshot on first change;
  `jsonb` key reordering caused spurious settings audit entries; admin menu button visible on desktop.

### Phase 5/7/8 — SEO, tests, docs
* Sitemap (155 URLs), robots, metadata, JSON-LD; security headers.
* Tests: 98 unit, 5 integration, 83 E2E — all passing on the production build (see `docs/TESTING.md`).
* Documentation set written; RBAC matrix generated from code.

### Not done / handed over
See `REMAINING_ISSUES.md` (hosting decision, content clean-up, hardening items). No deployment was made and no
production data was touched.
