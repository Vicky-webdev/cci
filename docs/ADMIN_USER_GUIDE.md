# Admin User Guide

For Crafts Council of India staff who update the website. No technical knowledge needed.

## Signing in

1. Go to `https://www.craftscouncilofindia.in/admin`.
2. Enter the email and password your administrator gave you. The first time, you will be asked to choose a
   new password (at least 12 characters, mixing lowercase, uppercase, digits or symbols).
3. After 5 wrong passwords the account is locked for 15 minutes. Ask a Super Admin if you are locked out
   or forgot your password — they can issue a temporary one.
4. Use **Sign out** on shared computers. **My account → Sign out all other sessions** ends sessions on other devices.

What you see in the left menu depends on your role (see `ROLES_AND_PERMISSIONS.md`).

## Adding an event

1. **Events → + New event**.
2. Fill **Title**. The **Slug** (web address) is filled in from the title automatically; you can change it
   (lowercase words with hyphens, e.g. `kantha-workshop-2027` → `/events/kantha-workshop-2027`). Avoid
   changing the slug after publishing — old links would break (add a redirect if you must).
3. **Shown on**: "Events page" for current events, "Past events archive" for old ones.
4. **Type**: `exhibition` or `workshop` make the event appear under those filters; other values (`event`, `award`, …) are fine.
5. **Dates as displayed**: type exactly what visitors should read, e.g. `9, 10 & 12 October 2026`.
   The start/end dates are worked out automatically; set them by hand only if the guess is wrong.
   Events whose start date is today or later count as *upcoming* (home page + "Upcoming" filter).
6. Choose a **Hero / card image** with **Choose…** (search the library or upload).
7. Write **About this event** in the editor (bold, italic, links, headings, lists). Use **HTML** only if you know HTML.
8. Optional: highlights, schedule, people, gallery (images or MP4 videos), PDF, registration link.
9. **Save & publish** (or **Create** to keep a draft, **Submit for review** if you are an Author).

## Editing pages

**Pages** lists every page. Open one and use **Edit** on a section to change its text or images. You can
move sections **↑/↓**, **Hide** them temporarily, **Remove** them, or **+ Add section**. **Preview** shows the
page as visitors would see it, even before publishing.

Examples: the scrolling announcements and hero slides are on the **Home** page; the "Call for applications"
deadline is on **Kamala Awards**; office hours and phone numbers are in **Settings → Contact details**.

## Publishing workflow

| Status | Visible on site? |
|---|---|
| Draft | No |
| In review | No — appears on reviewers' dashboard |
| Scheduled | From the "Publish at" time |
| Published | Yes |
| Archived | No (kept for reference) |

Reviewers open items from the dashboard and press **Approve & publish** or **Return to draft**.

## History and undo

Every save keeps a copy. On any record, the **History** panel lists versions; **Restore this version** puts an
older version back (the current one is kept too). Deleted records also leave a copy in history (ask an
administrator to recover).

## Publications (newsletters, Happenings in Handmade, books, reports)

**Publications → + New publication**: choose the type, title, cover image and PDF. Tick **Featured** for the
big "Latest issue" block (untick it on the previous one). Tick **Show on the past/archive page** to move an
issue to the archive page; set **Archive group heading** (e.g. `2026`) for year sections.

## Awards

**Award recipients**: featured recipients (with photos) appear as cards on the Awards page and in the home page
scroller. Others appear in the year tables of the Awards or Past awards page. **Award categories** holds the six category descriptions.

## Media library

See `MEDIA_LIBRARY_GUIDE.md`. Always add **alt text** describing images for visually impaired visitors.

## Navigation and settings

**Navigation**: menu links. Internal links start with `/` (e.g. `/about#team`). To put a link in a
dropdown, copy the parent item's id (shown in its URL) into **Parent item id**.
**Settings**: logo, contact details, social links, Instagram feed, analytics, search-engine defaults, contact form email.

## Enquiries

**Form submissions** lists messages from the contact form (newest first). Opening one marks it as read; you
can archive, mark as spam or export to CSV (Excel). Messages are kept even if the email notification failed —
the "Email" column shows whether the notification was sent.

## Users (Super Admin)

**Users → + New user**: name, email, roles. A one-time temporary password is shown — share it securely; the
person must change it at first sign-in. Deactivate accounts of people who leave (this signs them out immediately).
