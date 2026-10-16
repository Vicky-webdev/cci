# SEO Guide

## What the site does automatically

| Item | Implementation |
|---|---|
| Server-rendered HTML | All public content is in the initial HTML (no JS needed to read it) |
| `<title>` | Record's **Meta title** if set; otherwise the legacy title (pages) or "`<title>` — Crafts Council of India" (detail pages); default template in Settings |
| Meta description | **Meta description** field; otherwise the page subtitle / item summary / site default (Settings) |
| Canonical URL | Clean URL of the record (`/events/<slug>`); pages may override |
| Open Graph / Twitter | Title, description, URL, image (record image → Settings default) |
| Structured data | `Organization` (site-wide), `Event` (events with a parsed start date — only real data), `BreadcrumbList` (event/news/press detail) |
| `sitemap.xml` | Published, non-`noindex` pages, events, news, press — canonical URLs only |
| `robots.txt` | Production: allow all except `/admin`, `/api/`, `/preview/` + sitemap link. Other environments: disallow all |
| `noindex` | Per-record checkbox; all non-production environments; admin (`X-Robots-Tag`), previews |
| Redirects | All legacy `.html`, `?id=` and old WordPress `/event/<slug>/` URLs → 308 to the new URL; CMS **Redirects** for anything else |
| 404 page | Custom page with links back into the site |
| Images | Original files and URLs preserved; descriptive alt text from the CMS (set it in the Media library and on records) |

## Editor checklist for each new page / item

1. Clear title (≤ 60 characters is ideal) and a meta description (~150 characters) that summarises the page.
2. Keep the slug short and descriptive; don't change it after publishing (or add a redirect).
3. Add alt text to every meaningful image.
4. Use headings in order in rich text (H2, then H3) — the page title is the H1.
5. Link to related pages (events ↔ awards, news ↔ reports).
6. Fill real event dates and venue so the `Event` structured data is complete.

## Don't

* Don't add fake reviews, ratings or invented business details to content or structured data.
* Don't publish thin duplicate pages; use redirects when replacing a page.
* Don't index staging: keep `SITE_ENV` other than `production` there.

## After launch

Submit `https://www.craftscouncilofindia.in/sitemap.xml` in Google Search Console and Bing Webmaster Tools;
watch Coverage/Pages for 404s for four weeks and add redirects for any legacy URL that was missed.
Checklist: `docs/seo/SEO_MIGRATION_CHECKLIST.md`.
