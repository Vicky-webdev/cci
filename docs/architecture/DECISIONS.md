# Architecture Decision Records

## ADR-001 — Next.js 16 App Router + TypeScript (strict)
**Context.** Legacy site: hand-written HTML/JS on Apache with one PHP endpoint; no framework to keep.
**Decision.** Next.js 16 (App Router, React 19, Turbopack), TypeScript strict, Server Components by
default; Client Components only for sliders, filters, lightboxes, map, menus, forms and the admin editors.
**Consequences.** Node.js ≥ 20.9 runtime required (see ADR-002). `params`/`cookies()` are async;
middleware is `src/proxy.ts` (Next 16 rename).

## ADR-002 — Hosting needs a Node.js runtime + PostgreSQL (**business decision pending**)
**Context.** The legacy site runs on shared Apache/PHP hosting. A database-backed CMS cannot run there.
**Decision.** Target a single Node.js server (VM/VPS/PaaS container) with PostgreSQL and a persistent
volume for uploads. Serverless hosting works only with an object-storage driver (not yet implemented, ADR-008).
**Consequences.** Cost and provider choice need approval. Options in `docs/DEPLOYMENT.md`.

## ADR-003 — PostgreSQL + Prisma 7 (driver adapter `@prisma/adapter-pg`)
Relational content with constraints (unique slugs, enums, FKs, cascades), JSON only for ordered,
schema-validated blocks (page sections, highlights, galleries). Migrations committed in `prisma/migrations`.

## ADR-004 — Clean URLs with permanent redirects from every legacy URL
**Context.** `.html` URLs and `?id=` detail URLs were the legacy scheme; detail pages were client-rendered.
**Decision.** `/about`, `/events/<slug>`, …; 308 redirects for every `.html` page (`next.config.ts`),
for `event-detail.html?id=`, `news-detail.html?id=`, `press-details.html?id=` and for the old WordPress
`/event/<slug>/` (`src/proxy.ts`); legacy IDs resolve case-insensitively. Asset URLs (`/images/…`, `/docs/…`) unchanged.
**Consequences.** Search engines consolidate on the new URLs; inbound links keep working. Reversible
(redirect table) if the organisation prefers `.html` URLs.

## ADR-005 — Render public pages per request (no Cache Components)
**Decision.** `dynamic = "force-dynamic"` on the public layout; React `cache()` de-duplicates queries per
request. Edits are visible immediately; no build-time DB access. `cacheComponents` is **not** enabled.
**Consequences.** One DB round-trip set per page view — fine for this traffic. A CDN with short TTLs or
`"use cache"` + tag invalidation can be added later without changing the content model.

## ADR-006 — Keep the legacy CSS verbatim; scope per-page inline styles
**Decision.** `cci.css` copied unchanged (one `url()` made root-absolute). Each page's inline `<style>`
and `custom.css` are generated into `src/styles/pages/*.css` by `scripts/scope-legacy-css.mjs`, prefixed with
zero-specificity `:where(.pg-<page>)` so the cascade is identical to the legacy page but rules can't leak across
client-side navigations. Invalid CSS that browsers ignore is dropped by the generator (2 cases, logged).
Components emit the legacy DOM/class names. Fonts self-hosted via `@fontsource` with the same family names.
**Consequences.** Pixel-level parity with the original (verified by screenshots). Restyling later means editing CSS, not content.

## ADR-007 — Own session auth instead of an auth framework's JWT sessions
**Context.** Requirements: server-side session validation, expiry, revocation, rate limiting, no public sign-up.
**Decision.** Database sessions (token hash in `Session`), Argon2id via `@node-rs/argon2` (audited native
library), helper modules in `src/lib/auth/`. Credentials-provider JWT sessions in Auth.js cannot be revoked server-side.
**Consequences.** Small, auditable code; MFA/SSO would need to be added later.

## ADR-008 — Media: legacy files stay in place; uploads via a storage driver
**Decision.** 1.1 GB of legacy assets stay in `_public_html/` (single copy in git) and are hard-linked into
`public/` by `npm run assets:sync`, keeping their URLs. Each file is registered in `Media` (`storage=LEGACY`,
protected from deletion). CMS uploads go through `StorageDriver` (`src/lib/storage`); the implemented driver is
local disk (`UPLOAD_DIR`) served by `/uploads/[...path]`.
**Consequences.** No re-encoding of originals. An S3-compatible driver is needed for multi-instance/serverless hosting.

## ADR-009 — Generic resource registry for the admin
**Decision.** `src/lib/admin/resources.ts` declares each content type's fields once; the same declaration
drives list pages, forms, zod validation, sanitisation and permission checks. Page bodies are ordered
"sections" whose types are declared in `src/lib/content/sections.ts`.
**Consequences.** New content types/sections are a declaration plus (for sections) a renderer. A unit test
checks every declared field exists in the Prisma schema.

## ADR-010 — Importer executes legacy data files instead of re-typing
**Decision.** `scripts/import-legacy-content` runs `events.js`, `news.js`, etc. in a sandboxed `vm` and parses
HTML with cheerio. Records keyed by legacy IDs; create-missing by default; `--refresh` for dev only.
**Consequences.** No transcription errors; repeatable; reconciliation report proves completeness.

## ADR-011 — One date parser for free-text event dates
Legacy used three inconsistent parsers (one mis-classified "July 23–25, 2026" as past). One unit-tested parser
fills `startDate`/`endDate` at import and on save; the display text stays verbatim.
