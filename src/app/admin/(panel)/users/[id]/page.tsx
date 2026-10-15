import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAnyPagePermission } from "@/lib/auth/guards";
import { hasPermission } from "@/lib/auth/permissions";
import { db } from "@/lib/db";
import { UserForm } from "../UserForm";

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const actor = await requireAnyPagePermission(["users.read", "users.manage"]);
  const { id } = await params;
  const [u, roles] = await Promise.all([
    db.user.findUnique({ where: { id }, include: { roles: true } }),
    db.role.findMany({ orderBy: { name: "asc" } }),
  ]);
  if (!u) notFound();
  const activity = hasPermission(actor, "audit.read") ? await db.auditLog.findMany({ where: { actorId: id }, orderBy: { createdAt: "desc" }, take: 15 }) : [];
  return (
    <>
      <p className="a-small"><Link href="/admin/users">← Users</Link></p>
      <h1 style={{ marginBottom: 14 }}>{u.name}</h1>
      <UserForm
        user={{ id: u.id, name: u.name, email: u.email, isActive: u.isActive, roleIds: u.roles.map((r) => r.roleId) }}
        roles={roles.map((r) => ({ id: r.id, name: r.name, description: r.description }))}
        canManage={hasPermission(actor, "users.manage")}
      />
      {activity.length > 0 && (
        <div className="a-card" style={{ marginTop: 18 }}>
          <h2>Recent activity</h2>
          <ul>
            {activity.map((a) => (
              <li key={a.id} className="a-small">{a.createdAt.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} — {a.summary || a.action}</li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
