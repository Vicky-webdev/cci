/**
 * Central permission catalogue. Every protected server operation checks one of these
 * strings via `can()` / `requirePermission()`. Roles are stored in the database and
 * hold a list of these strings; "*" grants everything (Super Admin only).
 *
 * Naming: <resource>.<action>. The ".own" suffix limits update/delete to records the
 * user created (used by the Author role).
 */

export const CONTENT_RESOURCES = ["pages", "events", "news", "press", "publications"] as const;
export const SIMPLE_RESOURCES = ["awards", "people", "councils", "crafts", "processes"] as const;

export type ContentResource = (typeof CONTENT_RESOURCES)[number];
export type SimpleResource = (typeof SIMPLE_RESOURCES)[number];

const contentPerms = (r: ContentResource) =>
  [
    `${r}.read`,
    `${r}.create`,
    `${r}.update`,
    `${r}.update.own`,
    `${r}.publish`,
    `${r}.delete`,
    `${r}.delete.own`,
  ] as const;

const simplePerms = (r: SimpleResource) => [`${r}.read`, `${r}.manage`] as const;

export const PERMISSIONS = [
  ...CONTENT_RESOURCES.flatMap(contentPerms),
  ...SIMPLE_RESOURCES.flatMap(simplePerms),
  "content.review", // move IN_REVIEW → PUBLISHED/back to DRAFT on others' content
  "media.read",
  "media.upload",
  "media.update",
  "media.delete",
  "navigation.manage",
  "settings.read",
  "settings.manage",
  "redirects.manage",
  "submissions.read",
  "submissions.update",
  "submissions.export",
  "submissions.delete",
  "users.read",
  "users.manage",
  "roles.manage",
  "audit.read",
  "content.export",
  "content.import",
] as const;

export type Permission = (typeof PERMISSIONS)[number];

export const PERMISSION_GROUPS: { label: string; permissions: readonly string[] }[] = [
  ...CONTENT_RESOURCES.map((r) => ({ label: r[0].toUpperCase() + r.slice(1), permissions: contentPerms(r) })),
  ...SIMPLE_RESOURCES.map((r) => ({ label: r[0].toUpperCase() + r.slice(1), permissions: simplePerms(r) })),
  { label: "Workflow", permissions: ["content.review", "content.export", "content.import"] },
  { label: "Media", permissions: ["media.read", "media.upload", "media.update", "media.delete"] },
  { label: "Site", permissions: ["navigation.manage", "settings.read", "settings.manage", "redirects.manage"] },
  {
    label: "Form submissions",
    permissions: ["submissions.read", "submissions.update", "submissions.export", "submissions.delete"],
  },
  { label: "Administration", permissions: ["users.read", "users.manage", "roles.manage", "audit.read"] },
];

const all = (prefixes: readonly string[], actions: readonly string[]) =>
  prefixes.flatMap((p) => actions.map((a) => `${p}.${a}`));

/** Default system roles. Seeded once; editable afterwards except Super Admin. */
export const SYSTEM_ROLES: { key: string; name: string; description: string; permissions: string[] }[] = [
  {
    key: "super_admin",
    name: "Super Admin",
    description: "Full system administration, including roles and users.",
    permissions: ["*"],
  },
  {
    key: "administrator",
    name: "Administrator",
    description: "Manages all site content, media and site settings. Cannot edit roles.",
    permissions: [
      ...all(CONTENT_RESOURCES, ["read", "create", "update", "publish", "delete"]),
      ...all(SIMPLE_RESOURCES, ["read", "manage"]),
      "content.review",
      "content.export",
      "content.import",
      "media.read",
      "media.upload",
      "media.update",
      "media.delete",
      "navigation.manage",
      "settings.read",
      "settings.manage",
      "redirects.manage",
      "submissions.read",
      "submissions.update",
      "submissions.export",
      "submissions.delete",
      "users.read",
      "audit.read",
    ],
  },
  {
    key: "editor",
    name: "Editor",
    description: "Creates, edits and publishes content written by anyone.",
    permissions: [
      ...all(CONTENT_RESOURCES, ["read", "create", "update", "publish"]),
      ...all(SIMPLE_RESOURCES, ["read", "manage"]),
      "content.review",
      "media.read",
      "media.upload",
      "media.update",
    ],
  },
  {
    key: "author",
    name: "Author",
    description: "Creates content and edits own drafts; submits for review, cannot publish.",
    permissions: [
      ...all(CONTENT_RESOURCES, ["read", "create", "update.own", "delete.own"]),
      "media.read",
      "media.upload",
    ],
  },
  {
    key: "reviewer",
    name: "Reviewer",
    description: "Reviews submitted content and approves or returns it.",
    permissions: [...all(CONTENT_RESOURCES, ["read", "publish"]), "content.review", "media.read"],
  },
  {
    key: "media_manager",
    name: "Media Manager",
    description: "Uploads, edits and deletes media library files.",
    permissions: ["media.read", "media.upload", "media.update", "media.delete"],
  },
  {
    key: "analyst",
    name: "Analyst",
    description: "Read-only access to content, submissions and the audit log.",
    permissions: [
      ...all(CONTENT_RESOURCES, ["read"]),
      ...all(SIMPLE_RESOURCES, ["read"]),
      "media.read",
      "settings.read",
      "submissions.read",
      "audit.read",
    ],
  },
];

export interface PermissionSubject {
  id: string;
  permissions: ReadonlySet<string>;
}

/** Deny-by-default permission check. */
export function hasPermission(subject: PermissionSubject | null | undefined, permission: string): boolean {
  if (!subject) return false;
  return subject.permissions.has("*") || subject.permissions.has(permission);
}

/**
 * Ownership-aware check for update/delete on content: full permission, or the ".own"
 * variant when the record was created by the subject.
 */
export function canModify(
  subject: PermissionSubject | null | undefined,
  resource: ContentResource,
  action: "update" | "delete",
  record: { createdById: string | null },
): boolean {
  if (!subject) return false;
  if (hasPermission(subject, `${resource}.${action}`)) return true;
  return hasPermission(subject, `${resource}.${action}.own`) && record.createdById === subject.id;
}

export function isKnownPermission(p: string): boolean {
  return p === "*" || (PERMISSIONS as readonly string[]).includes(p);
}
