# Crafts Council of India — Website

The Crafts Council of India website, migrated from a hand-written static HTML site (`_public_html/`)
to a **Next.js 16** application with a **PostgreSQL** database, a content management system and a
role-based admin panel.

* Public site: every legacy page, rendered on the server from CMS data, with the original design.
* Admin panel (`/admin`): pages, events, news, press, publications, awards, people, state councils,
  crafts map, craft processes, media library, navigation, settings, redirects, contact submissions,
  users, roles and audit log — every action checked against granular permissions on the server.
* Legacy URLs (`*.html`, `?id=` detail pages, old WordPress `/event/<slug>/`) permanently redirect to
  the new clean URLs.

The original site in `_public_html/` is kept unchanged as the migration's source of truth and as the
source of legacy images and PDFs.

## Quick start

```bash
npm install
cp .env.example .env                   # set DATABASE_URL, SITE_URL; SESSION_COOKIE_SECURE=false for local http
npx prisma migrate deploy && npx prisma generate
npm run db:seed                        # system roles
npm run import:legacy                  # import all legacy content
npm run admin:create -- --email=you@example.org --name="Your Name"
npm run dev                            # http://localhost:3000 — admin at /admin
```

There is no public registration and no default account; the first Super Admin is created with
`admin:create`. Full instructions: [`docs/DEVELOPMENT_SETUP.md`](docs/DEVELOPMENT_SETUP.md).

## Common commands

| Command | Purpose |
|---|---|
| `npm run dev` / `npm run build` / `npm start` | Develop / production build / serve the build |
| `npm run lint` / `npm run typecheck` | ESLint / TypeScript |
| `npm test` | Unit tests (+ integration tests when `TEST_DATABASE_URL` is set) |
| `npm run test:e2e` | Playwright end-to-end tests against a throwaway database |
| `npm run import:legacy [-- --dry-run]` | Import legacy content (idempotent) |
| `npm run admin:create` | Create an admin user (interactive password prompt) |

## Documentation

| Topic | Document |
|---|---|
| What the project is | [`docs/PROJECT_OVERVIEW.md`](docs/PROJECT_OVERVIEW.md) |
| Architecture and decisions | [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md), [`docs/architecture/DECISIONS.md`](docs/architecture/DECISIONS.md) |
| Setup, environment variables | [`docs/DEVELOPMENT_SETUP.md`](docs/DEVELOPMENT_SETUP.md), [`docs/ENVIRONMENT_VARIABLES.md`](docs/ENVIRONMENT_VARIABLES.md) |
| Database and content model | [`docs/DATABASE_SCHEMA.md`](docs/DATABASE_SCHEMA.md), [`docs/CONTENT_MODEL.md`](docs/CONTENT_MODEL.md) |
| Using the admin panel | [`docs/ADMIN_USER_GUIDE.md`](docs/ADMIN_USER_GUIDE.md), [`docs/MEDIA_LIBRARY_GUIDE.md`](docs/MEDIA_LIBRARY_GUIDE.md) |
| Roles and permissions | [`docs/ROLES_AND_PERMISSIONS.md`](docs/ROLES_AND_PERMISSIONS.md), [`docs/security/RBAC_PERMISSION_MATRIX.md`](docs/security/RBAC_PERMISSION_MATRIX.md) |
| Security | [`docs/security/THREAT_MODEL.md`](docs/security/THREAT_MODEL.md), [`docs/security/SECURITY_CHECKLIST.md`](docs/security/SECURITY_CHECKLIST.md) |
| SEO | [`docs/SEO_GUIDE.md`](docs/SEO_GUIDE.md), [`docs/seo/SEO_MIGRATION_CHECKLIST.md`](docs/seo/SEO_MIGRATION_CHECKLIST.md) |
| Deploying, backups | [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md), [`docs/BACKUP_AND_RESTORE.md`](docs/BACKUP_AND_RESTORE.md) |
| Testing, troubleshooting | [`docs/TESTING.md`](docs/TESTING.md), [`docs/TROUBLESHOOTING.md`](docs/TROUBLESHOOTING.md) |
| Migration record | [`docs/migration/`](docs/migration/) — inventories, parity matrix, reconciliation, remaining issues |
| Changes | [`docs/CHANGELOG.md`](docs/CHANGELOG.md) |

## Status

The migration is code-complete and verified in a staging-like local environment (see
[`docs/TESTING.md`](docs/TESTING.md)). It has **not** been deployed. Open decisions — hosting, the
URL scheme and several content questions — are listed in
[`docs/migration/REMAINING_ISSUES.md`](docs/migration/REMAINING_ISSUES.md).
