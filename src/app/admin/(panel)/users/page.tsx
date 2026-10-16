import Link from "next/link";
import { requireAnyPagePermission } from "@/lib/auth/guards";
import { hasPermission } from "@/lib/auth/permissions";
import { db } from "@/lib/db";

export const metadata = { title: "Users" };

export default async function UsersPage() {
  const user = await requireAnyPagePermission(["users.read", "users.manage"]);
  const users = await db.user.findMany({ orderBy: { name: "asc" }, include: { roles: { include: { role: true } } } });
  return (
    <>
      <div className="a-spread">
        <div>
          <h1>Users</h1>
          <p className="a-muted">People who can sign in to the CMS. There is no public sign-up.</p>
        </div>
        {hasPermission(user, "users.manage") && <Link className="a-btn" href="/admin/users/new">+ New user</Link>}
      </div>
      <table className="a-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Roles</th>
            <th>Status</th>
            <th>Last sign-in</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td><Link href={`/admin/users/${u.id}`}>{u.name}</Link></td>
              <td>{u.email}</td>
              <td>{u.roles.map((r) => r.role.name).join(", ")}</td>
              <td>
                <span className={`a-badge ${u.isActive ? "yes" : "no"}`}>{u.isActive ? "Active" : "Deactivated"}</span>
                {u.mustChangePassword && <span className="a-badge IN_REVIEW" style={{ marginLeft: 4 }}>Temp password</span>}
              </td>
              <td className="a-small">{u.lastLoginAt?.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) ?? "Never"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
