"use server";

import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { audit } from "@/lib/audit";
import { AuthorizationError, requirePermission } from "@/lib/auth/guards";
import { hashPassword } from "@/lib/auth/password";
import { hasPermission } from "@/lib/auth/permissions";
import { revokeUserSessions, type SessionUser } from "@/lib/auth/session";
import { requestMeta } from "@/lib/request";

type Result = { ok: true; message: string; tempPassword?: string; id?: string } | { ok: false; error: string };

/** Readable temporary password, shown once to the administrator. */
function tempPassword() {
  return `${randomBytes(9).toString("base64url")}-Aa1!`;
}

async function assertRolesAssignable(actor: SessionUser, roleIds: string[]) {
  const roles = await db.role.findMany({ where: { id: { in: roleIds } } });
  if (roles.length !== roleIds.length) throw new AuthorizationError("Unknown role selected.");
  // Only someone with full access can hand out full access or role management (no privilege escalation).
  const isSuper = actor.permissions.has("*");
  for (const r of roles) {
    if (!isSuper && (r.permissions.includes("*") || r.permissions.includes("roles.manage") || r.permissions.includes("users.manage"))) {
      throw new AuthorizationError(`Only a Super Admin can assign the "${r.name}" role.`);
    }
  }
  return roles;
}

async function superAdminCount(excludingUserId?: string) {
  return db.user.count({
    where: { isActive: true, roles: { some: { role: { permissions: { has: "*" } } } }, ...(excludingUserId ? { id: { not: excludingUserId } } : {}) },
  });
}

const createSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().toLowerCase().email().max(254),
  roleIds: z.array(z.string()).min(1, "Choose at least one role"),
});

export async function createUserAction(input: unknown): Promise<Result> {
  try {
    const actor = await requirePermission("users.manage");
    const data = createSchema.parse(input);
    await assertRolesAssignable(actor, data.roleIds);
    if (await db.user.findUnique({ where: { email: data.email } })) return { ok: false, error: "A user with this email already exists." };
    const pw = tempPassword();
    const user = await db.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash: await hashPassword(pw),
        mustChangePassword: true,
        roles: { create: data.roleIds.map((roleId) => ({ roleId })) },
      },
    });
    await audit({ actorId: actor.id, action: "users.create", entityType: "users", entityId: user.id, summary: `Created user ${data.email}`, ip: (await requestMeta()).ip });
    revalidatePath("/admin/users");
    return { ok: true, message: "User created.", tempPassword: pw, id: user.id };
  } catch (e) {
    return { ok: false, error: e instanceof AuthorizationError ? e.message : e instanceof z.ZodError ? e.issues[0].message : "Could not create the user." };
  }
}

const updateSchema = z.object({
  name: z.string().trim().min(1).max(120),
  roleIds: z.array(z.string()).min(1, "Choose at least one role"),
  isActive: z.boolean(),
});

export async function updateUserAction(id: string, input: unknown): Promise<Result> {
  try {
    const actor = await requirePermission("users.manage");
    const data = updateSchema.parse(input);
    const target = await db.user.findUnique({ where: { id }, include: { roles: { include: { role: true } } } });
    if (!target) return { ok: false, error: "User not found." };
    const roles = await assertRolesAssignable(actor, data.roleIds);
    const targetIsSuper = target.roles.some((r) => r.role.permissions.includes("*"));
    if (targetIsSuper && !hasPermission(actor, "*")) throw new AuthorizationError("Only a Super Admin can change a Super Admin's account.");
    const willBeSuper = roles.some((r) => r.permissions.includes("*")) && data.isActive;
    if (targetIsSuper && !willBeSuper && (await superAdminCount(id)) === 0) {
      return { ok: false, error: "This is the last active Super Admin. Create another Super Admin first." };
    }
    if (id === actor.id && !data.isActive) return { ok: false, error: "You cannot deactivate your own account." };
    await db.$transaction([
      db.userRole.deleteMany({ where: { userId: id } }),
      db.user.update({ where: { id }, data: { name: data.name, isActive: data.isActive, roles: { create: data.roleIds.map((roleId) => ({ roleId })) } } }),
    ]);
    if (!data.isActive) await revokeUserSessions(id);
    const before = target.roles.map((r) => r.role.key).sort().join(",");
    const after = roles.map((r) => r.key).sort().join(",");
    await audit({
      actorId: actor.id,
      action: before !== after ? "users.roles.change" : "users.update",
      entityType: "users",
      entityId: id,
      summary: `Updated ${target.email}${before !== after ? ` (roles ${before} → ${after})` : ""}${target.isActive !== data.isActive ? (data.isActive ? " (reactivated)" : " (deactivated)") : ""}`,
      ip: (await requestMeta()).ip,
    });
    revalidatePath(`/admin/users/${id}`);
    return { ok: true, message: "Saved." };
  } catch (e) {
    return { ok: false, error: e instanceof AuthorizationError ? e.message : e instanceof z.ZodError ? e.issues[0].message : "Could not save." };
  }
}

export async function resetPasswordAction(id: string): Promise<Result> {
  try {
    const actor = await requirePermission("users.manage");
    const target = await db.user.findUnique({ where: { id }, include: { roles: { include: { role: true } } } });
    if (!target) return { ok: false, error: "User not found." };
    if (target.roles.some((r) => r.role.permissions.includes("*")) && !hasPermission(actor, "*")) {
      throw new AuthorizationError("Only a Super Admin can reset a Super Admin's password.");
    }
    const pw = tempPassword();
    await db.user.update({ where: { id }, data: { passwordHash: await hashPassword(pw), mustChangePassword: true } });
    await revokeUserSessions(id);
    await audit({ actorId: actor.id, action: "users.password.reset", entityType: "users", entityId: id, summary: `Reset password for ${target.email}`, ip: (await requestMeta()).ip });
    return { ok: true, message: "Password reset. The user's sessions were signed out.", tempPassword: pw };
  } catch (e) {
    return { ok: false, error: e instanceof AuthorizationError ? e.message : "Could not reset the password." };
  }
}

export async function revokeSessionsAction(id: string): Promise<Result> {
  try {
    const actor = await requirePermission("users.manage");
    await revokeUserSessions(id);
    await audit({ actorId: actor.id, action: "users.sessions.revoke", entityType: "users", entityId: id, summary: "Signed the user out everywhere", ip: (await requestMeta()).ip });
    return { ok: true, message: "All sessions revoked." };
  } catch (e) {
    return { ok: false, error: e instanceof AuthorizationError ? e.message : "Could not revoke sessions." };
  }
}
