import Link from "next/link";
import { requirePagePermission } from "@/lib/auth/guards";
import { db } from "@/lib/db";
import { UserForm } from "../UserForm";

export const metadata = { title: "New user" };

export default async function NewUserPage() {
  await requirePagePermission("users.manage");
  const roles = await db.role.findMany({ orderBy: { name: "asc" } });
  return (
    <>
      <p className="a-small"><Link href="/admin/users">← Users</Link></p>
      <h1 style={{ marginBottom: 14 }}>New user</h1>
      <UserForm user={null} roles={roles.map((r) => ({ id: r.id, name: r.name, description: r.description }))} canManage />
    </>
  );
}
