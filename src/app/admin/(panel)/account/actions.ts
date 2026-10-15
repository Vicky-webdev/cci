"use server";

import { db } from "@/lib/db";
import { audit } from "@/lib/audit";
import { hashPassword, validatePasswordStrength, verifyPassword } from "@/lib/auth/password";
import { getSessionUser, revokeUserSessions } from "@/lib/auth/session";
import { requestMeta } from "@/lib/request";

export async function changePasswordAction(_prev: { error?: string; ok?: string } | undefined, form: FormData) {
  const user = await getSessionUser();
  if (!user) return { error: "Your session has expired. Please sign in again." };
  const current = String(form.get("current") ?? "");
  const next = String(form.get("next") ?? "");
  const confirm = String(form.get("confirm") ?? "");
  const record = await db.user.findUnique({ where: { id: user.id } });
  if (!record || !(await verifyPassword(record.passwordHash, current))) return { error: "Your current password is incorrect." };
  if (next !== confirm) return { error: "The new passwords do not match." };
  if (next === current) return { error: "Choose a password different from the current one." };
  const weak = validatePasswordStrength(next);
  if (weak) return { error: weak };
  await db.user.update({ where: { id: user.id }, data: { passwordHash: await hashPassword(next), mustChangePassword: false } });
  // Sign out every other device; keep the current session.
  await revokeUserSessions(user.id, user.sessionId);
  await audit({ actorId: user.id, action: "auth.password.change", summary: "Changed own password", ip: (await requestMeta()).ip });
  return { ok: "Password changed. Other devices have been signed out." };
}

export async function signOutEverywhereAction() {
  const user = await getSessionUser();
  if (!user) return;
  await revokeUserSessions(user.id, user.sessionId);
  await audit({ actorId: user.id, action: "auth.sessions.revoke", summary: "Signed out other sessions", ip: (await requestMeta()).ip });
}
