# Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `Invalid environment configuration — DATABASE_URL: …` | Missing/invalid env var | Check `.env` against `docs/ENVIRONMENT_VARIABLES.md` |
| Images/PDFs 404 (`/images/...`) | `public/images` not synced | `npm run assets:sync` (runs automatically on `dev`/`build`) |
| `Unknown argument …` from Prisma after pulling | Client not regenerated | `npx prisma generate` |
| Build fails "Parsing CSS source code failed" in `src/styles/pages` | Edited legacy inline CSS contains something browsers ignore but the build rejects | Re-run `node scripts/scope-legacy-css.mjs` (drops invalid rules like browsers do) |
| Can't sign in, "Too many failed sign-in attempts" | Lockout (5 failures / 15 min per account, 20 per IP) | Wait 15 min, or a developer deletes recent failed rows from `LoginAttempt` for that email |
| Everyone shares one IP in rate limiting / audit | App behind a proxy without `TRUST_PROXY` | Set `TRUST_PROXY=true` (only if the proxy overwrites `X-Forwarded-For`) |
| Signed out immediately after sign-in on HTTP | Secure cookie over plain HTTP | Use HTTPS, or `SESSION_COOKIE_SECURE=false` for local development only |
| Lost all admin access | No active Super Admin | `npm run admin:create -- --email=… --name=…` on the server |
| Enquiry saved but email not received | SMTP not configured or failing | Admin → Form submissions shows `FAILED`/`SKIPPED`; check SMTP_* vars and server logs (`[contact] email notification failed`) |
| "Captcha missing" on the contact form | reCAPTCHA keys set but widget blocked | Check `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` domain settings in Google reCAPTCHA admin |
| Instagram band shows site photos | Behold feed limit reached/unreachable | Expected fallback; check the Behold plan or the feed URL in Settings |
| Event shows under "past" unexpectedly | Start date parsed from text is in the past | Set **Start date** explicitly on the event |
| Page change not visible | Page/record is Draft/In review/Scheduled, or section hidden | Check status and the section's Hide flag |
| "Built-in pages cannot be deleted" | Routes depend on them | Unpublish/archive instead |
| Search engines indexing staging | `SITE_ENV=production` on staging | Set `SITE_ENV=staging` |
| Upload refused "Unsupported file type" | Content isn't one of the allowed formats (by magic bytes) | Convert to JPEG/PNG/WebP/PDF/MP4 |
| Can't delete a media file | It is a legacy original or still referenced | See the file's "Used in" list |
