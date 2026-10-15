"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { audit } from "@/lib/audit";
import { AuthorizationError, requirePermission } from "@/lib/auth/guards";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { requestMeta } from "@/lib/request";

type Result = { ok: true; message: string; id?: string } | { ok: false; error: string };

const schema = z.object({
  name: z.string().trim().min(2).max(80),
  key: z.string().trim().regex(/^[a-z][a-z0-9_]{1,40}$/, "Use lowercase letters, digits and underscores"),
  description: z.string().max(300).default(""),
  // "*" can never be granted from the UI: full access is reserved for the seeded Super Admin role.
  permissions: z.array(z.enum(PERMISSIONS as unknown as [string, ...string[]])).max(200),
});

export async function saveRoleAction(id: string | null, input: unknown): Promise<Result> {
  try {
    const actor = await requirePermission("roles.manage");
    const data = schema.parse(input);
    if (id) {
      const role = await db.role.findUnique({ where: { id } });
      if (!role) return { ok: false, error: "Role not found." };
      if (role.permissions.includes("*")) return { ok: false, error: "The Super Admin role always has full access and cannot be edited." };
      const added = data.permissions.filter((p) => !role.permissions.includes(p));
      const removed = role.permissions.filter((p) => !data.permissions.includes(p));
      await db.role.update({ where: { id }, data: { name: data.name, description: data.description, permissions: data.permissions } });
      await audit({
        actorId: actor.id,
        action: "roles.permissions.change",
        entityType: "roles",
        entityId: id,
        summary: `Updated role ${role.key}: +[${added.join(", ")}] -[${removed.join(", ")}]`,
        metadata: { added, removed },
        ip: (await requestMeta()).ip,
      });
      revalidatePath("/admin/roles");
      return { ok: true, message: "Saved. Changes apply on the users' next request." };
    }
    if (await db.role.findUnique({ where: { key: data.key } })) return { ok: false, error: "A role with this key exists." };
    const role = await db.role.create({ data: { ...data, isSystem: false } });
    await audit({ actorId: actor.id, action: "roles.create", entityType: "roles", entityId: role.id, summary: `Created role ${role.key}`, ip: (await requestMeta()).ip });
    return { ok: true, message: "Role created.", id: role.id };
  } catch (e) {
    return { ok: false, error: e instanceof AuthorizationError ? e.message : e instanceof z.ZodError ? e.issues[0].message : "Could not save the role." };
  }
}

export async function deleteRoleAction(id: string): Promise<Result> {
  try {
    const actor = await requirePermission("roles.manage");
    const role = await db.role.findUnique({ where: { id }, include: { _count: { select: { users: true } } } });
    if (!role) return { ok: false, error: "Role not found." };
    if (role.isSystem) return { ok: false, error: "Built-in roles cannot be deleted." };
    if (role._count.users) return { ok: false, error: `Remove this role from its ${role._count.users} user(s) first.` };
    await db.role.delete({ where: { id } });
    await audit({ actorId: actor.id, action: "roles.delete", entityType: "roles", entityId: id, summary: `Deleted role ${role.key}`, ip: (await requestMeta()).ip });
    return { ok: true, message: "Deleted." };
  } catch (e) {
    return { ok: false, error: e instanceof AuthorizationError ? e.message : "Could not delete the role." };
  }
}
