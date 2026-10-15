import Link from "next/link";
import { requirePagePermission } from "@/lib/auth/guards";
import { RoleForm } from "../RoleForm";

export default async function NewRolePage() {
  await requirePagePermission("roles.manage");
  return (
    <>
      <p className="a-small"><Link href="/admin/roles">← Roles</Link></p>
      <h1 style={{ marginBottom: 14 }}>New role</h1>
      <RoleForm role={null} />
    </>
  );
}
