# Database Schema

Source of truth: `prisma/schema.prisma`; migrations in `prisma/migrations/` (apply with
`npx prisma migrate deploy`). PostgreSQL. All ids are cuid strings unless noted.

## Access control

| Table | Purpose | Notes |
|---|---|---|
| `User` | Admin accounts | `email` unique (stored lower-case); `passwordHash` (Argon2id); `isActive`; `mustChangePassword` |
| `Role` | Named permission sets | `key` unique; `permissions text[]`; `isSystem` for seeded roles |
| `UserRole` | User ↔ role | composite PK; deleting a role in use is restricted |
| `Session` | Admin sessions | `id` = SHA-256 of the cookie token; `expiresAt`, `revokedAt`, `lastSeenAt`, IP, user agent |
| `LoginAttempt` | Sign-in attempts | indexed by (email, time) and (IP, time) for lockout |
| `RateLimitEvent` | Generic rate-limit hits | e.g. `contact:<ip>`; old rows pruned opportunistically |
| `AuditLog` | Security/audit trail | actor (nullable on user delete), action, entity, summary, metadata JSON, IP |

## Content (workflow)

`ContentStatus` enum: `DRAFT`, `IN_REVIEW`, `SCHEDULED`, `PUBLISHED`, `ARCHIVED`. Public queries show
`PUBLISHED`, or `SCHEDULED` with `publishAt ≤ now`. Each workflow table has `status`, `publishAt`,
`publishedAt`, `createdById`, `updatedById`, timestamps and (except Publication) SEO fields
`metaTitle`, `metaDescription`, `noindex`.

| Table | Key fields | Uniques |
|---|---|---|
| `Page` | `slug`, `title`, `template`, `sections` (JSON array of `{id,type,hidden?,data}`), `canonicalUrl`, `ogImage`, `legacyPath` | `slug` |
| `Event` | `collection` (`CURRENT`/`ARCHIVE`), `type`, `dateText` (as displayed), `startDate`/`endDate` (`date`), venue/city/address/map/fees/contact[], `registrationUrl`, `pdfUrl`, `image`, `descriptionHtml`, `writeupHtml`, `highlights`/`schedule`/`people` (JSON), `gallery text[]`, `relatedSlugs text[]`, `legacyStatus`, `extra` (JSON: legacy fields never displayed), `sourceLink` | `slug`, `legacyId` |
| `NewsArticle` | `bodyHtml`, `gallery` (JSON: image or YouTube), card fields | `slug`, `legacyId` |
| `PressItem` / `PressGroup` | item: `year`, `image`; group: `media`, `dateText`, `readOnlineUrl`, `items text[]`, cascade delete | `slug`, `legacyId` |
| `Publication` | `kind` (`BOOK`/`NEWSLETTER`/`HAPPENINGS`/`REPORT`), card + cover fields, `fileUrl`, `isFeatured`, `isArchived`, `groupLabel`, `showRead`, `showDownload` | `legacyKey` |
| `Revision` | `entityType`, `entityId`, `data` snapshot JSON, note, author | newest 50 kept per record |

## Organisation data (visible / hidden flag, sort order)

`AwardCategory`, `AwardRecipient` (`year`, `name`, `award`, `craft`, `state`, `photo`, `isFeatured`,
`listing` = `awards`/`past-awards`), `Artisan`, `TeamMember` (`group` = `EC_MEMBER`/`OFFICE_BEARER`),
`StateCouncil`, `CraftState` (`code` = SVG map id, unique) → `CraftLocation` (craft/district/village) and
`CraftStateImage` (cascade), `CraftProcess` (`slug` unique, `steps` JSON, `materials`/`states` text[]).

## Site management

| Table | Purpose |
|---|---|
| `Media` | Every file: `path` (unique, URL path without leading slash), `storage` (`LEGACY`/`LOCAL`), MIME, size, dimensions, SHA-1, alt/caption/title/folder |
| `MenuItem` | Menus `main`, `footer-quick`, `footer-resources`, `footer-connect`, `legal`; self-relation for dropdowns (cascade) |
| `SiteSetting` | `key` → JSON value; keys and defaults in `src/lib/settings-schema.ts` |
| `Redirect` | `source` (unique path) → `destination`, permanent flag, hit counter |
| `FormSubmission` | Contact enquiries; `status` (`NEW`/`READ`/`ARCHIVED`/`SPAM`), `emailStatus` (`PENDING`/`SENT`/`FAILED`/`SKIPPED`) |

## Integrity rules enforced by the database

Unique slugs/keys/paths; enum-typed statuses; FK cascades for child rows (press groups, craft locations,
menu children, sessions, user-roles); `Restrict` on deleting roles that are assigned; `SetNull` on audit
actor when a user is removed. Multi-record writes (record + revision, nested children) run in transactions.
