# Roles and Permissions

The full matrix of default permissions is generated from code: [`security/RBAC_PERMISSION_MATRIX.md`](security/RBAC_PERMISSION_MATRIX.md).

| Role | Typical person | Can | Cannot |
|---|---|---|---|
| **Super Admin** | IT owner (1–2 people) | Everything, incl. users and roles | — |
| **Administrator** | Communications lead | All content (create/edit/publish/delete), media, navigation, settings, redirects, enquiries, view users and audit log | Create users or change roles |
| **Editor** | Website editor | Create, edit and publish all content; manage awards/people/councils/crafts; upload media | Delete content, settings, users, enquiries |
| **Author** | Volunteer / contributor | Create content and edit **their own** drafts; submit for review; upload media | Publish; edit others' work |
| **Reviewer** | Approver | Read all content, approve & publish or return to draft | Edit content |
| **Media Manager** | Photographer / designer | Upload, describe and delete media (unused uploads only) | Content, settings |
| **Analyst** | Board member / auditor | Read content, settings, enquiries, audit log | Change anything; export enquiries |

## Rules

* Permissions are checked on the server for every page, action and API — hiding a button is never the only protection.
* Anything not explicitly granted is denied.
* Publishing, scheduling, archiving or changing already-published content requires the *publish* permission.
* Authors' "own" rights apply to records they created.
* Only Super Admins can create users, change roles, or grant roles that include user/role management.
* The last active Super Admin cannot be demoted or deactivated.
* Changes to roles take effect on the user's next request; deactivation signs the user out immediately.

## Custom roles

**Roles & permissions → + New role** (Super Admin). Tick the permissions needed; built-in roles can be edited
(except Super Admin) but not deleted. Prefer the least privilege that lets the person do their job.
