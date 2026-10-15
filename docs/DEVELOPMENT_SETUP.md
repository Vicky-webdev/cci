# Development Setup

## Prerequisites

* Node.js ≥ 20.9 (developed on 22.x) and npm
* PostgreSQL 14+ (developed on 16)
* ~1.2 GB free disk for the repository (legacy assets); `assets:sync` uses hard links, so no extra copy

## First run

```bash
git clone <repo> && cd cci
npm install                          # also installs Prisma CLI
cp .env.example .env                 # then edit DATABASE_URL (and SITE_URL=http://localhost:3000)
createdb cci                         # or any empty database named in DATABASE_URL
npx prisma migrate deploy            # create tables
npx prisma generate                  # generate the client into src/generated/prisma
npm run db:seed                      # create the 7 system roles (safe to re-run)
npm run import:legacy                # import all legacy content + register media (≈10 s, safe to re-run)
npm run admin:create -- --email=you@example.org --name="Your Name"   # prompts for a password
npm run dev                          # http://localhost:3000  (admin: /admin)
```

`npm run dev` and `npm run build` run `assets:sync` first, which hard-links `_public_html/images` and
`_public_html/docs` into `public/` (git-ignored).

For local HTTP, set `SESSION_COOKIE_SECURE="false"` in `.env` (production defaults to secure cookies).

## Everyday commands

| Command | Purpose |
|---|---|
| `npm run dev` | Dev server (Turbopack) |
| `npm run lint` / `npm run typecheck` | ESLint / `tsc --noEmit` |
| `npm test` | Unit tests (+ integration tests when `TEST_DATABASE_URL` is set) |
| `npm run test:e2e` | Playwright end-to-end (needs `E2E_ADMIN_DATABASE_URL` and a prior `npm run build`) — see `TESTING.md` |
| `npm run db:migrate:dev -- --name <change>` | Create a new migration after editing `schema.prisma` |
| `npm run import:legacy -- --dry-run` | Parse legacy content and print the reconciliation table without writing |
| `node scripts/scope-legacy-css.mjs` | Regenerate scoped page CSS after changing legacy inline styles |
| `node scripts/extract-india-map.mjs` | Regenerate map geometry from `crafts-map.html` |
| `npx tsx scripts/docs/rbac-matrix.ts` | Regenerate `docs/security/RBAC_PERMISSION_MATRIX.md` |
| `npm run audit:assets` | Rebuild `docs/migration/ASSET_MANIFEST.csv` |

## Conventions

* Read `AGENTS.md`: Next.js 16 differs from older versions — consult `node_modules/next/dist/docs/`.
* Server Components by default; add `"use client"` only for interactivity.
* All DB access through `src/lib/db.ts` (server-only). Public reads must use `publishedWhere()`.
* Every new admin write path must call a guard from `src/lib/auth/guards.ts` and write an audit entry.
* Never render CMS HTML except through `RichHtml`/`InlineHtml` (sanitised).
* Adding a content field: edit `schema.prisma` → migration → registry field in `src/lib/admin/resources.ts`
  (the registry/schema unit test fails if they disagree) → renderer.
* Adding a page-section type: declare it in `src/lib/content/sections.ts`, add a renderer to
  `src/components/sections/RenderSections.tsx`.
