# SEO Baseline (legacy site, from source)

The live site was not crawled and no Search Console/analytics export was available, so this
baseline is derived from the source. Before cut-over, capture a crawl of production (e.g.
Screaming Frog) and Search Console's top URLs and compare against `docs/seo/SEO_MIGRATION_CHECKLIST.md`.

## Site-wide

| Item | Legacy state |
|---|---|
| Canonical host | `https://www.` forced by `.htaccess` (301) |
| `robots.txt` | **Absent** |
| `sitemap.xml` | **Absent** |
| Canonical tags | **None** on any page |
| Meta descriptions | **None** on any page |
| Open Graph / Twitter cards | **None** |
| Structured data | One `Organization` JSON-LD injected client-side by `footer.js`; its `logo` URL points to a missing file (`/images/logo.png`) |
| `lang` | `en` on all pages |
| Favicon | `images/favico.png` declared on home page only |
| Analytics | GA4 `G-MPHGJB3T4E` injected client-side by `footer.js` |
| Rendering | Events, news, press, nav, footer and crafts map are **client-rendered**; crawlers that do not execute JS see empty listings and detail pages |
| Detail URLs | Query-string based (`event-detail.html?id=…`), titles set by JS only |
| 404 page | None (Apache default) |
| Trailing slash | N/A (`.html` URLs) |
| hreflang | N/A (English only) |

## Per-page titles (H1 in parentheses)

| URL | `<title>` | H1 |
|---|---|---|
| `/index.html` | Crafts Council of India \| Preserving India’s Living Crafts | Preserving and Sustaining India's living craft |
| `/about.html` | About Us - Crafts Council of India | About CCI |
| `/what-we-do.html` | What We Do - Crafts Council of India | What We Do |
| `/awards.html` | Kamala Awards - Crafts Council of India | Kamala Awards |
| `/past-awards.html` | Kamala Awards - Crafts Council of India (**duplicate title**) | Kamala Awards (**duplicate H1**) |
| `/events.html` | Events - Crafts Council of India | Events & Exhibitions |
| `/past-events.html` | Past Events Archive - Crafts Council of India | Past Events Archive |
| `/event-detail.html` | Event Details - Crafts Council of India (JS replaces with event title) | JS-rendered |
| `/news.html` | News — Crafts Council of India | News |
| `/news-detail.html` | News Details - Crafts Council of India (JS replaces) | JS-rendered |
| `/press.html` | Press & Media - Crafts Council of India | Press & Media |
| `/press-details.html` | Press Details - Crafts Council of India | JS-rendered |
| `/books.html` | Books - Crafts Council of India | Books |
| `/newsletters.html` | Newsletters - Crafts Council of India | Newsletters |
| `/past-newsletters.html` | Newsletters Archive - Crafts Council of India | (see page) |
| `/happenings-in-handmade.html` | Happenings in Handmade - Crafts Council of India | Happenings in Handmade |
| `/past-happenings-in-handmade.html` | Happenings in Handmade - Crafts Council of India (**duplicate title**) | |
| `/reports.html` | report - Crafts Council of India | Reports |
| `/crafts-map.html` | Crafts Map of India - Statewise crafts data of India | Indian Crafts Map |
| `/craft-processes.html` | Craft Processes - Crafts Council of India | Craft Processes |
| `/contact.html` | Contact Us - Crafts Council of India | Get in Touch |
| `/privacy-policy.html` | Privacy Policy - Crafts Council of India | Privacy Policy |
| `/disclaimer.html` | Terms & Conditions - Crafts Council of India | (see page) |

## Other observations

* Most `<img>` elements in publication grids have no `alt` attribute; gallery images use `alt="gallery"`.
* Hero/card imagery is set via CSS `background-image` (not indexable as images).
* Several pages have multiple `<h1>`-less structures where the first heading is an `<h2>`.
* Internal links to `.html` files are relative; the homepage marquee links to `/news-detail.html?id=…`.

## Migration commitments

1. Keep all public content server-rendered (crawlable without JS).
2. Unique editable title + description per page and per record, with sensible fallbacks.
3. Canonical URL, Open Graph and Twitter metadata on every public page.
4. `sitemap.xml` (published, indexable records only) and environment-aware `robots.txt`.
5. 301/308 redirects for every legacy URL pattern (see ROUTE_INVENTORY.md).
6. Fix the Organization JSON-LD logo URL; add `Event`, `NewsArticle` and `BreadcrumbList` JSON-LD
   built only from real data (no fabricated ratings, reviews, or details).
7. Custom 404 page.
