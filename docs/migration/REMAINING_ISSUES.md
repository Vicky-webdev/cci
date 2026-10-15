# Remaining Issues

Open items after the migration, grouped by who needs to act. Nothing here blocks running the site in a
staging environment.

## Decisions needed from the organisation

| # | Item | Options / recommendation |
|---|---|---|
| D1 | **Hosting** (ADR-002): the legacy shared PHP host cannot run Node.js + PostgreSQL | VPS with Nginx (recommended) or PaaS with a persistent volume — see `DEPLOYMENT.md` |
| D2 | **URL scheme** (ADR-004): clean URLs with 308 redirects were chosen | Keep (recommended) or revert to `.html` paths |
| D3 | Reports page card "Craft Economics and Impact Study (April 2011)" linked to `#` | `docs/report.pdf` exists — confirm it is this report, then set it as the card's PDF in the CMS |
| D4 | Homepage "Meet all artisans" button had no action | Button is hidden until a link is set (Home page → Artisans section) — choose a destination or leave hidden |
| D5 | Archive menu "History gallery" links to `#` | Provide content or remove the menu item (Navigation) |
| D6 | Event fields entered but never shown by the legacy site: `shopTiming`, `pricing`, `map`, `payments`, `specialEvent` (Gandhigram talk), `invitePDF` (Textiles 2026 invitation) | Stored in `Event.extra`. Decide whether to display them (small code change) |
| D7 | Placeholder registration links in legacy data (`forms.google.com/thari-2025` is in commented-out code; none live) | No action unless re-enabled |
| D8 | 965 unreferenced legacy files (≈298 MB, e.g. `images/events/2025-events/New folder`, `state_images/*/thumbs`, un-slugged press folders) | Kept. Review `ASSET_MANIFEST.csv` and delete from the repository only after approval |
| D9 | Duplicate page titles inherited from legacy (Awards/Past awards, HiH/Past HiH) | Edit meta titles in the CMS for better SEO |
| D10 | Licence of the India SVG map ("Generated from amCharts geodata") | Confirm amCharts licence/attribution requirements |
| D11 | Kamala Awards call says "Kamala Awards 2025" with deadline "30th November 2026" | Confirm wording (kept verbatim) |

## Content clean-up for editors (data imported verbatim)

* 16 craft processes contain scraped footer text in their last step ("Copyright © … Scroll to top"); 2 have
  menu labels in "Materials" — edit in **Craft processes**.
* Award table rows without a recipient name ("Kamala Samman 2019/2020 – Contribution to the Craft Sector").
* Alt text missing for most legacy images (legacy had none) — add in the Media library, starting with home/awards.
* Telangana has crafts data but no state map image (no `images.json` folder in legacy).

## Technical follow-ups

| # | Item | Notes |
|---|---|---|
| T1 | Object-storage upload driver (S3-compatible) | Needed only for multi-instance/serverless hosting (ADR-008) |
| T2 | Nonce-based CSP to drop `'unsafe-inline'` | Hardening |
| T3 | MFA for Super Admins | Hardening |
| T4 | Colour contrast of the legacy brand palette | axe (2026-10-15) reports text below WCAG AA contrast, e.g. home eyebrow 3.3:1, quote attribution 1.9:1, Kamala card organisation line 1.8:1, council fact labels 4.3:1. Palette kept for visual parity — designer decision |
| T5 | Cross-browser (Safari/Firefox) manual check | Only Chromium available in CI here |
| T6 | `/event/<slug>/` legacy WordPress URLs redirect in two hops (trailing-slash, then path) | Acceptable for SEO; could be one hop with `skipTrailingSlashRedirect` |
| T7 | Rich-text editor uses `contentEditable` + `execCommand` | Works in current browsers; a richer editor (e.g. TipTap) could replace it later |
| T8 | Craft gallery in the crafts-map sidebar was hidden (`display:none`) in legacy | Data imported (`CraftStateImage`), not displayed — same as legacy |
| T9 | Hidden duplicate "Affiliated State Councils" block on legacy contact page | Not rendered (was invisible); visible network text/map *was* migrated |
| T10 | Live-site crawl not performed (no access) | Do before cut-over: diff live files vs `_public_html/` (e.g. server-only `secrets.php`, uploads added via FTP) |
