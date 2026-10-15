# SEO Migration Checklist

Before/after comparison against `docs/migration/SEO_BASELINE.md`. "Verified" = checked by an automated test
(`tests/e2e/seo.spec.ts`, `public.spec.ts`) against the production build, or by direct observation (noted).

| Check | Before (legacy) | After | Status |
|---|---|---|---|
| Every legacy page URL resolves (redirect → 200) | 23 `.html` files | 308 → clean URL → 200 | Verified: all 23 with `curl -L` (2026-10-15, dev server); 5 in the e2e suite |
| Detail URLs `?id=` | `event-detail.html?id=…` (JS) | 308 → `/events/<slug>` etc.; legacy mixed-case IDs resolve | Verified |
| Old WordPress `/event/<slug>/` | 404 on static site | 308 → `/events/<slug>` (two hops: trailing-slash then path) | Verified |
| Asset URLs | `/images/…`, `/docs/…` | Unchanged | Verified (4 sampled; all files hard-linked by `assets:sync`) |
| Content crawlable without JS | Events/news/press/nav/footer were JS-rendered | Server-rendered | Verified (JS-disabled test) |
| Unique titles | 2 duplicates (`past-awards`, `past-happenings…`) | Legacy titles preserved; duplicates editable in CMS | Partial — duplicates kept for parity, logged in REMAINING_ISSUES |
| Meta descriptions | None | Every page (field or fallback) | Verified |
| Canonical | None | Every public page | Verified |
| Open Graph / Twitter | None | Every public page | Verified |
| Structured data | Organization (client-side, broken logo URL) | Organization (logo fixed), Event, BreadcrumbList — server-side | Verified |
| `sitemap.xml` | None | 155 URLs (20 pages + 116 events + 7 news + 12 press) | Verified |
| `robots.txt` | None | Environment-aware | Verified (non-production) |
| Drafts/admin not indexable | n/a | `noindex`, robots disallow, not in sitemap | Verified |
| 404 handling | Apache default | Custom 404 with status 404 | Verified |
| Trailing slash | n/a | No trailing slash; `/x/` → `/x` | Observed |
| hreflang | English only | Not needed | n/a |
| HTTPS + `www` | `.htaccess` | Must be configured at host/proxy | **Pending deployment** |

## Cut-over tasks (manual)

- [ ] Crawl the live legacy site and diff its URL list with `docs/migration/ROUTE_INVENTORY.md`.
- [ ] Export top landing pages from Search Console/GA4; spot-check each redirects to the right page.
- [ ] Set `SITE_ENV=production` and `SITE_URL=https://www.craftscouncilofindia.in`.
- [ ] Submit the sitemap; monitor 404s and Core Web Vitals for 4 weeks.
