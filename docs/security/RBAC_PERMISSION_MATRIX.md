# RBAC Permission Matrix

Generated from `src/lib/auth/permissions.ts` by `npx tsx scripts/docs/rbac-matrix.ts` — do not edit by hand.
These are the **default** permissions of the seeded system roles. Super Admins can edit roles (except
Super Admin itself) in **Admin → Roles & permissions**; the database is then the source of truth.

Enforcement: every admin page calls `requirePagePermission`/`requireAnyPagePermission`, every Server
Action and Route Handler calls `requirePermission` (or the resource-action helpers), all on the server.
Hiding a button is never the only control. Unknown or missing permissions are denied.

* `.own` — only records the user created (`createdById`).
* Publishing, scheduling, archiving, and changing anything already published need `<resource>.publish`.
* Only users holding `*` can grant roles containing `*`, `roles.manage` or `users.manage`.

## Roles

| Role | Key | Purpose |
|---|---|---|
| Super Admin | `super_admin` | Full system administration, including roles and users. |
| Administrator | `administrator` | Manages all site content, media and site settings. Cannot edit roles. |
| Editor | `editor` | Creates, edits and publishes content written by anyone. |
| Author | `author` | Creates content and edits own drafts; submits for review, cannot publish. |
| Reviewer | `reviewer` | Reviews submitted content and approves or returns it. |
| Media Manager | `media_manager` | Uploads, edits and deletes media library files. |
| Analyst | `analyst` | Read-only access to content, submissions and the audit log. |

## Matrix

| Permission | Super Admin | Administrator | Editor | Author | Reviewer | Media Manager | Analyst |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| **Pages** | | | | | | | |
| `pages.read` | ✔ | ✔ | ✔ | ✔ | ✔ | — | ✔ |
| `pages.create` | ✔ | ✔ | ✔ | ✔ | — | — | — |
| `pages.update` | ✔ | ✔ | ✔ | — | — | — | — |
| `pages.update.own` | ✔ | — | — | ✔ | — | — | — |
| `pages.publish` | ✔ | ✔ | ✔ | — | ✔ | — | — |
| `pages.delete` | ✔ | ✔ | — | — | — | — | — |
| `pages.delete.own` | ✔ | — | — | ✔ | — | — | — |
| **Events** | | | | | | | |
| `events.read` | ✔ | ✔ | ✔ | ✔ | ✔ | — | ✔ |
| `events.create` | ✔ | ✔ | ✔ | ✔ | — | — | — |
| `events.update` | ✔ | ✔ | ✔ | — | — | — | — |
| `events.update.own` | ✔ | — | — | ✔ | — | — | — |
| `events.publish` | ✔ | ✔ | ✔ | — | ✔ | — | — |
| `events.delete` | ✔ | ✔ | — | — | — | — | — |
| `events.delete.own` | ✔ | — | — | ✔ | — | — | — |
| **News** | | | | | | | |
| `news.read` | ✔ | ✔ | ✔ | ✔ | ✔ | — | ✔ |
| `news.create` | ✔ | ✔ | ✔ | ✔ | — | — | — |
| `news.update` | ✔ | ✔ | ✔ | — | — | — | — |
| `news.update.own` | ✔ | — | — | ✔ | — | — | — |
| `news.publish` | ✔ | ✔ | ✔ | — | ✔ | — | — |
| `news.delete` | ✔ | ✔ | — | — | — | — | — |
| `news.delete.own` | ✔ | — | — | ✔ | — | — | — |
| **Press** | | | | | | | |
| `press.read` | ✔ | ✔ | ✔ | ✔ | ✔ | — | ✔ |
| `press.create` | ✔ | ✔ | ✔ | ✔ | — | — | — |
| `press.update` | ✔ | ✔ | ✔ | — | — | — | — |
| `press.update.own` | ✔ | — | — | ✔ | — | — | — |
| `press.publish` | ✔ | ✔ | ✔ | — | ✔ | — | — |
| `press.delete` | ✔ | ✔ | — | — | — | — | — |
| `press.delete.own` | ✔ | — | — | ✔ | — | — | — |
| **Publications** | | | | | | | |
| `publications.read` | ✔ | ✔ | ✔ | ✔ | ✔ | — | ✔ |
| `publications.create` | ✔ | ✔ | ✔ | ✔ | — | — | — |
| `publications.update` | ✔ | ✔ | ✔ | — | — | — | — |
| `publications.update.own` | ✔ | — | — | ✔ | — | — | — |
| `publications.publish` | ✔ | ✔ | ✔ | — | ✔ | — | — |
| `publications.delete` | ✔ | ✔ | — | — | — | — | — |
| `publications.delete.own` | ✔ | — | — | ✔ | — | — | — |
| **Awards** | | | | | | | |
| `awards.read` | ✔ | ✔ | ✔ | — | — | — | ✔ |
| `awards.manage` | ✔ | ✔ | ✔ | — | — | — | — |
| **People** | | | | | | | |
| `people.read` | ✔ | ✔ | ✔ | — | — | — | ✔ |
| `people.manage` | ✔ | ✔ | ✔ | — | — | — | — |
| **Councils** | | | | | | | |
| `councils.read` | ✔ | ✔ | ✔ | — | — | — | ✔ |
| `councils.manage` | ✔ | ✔ | ✔ | — | — | — | — |
| **Crafts** | | | | | | | |
| `crafts.read` | ✔ | ✔ | ✔ | — | — | — | ✔ |
| `crafts.manage` | ✔ | ✔ | ✔ | — | — | — | — |
| **Processes** | | | | | | | |
| `processes.read` | ✔ | ✔ | ✔ | — | — | — | ✔ |
| `processes.manage` | ✔ | ✔ | ✔ | — | — | — | — |
| **Workflow** | | | | | | | |
| `content.review` | ✔ | ✔ | ✔ | — | ✔ | — | — |
| `content.export` | ✔ | ✔ | — | — | — | — | — |
| `content.import` | ✔ | ✔ | — | — | — | — | — |
| **Media** | | | | | | | |
| `media.read` | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |
| `media.upload` | ✔ | ✔ | ✔ | ✔ | — | ✔ | — |
| `media.update` | ✔ | ✔ | ✔ | — | — | ✔ | — |
| `media.delete` | ✔ | ✔ | — | — | — | ✔ | — |
| **Site** | | | | | | | |
| `navigation.manage` | ✔ | ✔ | — | — | — | — | — |
| `settings.read` | ✔ | ✔ | — | — | — | — | ✔ |
| `settings.manage` | ✔ | ✔ | — | — | — | — | — |
| `redirects.manage` | ✔ | ✔ | — | — | — | — | — |
| **Form submissions** | | | | | | | |
| `submissions.read` | ✔ | ✔ | — | — | — | — | ✔ |
| `submissions.update` | ✔ | ✔ | — | — | — | — | — |
| `submissions.export` | ✔ | ✔ | — | — | — | — | — |
| `submissions.delete` | ✔ | ✔ | — | — | — | — | — |
| **Administration** | | | | | | | |
| `users.read` | ✔ | ✔ | — | — | — | — | — |
| `users.manage` | ✔ | — | — | — | — | — | — |
| `roles.manage` | ✔ | — | — | — | — | — | — |
| `audit.read` | ✔ | ✔ | — | — | — | — | ✔ |
