import Link from "next/link";
import { notFound } from "next/navigation";
import { requirePagePermission } from "@/lib/auth/guards";
import { db } from "@/lib/db";
import { RoleForm } from "../RoleForm";

export default async function EditRolePage({ params }: { params: Promise<{ id: string }> }) {
  await requirePagePermission("roles.manage");
  const role = await db.role.findUnique({ where: { id: (await params).id } });
  if (!role) notFound();
  return (
    <>
      <p className="a-small"><Link href="/admin/roles">← Roles</Link></p>
      <h1 style={{ marginBottom: 14 }}>{role.name}</h1>
      <RoleForm role={{ id: role.id, key: role.key, name: role.name, description: role.description, permissions: role.permissions, isSystem: role.isSystem, locked: role.permissions.includes("*") }} />
    </>
  );
}
