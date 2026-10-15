import { permissionFor, resourceByKey } from "./resources";

export interface NavItem {
  href: string;
  label: string;
  /** Any one of these permissions shows the link. */
  anyOf: string[];
}

const res = (key: string, label?: string): NavItem => {
  const def = resourceByKey(key)!;
  return { href: `/admin/content/${key}`, label: label ?? def.label, anyOf: [permissionFor(def, "read")] };
};

export const ADMIN_NAV: { group: string; items: NavItem[] }[] = [
  { group: "", items: [{ href: "/admin", label: "Dashboard", anyOf: ["*any"] }] },
  { group: "Content", items: [res("pages"), res("events"), res("news"), res("press"), res("publications")] },
  {
    group: "Organisation",
    items: [res("awards"), res("award-categories"), res("artisans"), res("team"), res("councils"), res("craft-states"), res("processes")],
  },
  {
    group: "Site",
    items: [
      { href: "/admin/media", label: "Media library", anyOf: ["media.read"] },
      res("menu-items"),
      { href: "/admin/settings", label: "Settings", anyOf: ["settings.read", "settings.manage"] },
      res("redirects"),
      { href: "/admin/submissions", label: "Form submissions", anyOf: ["submissions.read"] },
    ],
  },
  {
    group: "Administration",
    items: [
      { href: "/admin/users", label: "Users", anyOf: ["users.read", "users.manage"] },
      { href: "/admin/roles", label: "Roles & permissions", anyOf: ["roles.manage"] },
      { href: "/admin/audit", label: "Audit log", anyOf: ["audit.read"] },
    ],
  },
  { group: "", items: [{ href: "/admin/account", label: "My account", anyOf: ["*any"] }] },
];
