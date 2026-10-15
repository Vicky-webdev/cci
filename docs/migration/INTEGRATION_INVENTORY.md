# Integration Inventory

| Integration | Where (legacy) | Purpose | Credentials | Migration |
|---|---|---|---|---|
| Google reCAPTCHA v2 (checkbox) | `contact.html` (`g-recaptcha` widget, site key `6LeZzeYs…`), verified in `send_enquiry.php` | Spam protection on contact form | Site key (public) in HTML; secret in `secrets.php` | Site key → `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`; secret → `RECAPTCHA_SECRET_KEY`; server-side verification in `/api/contact`. The redundant v3 `?render=` script load is dropped (the v2 widget is what the form uses) |
| ZeptoMail SMTP (smtp.zeptomail.com:587, STARTTLS) via PHPMailer | `send_enquiry.php` | Emails enquiries from `noreply@craftscouncilofindia.in` to `info@craftscouncilofindia.in`, reply-to the sender | `secrets.php` | Nodemailer with `SMTP_HOST/PORT/USER/PASSWORD`, `MAIL_FROM`; recipient is the CMS setting "Send enquiries to". Submissions are now also stored in the DB, so an SMTP outage no longer loses enquiries |
| Google Analytics 4 (`G-MPHGJB3T4E`) | `footer.js` (client-injected) | Analytics | Public ID | `SiteSetting analytics.gaMeasurementId` (editable in admin); loaded with `next/script` on public pages only |
| Behold.so Instagram feed (`feeds.behold.so/nUTFUE5VrVvIS91W91Ta`) | `footer.js` | Instagram grid above footer; lazy-loaded, 6 h localStorage cache, 3-day stale fallback, static fallback images | Public feed URL | Same behaviour in a client component; feed URL editable in settings |
| Instagram Graph API | `instagram.js` | Older widget | Expects `window.CCI_IG_TOKEN` (no token in the file) | **Not migrated** — file is not loaded by any page; superseded by the Behold feed. Original kept in `_public_html/` |
| Google Fonts | All pages | Cormorant Garamond, DM Sans, Petit Formal Script | — | Self-hosted via `@fontsource/*` packages (same family names as the legacy CSS; no runtime request to Google) |
| YouTube embeds | `news.js` descriptions/galleries | Videos on news detail | — | Allow-listed iframes (youtube.com / youtube-nocookie.com) in sanitized HTML; `referrerpolicy` + `allow` attributes added as the legacy code did |
| Google Docs links | `awards.html` | Kamala Awards application form/info | — | Stored as section data |
| Google Maps links | `events.js` (`mapLink`) | Venue location | — | Event field |
| WhatsApp share / clipboard | Event detail | Share buttons | — | Client component |
| Kamala Crafts store (`kamalacrafts.com`) | Home | External shop links | — | Section data |
| Social profiles | `footer.js` | Facebook, Instagram, YouTube, LinkedIn | — | Settings / footer menu |
| Apache `.htaccess` | root | HTTPS + www redirect, security headers, gzip, caching, secrets block | — | Security headers in `next.config.ts`; HTTPS/www at hosting/proxy level (documented in DEPLOYMENT.md) |

## Dependencies and licences (legacy)

| Dependency | Version | Licence | Status |
|---|---|---|---|
| PHPMailer | see `PHPMailer/VERSION` | LGPL-2.1 | Replaced by nodemailer (MIT-0) |
| Google Fonts (above) | — | SIL OFL 1.1 | Kept via next/font |
| India SVG map paths | "Generated from amCharts geodata" (comment in `crafts-map.html`) | amCharts geodata licence — **verify** (free amCharts geodata requires attribution unless licensed) | Kept verbatim; licence confirmation logged in REMAINING_ISSUES |
| No other third-party JS libraries (no jQuery, no slider plugins) | | | Sliders/lightboxes are hand-written and re-implemented as React components |
