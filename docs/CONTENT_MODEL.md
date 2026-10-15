# Content Model

How each part of the website is stored and where it is edited in the CMS.

## Pages and sections

Every public page has a `Page` record (slug = URL; `home` = `/`). Its body is an ordered list of
**sections**. Editors can add, reorder, hide or remove sections; each type has its own form.

| Section | Used on | Data source |
|---|---|---|
| Page hero | inner pages | its own fields (title, subtitle, gold style, watermark) |
| Home hero with slider | Home | own fields + slides (images) |
| Scrolling announcement strip | Home | items (links allowed) |
| Quote band | Home | own fields |
| Mission pillars + feature card | Home | own fields |
| Artisans scroller | Home | **Artisans** records |
| Shop feature with slider | Home | own fields + slides |
| Upcoming events grid | Home | **Events** (next N with start date ≥ today) |
| Awardees scroller | Home | featured **Award recipients** |
| History with portrait / Vision & mission / Team lists | About | own fields; team from **Team** records |
| Sticky anchor bar / Text + image slider block | What we do | own fields |
| Awards call / Award categories / Featured awardee cards / Award tables | Awards, Past awards | own fields + **Award categories** + **Award recipients** |
| Contact form + details / State councils grid | Contact | **Settings** (address, phones, hours) + **State councils** |
| Publications listing | Books, Newsletters, HiH, Reports (+ past pages) | **Publications** filtered by type and "archive page" flag |
| Listing labels | Events, Past events, News, Press, Crafts map, Craft processes | intro/empty-state/footer labels; the lists come from their records |
| Rich text | Privacy policy, Terms; any new page | formatted text |

Listing routes (`/events`, `/news`, `/press`, `/crafts-map`, `/craft-processes`, detail pages) are fixed in code;
their page records supply the hero and labels. Any **new** page created in the CMS is served at `/<slug>`.

## Records

| Type | Public URL | Notes |
|---|---|---|
| Event | `/events/<slug>`; listed on `/events` (collection "Events page") or `/past-events` ("Past events archive") | "Dates as displayed" is free text; start/end dates are parsed from it automatically when left empty and decide upcoming vs past and ordering. "Sidebar card" chooses the registration or "event has ended" box |
| News article | `/news/<slug>` | Body may contain YouTube embeds; gallery items are images or YouTube links |
| Press coverage | `/press/<slug>` | Groups per outlet; clippings can be images (lightbox) or PDFs (tile) |
| Publication | on its type's page | "Featured" = the large "latest issue" block; "archive page" moves it to the past page; group heading for year sections |
| Award recipient | Awards / Past awards / Home | "Featured" = photo card + home scroller; otherwise a row in the yearly table of the chosen page |
| Artisan, Team member, State council, Award category | via sections | visible flag + sort order |
| Crafts map state | `/crafts-map` | Map id must match the SVG (`kl`, `tn`, …); crafts per district; state map image |
| Craft process | `/craft-processes` | Steps, materials, states |

## Global content (Settings / Navigation)

Logo, favicon, header button, footer column titles and copyright, contact details, social links, Instagram
feed, analytics ID, SEO defaults, contact-form recipient/subject/success message → **Settings**.
Main navigation and the four footer menus → **Navigation** (dropdowns via "parent item id").

## Workflow

Draft → In review → Published (or Scheduled with a publish time) → Archived. Authors can only save drafts or
submit for review; Editors/Reviewers/Administrators publish. Every save and status change creates a revision.
