import "server-only";
import { redirect } from "next/navigation";
import { getSessionUser, type SessionUser } from "./session";
import { canModify, hasPermission, type ContentResource } from "./permissions";

export class AuthorizationError extends Error {
  constructor(message = "You do not have permission to perform this action.") {
    super(message);
    this.name = "AuthorizationError";
  }
}

/** For admin pages: redirects to login when signed out. */
export async function requireUser(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");
  return user;
}

/** For admin pages: renders the forbidden screen when the permission is missing. */
export async function requirePagePermission(permission: string): Promise<SessionUser> {
  const user = await requireUser();
  if (!hasPermission(user, permission)) redirect("/admin/forbidden");
  return user;
}

/** For Server Actions and Route Handlers: throws instead of redirecting. */
export async function requirePermission(permission: string): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) throw new AuthorizationError("Your session has expired. Please sign in again.");
  if (!hasPermission(user, permission)) throw new AuthorizationError();
  return user;
}

export async function requireAnyPermission(permissions: string[]): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) throw new AuthorizationError("Your session has expired. Please sign in again.");
  if (!permissions.some((p) => hasPermission(user, p))) throw new AuthorizationError();
  return user;
}

export function assertCanModify(
  user: SessionUser,
  resource: ContentResource,
  action: "update" | "delete",
  record: { createdById: string | null },
) {
  if (!canModify(user, resource, action, record)) throw new AuthorizationError();
}

export { hasPermission as can };
