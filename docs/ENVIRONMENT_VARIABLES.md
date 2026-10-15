# Environment Variables

Validated at runtime by `src/lib/env.ts`. A template without values is in `.env.example`.
Never commit real values; never paste them into documentation, tickets or chat.

| Variable | Required | Default | Purpose |
|---|---|---|---|
| `DATABASE_URL` | yes | — | PostgreSQL connection string (Prisma + scripts) |
| `SITE_URL` | yes in production | `http://localhost:3000` | Public base URL without trailing slash; canonical URLs, sitemap, JSON-LD |
| `SITE_ENV` | yes in production | `development` | `production` enables indexing (robots.txt, meta robots) and HSTS, and makes reCAPTCHA mandatory. Anything else = `noindex` everywhere |
| `SESSION_TTL_HOURS` | no | `12` | Admin session lifetime (sliding) |
| `SESSION_COOKIE_SECURE` | no | secure when `NODE_ENV=production` | `false` only for local HTTP |
| `TRUST_PROXY` | no | `false` | `true` when behind a reverse proxy that sets `X-Forwarded-For` (rate limiting uses the client IP) |
| `UPLOAD_DIR` | yes in production | `./storage/uploads` | Where CMS uploads are stored — must be persistent and backed up |
| `UPLOAD_MAX_BYTES` | no | `26214400` (25 MB) | Upload size limit |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | production | — | reCAPTCHA v2 checkbox site key (public). Legacy key: see `_public_html/contact.html` |
| `RECAPTCHA_SECRET_KEY` | production | — | reCAPTCHA secret (was `recaptcha_secret` in `secrets.php`) |
| `SMTP_HOST` | for email | — | e.g. `smtp.zeptomail.com` |
| `SMTP_PORT` | no | `587` | 587 = STARTTLS, 465 = TLS |
| `SMTP_USER` | for email | — | ZeptoMail: `emailapikey` |
| `SMTP_PASSWORD` | for email | — | ZeptoMail Send Mail token (was `smtp_password` in `secrets.php`) |
| `MAIL_FROM` | no | `Crafts Council Of India <noreply@craftscouncilofindia.in>` | Sender |
| `LEGACY_ROOT` | no | `_public_html` | Legacy site path for importer and asset sync |
| `TEST_DATABASE_URL` | tests | — | Role with CREATEDB; integration tests create/drop their own database |
| `E2E_ADMIN_DATABASE_URL` | tests | — | Same, for Playwright (`tests/e2e/prepare.ts`) |
| `PW_CHROMIUM_PATH` | tests | — | Optional Chromium executable for Playwright |
| `ADMIN_PASSWORD` | CLI / first deploy | — | Password for `npm run admin:create` (otherwise prompted). Also read by `vercel-build` to create the first Super Admin — remove it from the host afterwards |
| `ADMIN_EMAIL`, `ADMIN_NAME` | first deploy | — | Email/name of the first Super Admin created by `vercel-build` when the database has no users |
| `DATABASE_URL_UNPOOLED` | no | — | Direct (non-pooled) connection used for migrations when `DATABASE_URL` points at a pooler (set automatically by Neon on Vercel) |
| `BLOB_READ_WRITE_TOKEN` | serverless hosting | — | When set, CMS uploads are stored in Vercel Blob (private) instead of `UPLOAD_DIR` (set automatically when a Blob store is connected) |

Without SMTP settings, enquiries are still stored (email status `SKIPPED`).
Without reCAPTCHA keys outside production, the form works without the widget (development only).
