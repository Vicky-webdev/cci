import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { cache } from "react";
import { db } from "@/lib/db";
import type { PermissionSubject } from "./permissions";

export const SESSION_COOKIE = "cci_session";

const ttlMs = () => Number(process.env.SESSION_TTL_HOURS ?? 12) * 60 * 60 * 1000;
const secureCookie = () =>
  process.env.SESSION_COOKIE_SECURE ? process.env.SESSION_COOKIE_SECURE === "true" : process.env.NODE_ENV === "production";

export const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");

export interface SessionUser extends PermissionSubject {
  name: string;
  email: string;
  roleKeys: string[];
  mustChangePassword: boolean;
  sessionId: string;
}

export async function createSession(userId: string, meta: { ip: string; userAgent: string }) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + ttlMs());
  await db.session.create({
    data: { id: hashToken(token), userId, expiresAt, ip: meta.ip, userAgent: meta.userAgent },
  });
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: secureCookie(),
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function destroyCurrentSession() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) {
    await db.session.updateMany({ where: { id: hashToken(token), revokedAt: null }, data: { revokedAt: new Date() } });
  }
  jar.delete(SESSION_COOKIE);
}

export async function revokeUserSessions(userId: string, exceptSessionId?: string) {
  await db.session.updateMany({
    where: { userId, revokedAt: null, ...(exceptSessionId ? { id: { not: exceptSessionId } } : {}) },
    data: { revokedAt: new Date() },
  });
}

/** Resolves the signed-in user from the session cookie. Cached per request. */
export const getSessionUser = cache(async (): Promise<SessionUser | null> => {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token || token.length > 100) return null;
  const id = hashToken(token);
  const session = await db.session.findUnique({
    where: { id },
    include: { user: { include: { roles: { include: { role: true } } } } },
  });
  const now = Date.now();
  if (!session || session.revokedAt || session.expiresAt.getTime() <= now || !session.user.isActive) return null;

  // Sliding expiry: extend once less than half the lifetime remains (cookie refreshed on next mutation).
  if (session.expiresAt.getTime() - now < ttlMs() / 2 || now - session.lastSeenAt.getTime() > 5 * 60 * 1000) {
    const extend = session.expiresAt.getTime() - now < ttlMs() / 2;
    await db.session.update({
      where: { id },
      data: { lastSeenAt: new Date(), ...(extend ? { expiresAt: new Date(now + ttlMs()) } : {}) },
    });
  }

  const permissions = new Set(session.user.roles.flatMap((ur) => ur.role.permissions));
  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    roleKeys: session.user.roles.map((ur) => ur.role.key),
    mustChangePassword: session.user.mustChangePassword,
    permissions,
    sessionId: id,
  };
});
