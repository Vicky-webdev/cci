# Content Inventory

Every content type discovered in the legacy site, where it lives, its volume, and the CMS
model it maps to. Counts come from executing the legacy data files
(`scripts/import-legacy-content/` loads them in a sandboxed VM) and from parsing the HTML.
Final imported totals are in [`RECONCILIATION_REPORT.md`](./RECONCILIATION_REPORT.md).

| Content type | Legacy location | Volume | Fields observed | CMS model |
|---|---|---:|---|---|
| Current events | `events.js` → `EVENTS` | 43 | id, type, title, subtitle, dates (free text), time, venue, city, image, heroGradient, heroEmoji, tagLabel, tagClass, description[] (HTML allowed), gallery[] (images + mp4), status (1), people (2), contact[] (20), entryFee (5), address (20), mapLink (5), shopTiming, pricing, ticketPrice (4), ageGroup (4), parking, map (7), pdf (2), payments, specialEvent, eventWriteup, invitePDF | `Event` (collection CURRENT) |
| Archive events | `events-final.js` → `PAST_EVENTS` | 73 | id, source_link (old WordPress URL), type, title, subtitle, dates, time, venue, city, image, heroGradient, heroEmoji, tagLabel, tagClass, description[], gallery[] | `Event` (collection ARCHIVE) |
| News | `news.js` → `NEWS` | 7 | id, type, title, subtitle, dates, venue, city, image, heroGradient, heroEmoji, tagLabel (6), tagClass, description[] (raw HTML incl. YouTube iframes), gallery[] (images or `{type:'youtube',url}`) | `NewsArticle` |
| Press coverage | `press.js` → `PRESS` | 12 items | id, year, title, heroGradient, subtitle, image, galleries[{media, date?, readOnline?, images[]}] | `PressItem` + `PressGroup` |
| Books | `books.html` | 1 featured + 6 cards | title, cover, author/subtitle, PDF | `Publication` (BOOK) |
| Newsletters | `newsletters.html`, `past-newsletters.html` | 1 featured + 6 + 12 | title, cover, date label, PDF | `Publication` (NEWSLETTER) |
| Happenings in Handmade | `happenings-in-handmade.html`, `past-happenings-in-handmade.html` | 1 featured + 9 + 44 | title/theme, cover, month, PDF | `Publication` (HAPPENINGS) |
| Reports | `reports.html` | 1 featured + 1 card | title, cover, date, PDF (card PDF missing) | `Publication` (REPORT) |
| Award categories | `awards.html` | 6 | name, description | `AwardCategory` |
| Award recipients (featured cards) | `awards.html`, `index.html` | 6 | award, name, craft, photo | `AwardRecipient` (featured, year 2024–25) |
| Award recipients (tables) | `awards.html` (2020–2023), `past-awards.html` (2000–2019) | ≈140 rows | year, name, award & craft, state | `AwardRecipient` |
| Kamala Awards call | `awards.html#kamala-call`, home card, marquee | 1 | title, deadline, form + info links | Page `awards` section `kamalaCall` |
| Artisans | `index.html` | 7 unique (11 cards incl. loop duplicates) | name, craft, photo | `Artisan` |
| Executive Committee | `about.html` | 15 EC members + 9 office bearers | name, role | `TeamMember` |
| State Councils | `contact.html` (visible section) | 11 | name, abbreviation, logo, est., state, focus, description, address, phone, email | `StateCouncil` |
| State Councils (duplicate section) | `contact.html` (`display:none` block) | 11 cards (hidden) + "A federated structure across India" text + network map | as above, no contact | Cards not rendered (invisible in legacy). The network text and map **are visible** in browsers (unbalanced markup pushes them out of the hidden block) and were migrated into the Contact page's councils section |
| Crafts map | `craft-data.json` | 35 records → 34 states/UTs (duplicate "Chandigarh"/"CHANDIGARH" merged) | state, crafts[{craft, district, village}] | `CraftState`, `CraftLocation` |
| State images | `images/state_images/*/images.json` | 34 manifests | map image, craft images | `CraftStateImage` |
| Craft processes | `craft-processes.html` → `PROCESSES` | 16 | id, category, icon, color, title, subtitle, intro, materials[], steps[{title,text}], states[] | `CraftProcess` |
| Home hero | `index.html` | 4 slides + headline, description, 2 CTAs | | Page `home` section `heroSlider` |
| Marquee | `index.html` | 3 items (HTML with links) | | Page `home` section `marquee` |
| Quote band | `index.html` | 1 | | Page `home` section `quote` |
| Mission + pillars | `index.html` | 3 pillars | | Page `home` section `mission` |
| Kamala Craft Shop | `index.html` | text + 2 slides + 2 links | | Page `home` section `retail` |
| What we do | `what-we-do.html` | 3 blocks, 2 + 4 + 8 slides | | Page `what-we-do` sections |
| About | `about.html` | history (5 paras, portrait, quote), vision, mission | | Page `about` sections |
| Legal pages | `privacy-policy.html`, `disclaimer.html` | 2 | rich text | Page (`standard`) |
| Navigation | `nav.js` | 8 top items, 3 dropdowns, mobile variant | | `MenuItem` (menu `main`) |
| Footer | `footer.js` | 3 link columns, address, email, phone, socials | | `MenuItem` (menus `footer-*`) + `SiteSetting` |
| Contact info | `contact.html` | address, email, 2 phones, office hours | | `SiteSetting` |

## Content requiring human decisions (also in REMAINING_ISSUES.md)

1. **Craft process data contains scraping artefacts** — the last step of most processes ends with
   footer text ("Copyright © Crafts Council of India… Scroll to top") and some `materials`
   arrays contain menu labels ("Publications", "Instagram", "Privacy Policy"). Imported verbatim
   (no silent edits); flagged for editorial clean-up in the CMS.
2. **Home page duplicate cards** exist so the CSS infinite-scroll loop works; one duplicate has an
   empty artisan name and one awardee duplicate shows the craft in the name field. The new
   component renders each record twice programmatically, so the defects disappear without data loss.
3. **Award table rows with no recipient name** (e.g. "Kamala Samman 2020 – Contribution to the Craft
   Sector") — imported with an empty name, exactly as displayed.
4. **Reports card** "Craft Economics and Impact Study (April 2011)" links to `#`. `docs/report.pdf`
   exists and may be the intended file — needs confirmation.
5. **Event "status"/tag labels are static text** (e.g. "Upcoming Exhibition" on an event in the past).
   Listing pages compute upcoming/past from the date (as legacy did); stored labels kept verbatim.
6. **Kamala Awards call** says "Kamala Awards 2025" with a deadline of "30th November 2026" — kept verbatim.
