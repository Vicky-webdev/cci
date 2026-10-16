import "server-only";
import { db } from "@/lib/db";
import { audit } from "@/lib/audit";
import { dummyVerify, verifyPassword } from "./password";
import { createSession } from "./session";

// Brute-force protection thresholds.
export const LOGIN_WINDOW_MS = 15 * 60 * 1000;
export const MAX_FAILURES_PER_ACCOUNT = 5;
export const MAX_FAILURES_PER_IP = 20;

export type LoginResult = { ok: true } | { ok: false; error: string };

const GENERIC_ERROR = "Invalid email or password.";
const LOCKED_ERROR = "Too many failed sign-in attempts. Please wait 15 minutes and try again.";

export async function attemptLogin(
  emailInput: string,
  password: string,
  meta: { ip: string; userAgent: string },
): Promise<LoginResult> {
  const email = emailInput.trim().toLowerCase();
  const since = new Date(Date.now() - LOGIN_WINDOW_MS);

  const [accountFailures, ipFailures] = await Promise.all([
    db.loginAttempt.count({ where: { email, success: false, createdAt: { gte: since } } }),
    db.loginAttempt.count({ where: { ip: meta.ip, success: false, createdAt: { gte: since } } }),
  ]);
  if (accountFailures >= MAX_FAILURES_PER_ACCOUNT || ipFailures >= MAX_FAILURES_PER_IP) {
    await audit({ action: "auth.login.blocked", summary: `Rate-limited sign-in for ${email}`, ip: meta.ip });
    return { ok: false, error: LOCKED_ERROR };
  }

  const user = await db.user.findUnique({ where: { email } });
  const valid = user ? await verifyPassword(user.passwordHash, password) : await dummyVerify(password);

  if (!user || !valid || !user.isActive) {
    await db.loginAttempt.create({ data: { email, ip: meta.ip, success: false } });
    await audit({
      actorId: user?.id,
      action: "auth.login.failed",
      summary: `Failed sign-in for ${email}${user && !user.isActive ? " (deactivated account)" : ""}`,
      ip: meta.ip,
    });
    return { ok: false, error: GENERIC_ERROR };
  }

  await db.loginAttempt.create({ data: { email, ip: meta.ip, success: true } });
  await db.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  await createSession(user.id, meta);
  await audit({ actorId: user.id, action: "auth.login.success", summary: `Signed in`, ip: meta.ip });
  return { ok: true };
}
