"use server";

import { db } from "@/lib/db";
import { Prisma } from "@/generated/prisma/client";
import { audit } from "@/lib/audit";
import { AuthorizationError, requirePermission } from "@/lib/auth/guards";
import { canModify, hasPermission, type ContentResource } from "@/lib/auth/permissions";
import { getSessionUser, type SessionUser } from "@/lib/auth/session";
import { requiresPublishPermission } from "@/lib/content/publishing";
import { recordRevision } from "@/lib/revisions";
import { requestMeta } from "@/lib/request";
import type { ContentStatus } from "@/generated/prisma/enums";
import { recordSchema } from "./fields";
import { permissionFor, resourceByKey, type ResourceDef } from "./resources";
import { STORES, delegateFor, formToData, recordToForm } from "./resource-store";

export type ActionResult = { ok: true; id?: string; message?: string } | { ok: false; error: string; fieldErrors?: Record<string, string> };

type Row = Record<string, unknown> & { id: string };

function fail(err: unknown): ActionResult {
  if (err instanceof AuthorizationError) return { ok: false, error: err.message };
  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
    const target = (err.meta?.target as string[] | string | undefined) ?? "";
    return { ok: false, error: `Another record already uses this ${String(target).replace(/[[\]"]/g, "") || "value"}.` };
  }
  console.error("[admin action]", err);
  return { ok: false, error: "The change could not be saved. Please try again." };
}

function getDef(key: string): ResourceDef {
  const def = resourceByKey(key);
  if (!def) throw new AuthorizationError("Unknown content type.");
  return def;
}

async function user(): Promise<SessionUser> {
  const u = await getSessionUser();
  if (!u) throw new AuthorizationError("Your session has expired. Please sign in again.");
  if (u.mustChangePassword) throw new AuthorizationError("Please set a new password before making changes.");
  return u;
}

/** Enforces create/update(.own)/publish rules for workflow content. Throws AuthorizationError. */
function checkContentWrite(u: SessionUser, def: ResourceDef, existing: Row | null, nextStatus: ContentStatus) {
  const r = def.permission as ContentResource;
  if (!existing) {
    if (!hasPermission(u, `${r}.create`)) throw new AuthorizationError();
  } else if (!canModify(u, r, "update", { createdById: (existing.createdById as string) ?? null })) {
    throw new AuthorizationError("You can only edit your own drafts.");
  }
  const from = (existing?.status as ContentStatus | undefined) ?? null;
  if (requiresPublishPermission(from, nextStatus) && !hasPermission(u, `${r}.publish`)) {
    throw new AuthorizationError("Publishing, scheduling or archiving needs publish permission. Save as Draft or In review instead.");
  }
}

export async function saveRecord(key: string, id: string | null, payload: string): Promise<ActionResult> {
  try {
    const def = getDef(key);
    const u = await user();
    const meta = await requestMeta();
    const values = JSON.parse(payload) as Record<string, unknown>;
    const parsed = recordSchema(def.fieldsets).safeParse(values);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) fieldErrors[String(issue.path[0])] ??= issue.message;
      return { ok: false, error: "Please correct the highlighted fields.", fieldErrors };
    }
    const store = STORES[def.key];
    const existing = id ? ((await delegateFor(def).findUnique({ where: { id }, include: store.include })) as Row | null) : null;
    if (id && !existing) return { ok: false, error: "This record no longer exists." };

    const data = formToData(def, parsed.data, existing);
    if (def.kind === "content") {
      const status = (data.status as ContentStatus | undefined) ?? (existing?.status as ContentStatus | undefined) ?? "DRAFT";
      data.status = status;
      checkContentWrite(u, def, existing, status);
      if (status === "SCHEDULED" && !data.publishAt) return { ok: false, error: "Scheduled content needs a publish date.", fieldErrors: { publishAt: "Required when scheduled" } };
      if (status === "PUBLISHED" && !existing?.publishedAt) data.publishedAt = new Date();
      data.updatedById = u.id;
      if (!existing) data.createdById = u.id;
    } else if (!hasPermission(u, permissionFor(def, existing ? "update" : "create"))) {
      throw new AuthorizationError();
    }

    const saved = await db.$transaction(async (t) => {
      const delegate = delegateFor(def, t);
      // Imported records have no history yet: keep their original state so the first edit can be undone.
      if (existing && (await t.revision.count({ where: { entityType: def.key, entityId: existing.id } })) === 0) {
        await recordRevision(t, def.key, existing.id, existing, null, "Original (before first CMS edit)");
      }
      const rec = existing ? await delegate.update({ where: { id: existing.id }, data }) : await delegate.create({ data });
      const snapshot = await delegate.findUnique({ where: { id: rec.id }, include: store.include });
      await recordRevision(t, def.key, rec.id, snapshot, u.id, existing ? "Updated" : "Created");
      return rec;
    });

    const statusNote = def.kind === "content" && existing && existing.status !== data.status ? ` (status ${String(existing.status)} → ${String(data.status)})` : "";
    await audit({
      actorId: u.id,
      action: `${def.key}.${existing ? "update" : "create"}${statusNote && data.status === "PUBLISHED" ? ".publish" : ""}`,
      entityType: def.key,
      entityId: saved.id,
      summary: `${existing ? "Updated" : "Created"} ${def.singular.toLowerCase()} "${String(saved[def.titleField] ?? saved.id)}"${statusNote}`,
      ip: meta.ip,
    });
    return { ok: true, id: saved.id, message: "Saved." };
  } catch (err) {
    return fail(err);
  }
}

export async function deleteRecord(key: string, id: string): Promise<ActionResult> {
  try {
    const def = getDef(key);
    const u = await user();
    const existing = (await delegateFor(def).findUnique({ where: { id } })) as Row | null;
    if (!existing) return { ok: false, error: "This record no longer exists." };
    if (def.kind === "content") {
      const r = def.permission as ContentResource;
      if (!canModify(u, r, "delete", { createdById: (existing.createdById as string) ?? null })) throw new AuthorizationError();
      if (existing.status === "PUBLISHED" && !hasPermission(u, `${r}.publish`)) {
        throw new AuthorizationError("Published content can only be deleted by someone with publish permission. Archive it instead.");
      }
    } else if (!hasPermission(u, permissionFor(def, "delete"))) {
      throw new AuthorizationError();
    }
    if (def.key === "pages" && ["home", "about", "contact", "events", "news", "press"].includes(String(existing.slug))) {
      return { ok: false, error: "Built-in pages cannot be deleted (their routes depend on them). Unpublish or archive instead." };
    }
    const meta = await requestMeta();
    await db.$transaction(async (t) => {
      await recordRevision(t, def.key, id, existing, u.id, "Deleted");
      await delegateFor(def, t).delete({ where: { id } });
    });
    await audit({ actorId: u.id, action: `${def.key}.delete`, entityType: def.key, entityId: id, summary: `Deleted ${def.singular.toLowerCase()} "${String(existing[def.titleField] ?? id)}"`, ip: meta.ip });
    return { ok: true, message: "Deleted." };
  } catch (err) {
    return fail(err);
  }
}

export async function duplicateRecord(key: string, id: string): Promise<ActionResult> {
  try {
    const def = getDef(key);
    const u = await requirePermission(permissionFor(def, "create"));
    const store = STORES[def.key];
    const existing = (await delegateFor(def).findUnique({ where: { id }, include: store.include })) as Row | null;
    if (!existing) return { ok: false, error: "This record no longer exists." };
    const omit = new Set(["id", "createdAt", "updatedAt", "legacyId", "legacyKey", "legacyPath", "publishedAt", "hits", "groups", "locations", "images"]);
    const data: Record<string, unknown> = Object.fromEntries(Object.entries(existing).filter(([k]) => !omit.has(k)));
    const suffix = Date.now().toString(36).slice(-4);
    if ("slug" in data) data.slug = `${String(data.slug)}-copy-${suffix}`;
    if ("code" in data) data.code = `${String(data.code)}-${suffix}`;
    if ("source" in data) data.source = `${String(data.source)}-copy-${suffix}`;
    if (def.titleField in data) data[def.titleField] = `${String(data[def.titleField])} (copy)`;
    if (def.kind === "content") Object.assign(data, { status: "DRAFT", publishAt: null, createdById: u.id, updatedById: u.id });
    if (existing.groups) data.groups = { create: (existing.groups as Row[]).map(({ media, dateText, readOnlineUrl, items, sortOrder }) => ({ media, dateText, readOnlineUrl, items, sortOrder })) };
    if (existing.locations) data.locations = { create: (existing.locations as Row[]).map(({ craft, district, village, sortOrder }) => ({ craft, district, village, sortOrder })) };
    if (existing.images) data.images = { create: (existing.images as Row[]).map(({ src, sortOrder }) => ({ src, sortOrder })) };
    const created = await delegateFor(def).create({ data });
    const meta = await requestMeta();
    await audit({ actorId: u.id, action: `${def.key}.duplicate`, entityType: def.key, entityId: created.id, summary: `Duplicated "${String(existing[def.titleField])}"`, ip: meta.ip });
    return { ok: true, id: created.id, message: "Copy created as a draft." };
  } catch (err) {
    return fail(err);
  }
}

/** Restores a snapshot through the normal save path, so validation, permissions and audit all apply. */
export async function restoreRevision(key: string, id: string, revisionId: string): Promise<ActionResult> {
  try {
    const def = getDef(key);
    const rev = await db.revision.findFirst({ where: { id: revisionId, entityType: def.key, entityId: id } });
    if (!rev) return { ok: false, error: "Revision not found." };
    const values = recordToForm(def, rev.data as Row);
    // Restoring never changes the publication status by itself.
    const current = (await delegateFor(def).findUnique({ where: { id } })) as Row | null;
    if (!current) return { ok: false, error: "This record no longer exists." };
    if ("status" in current) values.status = current.status;
    const res = await saveRecord(key, id, JSON.stringify(values));
    if (res.ok) {
      const u = await getSessionUser();
      await audit({ actorId: u?.id, action: `${def.key}.restore`, entityType: def.key, entityId: id, summary: `Restored revision from ${rev.createdAt.toISOString()}` });
    }
    return res.ok ? { ok: true, id, message: "Revision restored." } : res;
  } catch (err) {
    return fail(err);
  }
}

/**
 * Review decision without editing the content (Reviewer role): publish/archive need the
 * resource's publish permission; returning to draft needs publish or content.review.
 */
export async function setRecordStatus(key: string, id: string, status: ContentStatus): Promise<ActionResult> {
  try {
    const def = getDef(key);
    if (def.kind !== "content") return { ok: false, error: "This content type has no workflow." };
    const u = await user();
    const r = def.permission as ContentResource;
    if (!["DRAFT", "PUBLISHED", "ARCHIVED"].includes(status)) return { ok: false, error: "Unsupported status." };
    const allowed = status === "DRAFT" ? hasPermission(u, `${r}.publish`) || hasPermission(u, "content.review") : hasPermission(u, `${r}.publish`);
    if (!allowed) throw new AuthorizationError();
    const existing = (await delegateFor(def).findUnique({ where: { id } })) as Row | null;
    if (!existing) return { ok: false, error: "This record no longer exists." };
    const data: Record<string, unknown> = { status, updatedById: u.id };
    if (status === "PUBLISHED" && !existing.publishedAt) data.publishedAt = new Date();
    await db.$transaction(async (t) => {
      const delegate = delegateFor(def, t);
      if ((await t.revision.count({ where: { entityType: def.key, entityId: id } })) === 0) {
        await recordRevision(t, def.key, id, existing, null, "Original (before first CMS edit)");
      }
      const rec = await delegate.update({ where: { id }, data });
      await recordRevision(t, def.key, id, rec, u.id, `Status ${String(existing.status)} → ${status}`);
    });
    const meta = await requestMeta();
    await audit({
      actorId: u.id,
      action: `${def.key}.${status === "PUBLISHED" ? "publish" : status === "ARCHIVED" ? "archive" : "unpublish"}`,
      entityType: def.key,
      entityId: id,
      summary: `${status === "PUBLISHED" ? "Published" : status === "ARCHIVED" ? "Archived" : "Returned to draft"} "${String(existing[def.titleField] ?? id)}"`,
      ip: meta.ip,
    });
    return { ok: true, id, message: status === "PUBLISHED" ? "Published." : status === "ARCHIVED" ? "Archived." : "Returned to draft." };
  } catch (err) {
    return fail(err);
  }
}
