/** Regenerates docs/security/RBAC_PERMISSION_MATRIX.md from src/lib/auth/permissions.ts. */
import fs from "node:fs";
import { PERMISSION_GROUPS, SYSTEM_ROLES } from "../../src/lib/auth/permissions";

const roles = SYSTEM_ROLES;
const has = (perms: string[], p: string) => perms.includes("*") || perms.includes(p);
let md = `# RBAC Permission Matrix

Generated from \`src/lib/auth/permissions.ts\` by \`npx tsx scripts/docs/rbac-matrix.ts\` — do not edit by hand.
These are the **default** permissions of the seeded system roles. Super Admins can edit roles (except
Super Admin itself) in **Admin → Roles & permissions**; the database is then the source of truth.

Enforcement: every admin page calls \`requirePagePermission\`/\`requireAnyPagePermission\`, every Server
Action and Route Handler calls \`requirePermission\` (or the resource-action helpers), all on the server.
Hiding a button is never the only control. Unknown or missing permissions are denied.

* \`.own\` — only records the user created (\`createdById\`).
* Publishing, scheduling, archiving, and changing anything already published need \`<resource>.publish\`.
* Only users holding \`*\` can grant roles containing \`*\`, \`roles.manage\` or \`users.manage\`.

## Roles

| Role | Key | Purpose |
|---|---|---|
${roles.map((r) => `| ${r.name} | \`${r.key}\` | ${r.description} |`).join("\n")}

## Matrix

| Permission | ${roles.map((r) => r.name).join(" | ")} |
|---|${roles.map(() => ":-:").join("|")}|
`;
for (const g of PERMISSION_GROUPS) {
  md += `| **${g.label}** |${roles.map(() => " ").join("|")}|\n`;
  for (const p of g.permissions) md += `| \`${p}\` | ${roles.map((r) => (has(r.permissions, p) ? "✔" : "—")).join(" | ")} |\n`;
}
fs.writeFileSync("docs/security/RBAC_PERMISSION_MATRIX.md", md);
console.log("written");
