# Security Checklist

Status as of this migration. ✔ = implemented and verified by an automated test or direct
observation; ◐ = implemented, not covered by an automated test; ✘ = not done (see notes).

## Authentication & sessions
- ✔ No public registration; accounts created by Super Admin (UI) or `npm run admin:create` (CLI)
- ✔ No default/hard-coded credentials anywhere in code, seed or docs
- ✔ Argon2id password hashing (`@node-rs/argon2`, OWASP parameters)
- ✔ Password policy: ≥12 chars, 3 character classes; temporary passwords force a change
- ✔ Login rate limiting + lockout (per account and per IP)
- ✔ Server-side sessions, hashed tokens, HttpOnly/SameSite cookies, `Secure` in production
- ✔ Session expiry (12 h, sliding) and revocation (sign-out, password change/reset, deactivation, "sign out everywhere")
- ✘ Multi-factor authentication (recommended for Super Admins; not implemented)

## Authorization
- ✔ Deny by default; central `hasPermission`/`canModify` helpers
- ✔ Enforced on every admin page, Server Action and API route (not only by hiding UI)
- ✔ Ownership rules for Authors; publish gating; reviewer approval path
- ✔ Privilege-escalation guards for users/roles; last Super Admin protected
- ✔ Documented matrix (`RBAC_PERMISSION_MATRIX.md`, generated from code)

## Input, output & files
- ✔ zod validation for every form, action and API payload
- ✔ HTML sanitised at save and render; JSON-LD escaped
- ✔ Upload type by magic bytes, size limits, random names, `nosniff`, traversal-safe storage
- ✔ CSV export formula-injection guard
- ✔ Contact email HTML-escaped (legacy used `strip_tags`)

## Transport & headers
- ✔ `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, CSP, no `X-Powered-By`
- ◐ HSTS sent when `SITE_ENV=production`; HTTPS + `www` redirect must be configured at the proxy/host (legacy did it in `.htaccess`) — see `DEPLOYMENT.md`
- ✘ Nonce-based CSP without `'unsafe-inline'` (future hardening)

## Data protection & operations
- ✔ Audit log of sensitive actions
- ✔ Revisions + restore; importer idempotent and refuses `--refresh` in production
- ✔ Submissions stored even if email fails; SMTP errors not shown to visitors
- ◐ Backups — procedure documented in `BACKUP_AND_RESTORE.md`; scheduling is an operations task
- ✔ `robots`/`noindex` for non-production; admin/preview/API never indexable
- ✔ Secrets only via environment; `.env.example` has no values

## Before go-live
- [ ] Set strong `DATABASE_URL` credentials; restrict DB network access
- [ ] Configure `RECAPTCHA_SECRET_KEY` + `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` (production requires reCAPTCHA)
- [ ] Rotate the ZeptoMail token that lived in the legacy `secrets.php` and set it as `SMTP_PASSWORD`
- [ ] Create the first Super Admin with `npm run admin:create`; create named accounts for everyone else
- [ ] Set `TRUST_PROXY=true` only behind a proxy that overwrites `X-Forwarded-For`
- [ ] Put `UPLOAD_DIR` on persistent, backed-up storage
- [ ] Run `npm audit` and review
