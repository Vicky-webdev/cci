# Project Overview

The Crafts Council of India website (`www.craftscouncilofindia.in`) was migrated from a hand-maintained
static HTML/JavaScript site (content edited in source files, deployed by FTP) to a Next.js application with a
database-backed CMS, so staff can manage the site without editing code.

## What the site contains

* Organisation pages: Home, About, What we do, Contact (with 11 affiliated State Councils), legal pages.
* Kamala Awards: call for applications, categories, featured awardees and tables from 2000 to 2023.
* Events (43 current + 73 archived), News (7), Press coverage (12 collections, incl. 1980–1990 Hindu archive PDFs).
* Publications: books, newsletters, *Happenings in Handmade*, reports (82 items with PDFs).
* Interactive Indian Crafts Map (34 states/UTs, 1,226 craft-location records) and 16 craft processes.
* ~4,000 legacy images, PDFs and videos, all kept at their original URLs.

## What changed for editors

| Before | Now |
|---|---|
| Edit `events.js` / HTML, upload via FTP, bump `APP_VERSION` | Sign in at `/admin`, edit a form, Save & publish |
| No drafts, no review, no history | Draft → In review → Published/Scheduled/Archived, revision history with restore |
| Enquiries only by email (lost if email failed) | Enquiries stored in the CMS and emailed; CSV export |
| One shared FTP login | Named accounts with roles and an audit log |

## What changed for visitors / search engines

Same design and behaviour; pages now render on the server (crawlable), have unique metadata, canonical URLs,
Open Graph tags, structured data, a sitemap and robots.txt. Old URLs redirect permanently.

## Status

See `docs/migration/FEATURE_PARITY_MATRIX.md` (verified features), `docs/migration/REMAINING_ISSUES.md`
(open items and decisions) and `docs/CHANGELOG.md`.
