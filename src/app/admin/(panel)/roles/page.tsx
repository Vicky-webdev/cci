import Link from "next/link";
import { requirePagePermission } from "@/lib/auth/guards";
import { db } from "@/lib/db";

export const metadata = { title: "Roles & permissions" };

export default async function RolesPage() {
  await requirePagePermission("roles.manage");
  const roles = await db.role.findMany({ orderBy: { name: "asc" }, include: { _count: { select: { users: true } } } });
  return (
    <>
      <div className="a-spread">
        <div>
          <h1>Roles &amp; permissions</h1>
          <p className="a-muted">Permissions are enforced on the server for every page and action. See docs/security/RBAC_PERMISSION_MATRIX.md.</p>
        </div>
        <Link href="/admin/roles/new" className="a-btn">+ New role</Link>
      </div>
      <table className="a-table">
        <thead>
          <tr>
            <th>Role</th>
            <th>Description</th>
            <th>Permissions</th>
            <th>Users</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((r) => (
            <tr key={r.id}>
              <td><Link href={`/admin/roles/${r.id}`}>{r.name}</Link> {r.isSystem && <span className="a-badge">built-in</span>}</td>
              <td className="a-small">{r.description}</td>
              <td>{r.permissions.includes("*") ? "All" : r.permissions.length}</td>
              <td>{r._count.users}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
