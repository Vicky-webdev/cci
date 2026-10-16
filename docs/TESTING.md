# Testing

## Suites

| Suite | Tool | Location | What it covers |
|---|---|---|---|
| Unit | Vitest | `tests/unit/` | Date parser (every legacy format), legacy-link/asset URL mapping, HTML sanitiser (XSS, iframes, styles), permission helpers + full role matrix + ownership + workflow gating, section/record validation, registry ↔ Prisma schema consistency, contact validation + email escaping |
| Integration | Vitest + PostgreSQL | `tests/integration/import.test.ts` | Creates a throwaway database, runs migrations, role seed and the legacy importer; checks every reconciliation total, date parsing, legacy IDs, idempotency and that CMS edits survive a re-import; drops the database |
| End-to-end | Playwright (Chromium) | `tests/e2e/*.spec.ts` | Against `next start` (production build) on a throwaway database with one account per role: all public routes (no console/HTTP errors), JS-off rendering, filters, load-more, lightbox, crafts map, process panel, PDFs, mobile menu, 404; redirects, metadata, canonical, JSON-LD, sitemap, robots, noindex, security headers; sign-in, lockout, cookie flags, session revocation, forged cookies; RBAC for pages/APIs/uploads/users/roles; author→reviewer workflow; page edit + revision restore; validation; stored-XSS; settings + audit; uploads (magic bytes, SVG refusal, dedupe, traversal, deletion); contact form + CSRF + honeypot + CSV export; axe accessibility (WCAG 2.1 A/AA, serious/critical) on 6 public pages and the admin |

## Running

```bash
npm run lint && npm run typecheck
npm test                                    # unit; integration is skipped unless TEST_DATABASE_URL is set
TEST_DATABASE_URL=postgresql://user:pass@localhost:5432/postgres npm test      # + integration

npm run build                               # E2E runs against the production build
E2E_ADMIN_DATABASE_URL=postgresql://user:pass@localhost:5432/postgres \
PW_CHROMIUM_PATH=/path/to/chromium \       # optional
npm run test:e2e                            # prepare.ts creates cci_e2e_<ts>; teardown drops it
```

The role in these URLs needs `CREATEDB`. Tests only create and drop databases named `cci_it_<ts>` /
`cci_e2e_<ts>`; they never reset an existing database. `E2E_KEEP_DB=1` keeps the E2E database for debugging.

## Latest results (2026-10-15, this environment)

| Command | Result |
|---|---|
| `npm run lint` | 0 problems |
| `npm run typecheck` | 0 errors |
| `npm test` (with `TEST_DATABASE_URL`) | 98 unit + 5 integration tests passed |
| `npm run build` | Succeeded |
| `npm run test:e2e` | 83 passed, 0 failed |

Visual comparison: full-page screenshots of the legacy site (served statically) and the new site at
1366 px and 390 px were compared side by side for home, about, events, event detail, what-we-do, awards,
contact, crafts map, past Happenings in Handmade and press detail. Differences found were fixed (breadcrumb
styling, awardee card alignment, missing network section on Contact, footer spacing); remaining known
differences are listed in `docs/migration/REMAINING_ISSUES.md`. External services (Google Fonts on the
legacy side, Instagram/GA) were unreachable from the test browser.

## Not covered automatically

* Real email delivery (SMTP) and real reCAPTCHA verification (need production credentials).
* Cross-browser runs (only Chromium is installed here); Safari/Firefox should be checked manually before launch.
* Load testing.
* Database restore drill (procedure in `BACKUP_AND_RESTORE.md`).
