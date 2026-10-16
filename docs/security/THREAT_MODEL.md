# Threat Model

Scope: the public website, the `/admin` CMS, the JSON/upload/export APIs, the PostgreSQL database
and the upload store. Method: STRIDE per entry point. "Tested" links to the automated test that
exercises the control (see `docs/TESTING.md`).

## Assets

| Asset | Why it matters |
|---|---|
| Admin accounts and sessions | Full control of public content and enquiry data |
| Enquiry submissions (names, emails, phones, messages) | Personal data |
| Published content and media | Organisation's public voice and reputation |
| Legacy originals (`_public_html/`) | Source of truth for the migration; must stay intact |
| Secrets (DB URL, SMTP token, reCAPTCHA secret) | Account takeover of external services |

## Actors

Anonymous visitors, bots/spammers, authenticated staff with different roles (incl. a malicious or
compromised low-privilege account), infrastructure operators.

## Entry points and mitigations

| # | Threat (STRIDE) | Entry point | Mitigation | Tested |
|---|---|---|---|---|
| T1 | Spoofing — credential stuffing / brute force | `POST /admin/login` (Server Action) | Argon2id hashes; generic error message; constant-ish timing via dummy hash for unknown emails; per-account (5) and per-IP (20) failure limits per 15 min, persisted in `LoginAttempt` | `auth.spec.ts` lockout + generic error |
| T2 | Spoofing — session theft/replay | `cci_session` cookie | 256-bit random token; only its SHA-256 stored; `HttpOnly`, `SameSite=Lax`, `Secure` in production; 12 h expiry with sliding renewal; server-side revocation on sign-out, password change/reset, deactivation | `auth.spec.ts` cookie flags, replay after sign-out, forged cookie |
| T3 | Elevation — horizontal (edit others' content) | Server Actions `saveRecord`/`deleteRecord` | Ownership check (`*.update.own`, `createdById`) on the server using the stored record, never client-supplied IDs/roles | `rbac.spec.ts`, `workflow.spec.ts` (author vs others), `permissions.test.ts` |
| T4 | Elevation — vertical (self-grant roles) | users/roles actions | `roles.manage`/`users.manage` Super Admin only by default; non-`*` users cannot assign roles containing `*`, `roles.manage`, `users.manage`; `*` never grantable from UI; last active Super Admin cannot be removed/deactivated | `rbac.spec.ts`; code: `users/actions.ts`, `roles/actions.ts` |
| T5 | Elevation — publish without approval | `saveRecord` | `requiresPublishPermission()` gate on status transitions | `workflow.spec.ts`, `permissions.test.ts` |
| T6 | Tampering — stored XSS | All rich text, section HTML, inline HTML | Allow-list sanitizer (`sanitize-html`) at save **and** render; iframes limited to YouTube; `javascript:` blocked; `rel=noopener` forced; CSP | `sanitize.test.ts`, `workflow.spec.ts` XSS probe |
| T7 | Tampering — CSRF | Server Actions; Route Handlers (`/api/contact`, `/api/admin/media`) | Next.js Server Actions Origin check; `isSameOrigin()` on mutating Route Handlers; `SameSite=Lax` cookie | `rbac.spec.ts` cross-origin upload, `media-contact.spec.ts` |
| T8 | Tampering — malicious upload (HTML/SVG/script polyglot) | `POST /api/admin/media` | Type detected from magic bytes (not name/MIME); SVG/HTML refused; random server-generated file names; size limit; served from `/uploads` with stored MIME + `nosniff`; only registered media served | `media-contact.spec.ts` |
| T9 | Tampering — path traversal | `/uploads/[...path]`, storage driver | `safeUploadPath()` refuses paths outside `UPLOAD_DIR`; lookup by DB record first | `media-contact.spec.ts` |
| T10 | Tampering — accidental data loss | Delete actions, importer | Revision snapshot before every change and delete; first edit snapshots the imported original; media in use cannot be deleted; legacy originals protected; importer never overwrites (only `--refresh`, refused in production) | `workflow.spec.ts` restore, `import.test.ts` idempotency |
| T11 | Repudiation | All sensitive operations | `AuditLog`: sign-in success/failure/lockout, sign-out, password change/reset, role/permission changes, user changes, publish/unpublish/archive, deletes, exports, settings, media uploads/deletes | `workflow.spec.ts` (settings audited) |
| T12 | Information disclosure — enumeration / error leaks | Login, contact API | Generic login errors; SMTP errors logged server-side only (legacy endpoint returned them to the browser) | `auth.spec.ts` |
| T13 | Information disclosure — drafts indexed | Public routes, sitemap, preview | Only published/scheduled-due records queried publicly; preview requires a session + read permission and is `noindex`; robots disallows `/admin`, `/api/`, `/preview/`; non-production sites `noindex` everything | `seo.spec.ts` |
| T14 | Information disclosure — CSV/formula injection in exports | Submissions CSV | Cells quoted; leading `= + - @` neutralised | code: `api/admin/submissions/export/route.ts` |
| T15 | DoS — spam / form flooding | `/api/contact` | reCAPTCHA (when configured, always in production), honeypot, per-IP rate limit (5 / 10 min), payload size limits | `media-contact.spec.ts` |
| T16 | DoS — large uploads | media API | `UPLOAD_MAX_BYTES` (25 MB default) | code |
| T17 | Clickjacking | All pages | `X-Frame-Options: SAMEORIGIN`, CSP `frame-ancestors 'self'` | `seo.spec.ts` headers |
| T18 | Secrets exposure | Repo, logs | Only `.env.example` committed; `.env*` git-ignored; no default credentials; first admin created by CLI with password from env/prompt | review |

## Residual risks (accepted or pending decision)

* `script-src 'unsafe-inline'` is needed for Next.js inline bootstrap and GA; a nonce-based CSP is a
  future hardening step (`docs/migration/REMAINING_ISSUES.md`).
* Rate limiting trusts `X-Forwarded-For` only when `TRUST_PROXY=true`; behind an untrusted proxy all
  clients may share one bucket.
* No MFA for admin accounts (not supported by the current auth implementation) — recommended for Super Admins.
* Email enumeration via timing is reduced, not eliminated.
