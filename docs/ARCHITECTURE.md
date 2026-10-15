# Architecture

```
Browser ──► Next.js 16 (Node.js) ──► PostgreSQL (Prisma 7)
              │  src/proxy.ts            legacy-URL redirects, /admin sign-in gate, noindex headers
              │  app/(site)/…            public pages (Server Components, rendered per request)
              │  app/admin/…             CMS (own root layout; Server Components + Client forms)
              │  app/api/…               contact form, media upload/search, exports
              │  app/uploads/[...path]   serves CMS uploads from UPLOAD_DIR
              ▼
          public/images, public/docs  ◄── hard-linked from _public_html/ by `npm run assets:sync`
```

## Source layout

| Path | Contents |
|---|---|
| `_public_html/` | The legacy site, untouched — source of truth for the importer, asset sync and CSS generators |
| `prisma/schema.prisma`, `prisma/migrations/` | Database schema and migrations; `prisma/seed.ts` creates system roles |
| `src/app/(site)/` | Public routes. `layout.tsx` = root layout (fonts, legacy CSS, header/footer, GA, Organization JSON-LD) |
| `src/app/admin/` | Admin root layout, sign-in; `(panel)/` contains every authenticated screen |
| `src/app/api/` | Route Handlers (contact, admin media, exports) |
| `src/components/site/` | Header, mobile menu, footer, Instagram feed, page scoping |
| `src/components/sections/` | One renderer per page-section type + `RenderSections` registry |
| `src/components/detail/` | Event/news/press detail modules (also used by `/preview`) |
| `src/components/crafts-map/` | Interactive India map (+ extracted SVG geometry) and craft process explorer |
| `src/components/admin/` | Generic form renderer, rich-text editor, media picker, section editor |
| `src/lib/auth/` | Permissions catalogue, password hashing, sessions, guards, login |
| `src/lib/admin/` | Resource registry, persistence mapping, server actions, settings form |
| `src/lib/content/` | Section declarations/validation, publishing helpers |
| `src/lib/queries/` | Public read queries (published content only) |
| `src/lib/` | `db`, `env`, `links`, `dates`, `sanitize`, `settings`, `storage`, `media`, `audit`, `rate-limit`, `seo`, `mailer` |
| `src/styles/legacy/cci.css` | Legacy stylesheet (verbatim); `src/styles/pages/` generated scoped page CSS |
| `scripts/` | Importer, asset sync, CSS scoper, map extractor, admin CLI, audit + doc generators |
| `tests/` | `unit/`, `integration/` (Vitest), `e2e/` (Playwright) |

## Request flow — public page

1. `src/proxy.ts` handles legacy query-string/WordPress URLs; `next.config.ts` redirects `*.html`.
2. The route (e.g. `app/(site)/about/page.tsx` → `CmsPage`) loads the published `Page` by slug.
3. `RenderSections` maps each stored section to its component; data-driven sections (events grid, team,
   councils, publications, awards) query their own records.
4. Metadata from `buildMetadata()` (title, description, canonical, OG/Twitter, robots).
5. `PageScope` wraps output in `pg-<page>` so that page's scoped legacy CSS applies.

## Request flow — admin change

1. `requirePagePermission()` guards the page (redirects to sign-in/forbidden/password change).
2. The client form posts JSON to a Server Action (`saveRecord`), which re-checks the session and permission,
   validates with zod (built from the registry), sanitises HTML, enforces ownership and publish rules.
3. One transaction writes the record and a `Revision` snapshot; an `AuditLog` entry follows.
4. The next public request renders the change (no cache to purge).

## Key modules

* **Permissions** — `src/lib/auth/permissions.ts` (catalogue, system roles, `hasPermission`, `canModify`).
* **Resource registry** — `src/lib/admin/resources.ts` + `resource-store.ts` (Prisma mapping, nested writes).
* **Sections** — `src/lib/content/sections.ts` declares fields; `sections-sanitize.ts` cleans HTML.
* **Links** — `src/lib/links.ts` converts legacy hrefs and asset paths to root-absolute encoded URLs.
* **Dates** — `src/lib/dates.ts` parses free-text dates; "upcoming" = start date ≥ today in Asia/Kolkata.
