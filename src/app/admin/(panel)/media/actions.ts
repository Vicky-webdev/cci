"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { audit } from "@/lib/audit";
import { AuthorizationError, requirePermission } from "@/lib/auth/guards";
import { findMediaUsage } from "@/lib/media";
import { requestMeta } from "@/lib/request";
import { storage } from "@/lib/storage";

type Result = { ok: true; message: string } | { ok: false; error: string };

const metaSchema = z.object({
  alt: z.string().max(500),
  caption: z.string().max(1000),
  title: z.string().max(300),
  folder: z.string().max(300),
});

export async function updateMediaAction(id: string, values: unknown): Promise<Result> {
  try {
    const user = await requirePermission("media.update");
    const data = metaSchema.parse(values);
    const m = await db.media.update({ where: { id }, data });
    await audit({ actorId: user.id, action: "media.update", entityType: "media", entityId: id, summary: `Updated details of ${m.path}`, ip: (await requestMeta()).ip });
    return { ok: true, message: "Saved." };
  } catch (e) {
    return { ok: false, error: e instanceof AuthorizationError ? e.message : "Could not save." };
  }
}

export async function deleteMediaAction(id: string): Promise<Result> {
  try {
    const user = await requirePermission("media.delete");
    const m = await db.media.findUnique({ where: { id } });
    if (!m) return { ok: false, error: "File not found." };
    if (m.storage === "LEGACY") {
      return { ok: false, error: "Original files from the legacy site are protected and cannot be deleted from the CMS." };
    }
    const usage = await findMediaUsage(m.path);
    if (usage.length) return { ok: false, error: `This file is still used in ${usage.length} place(s). Remove it from them first.` };
    await db.media.delete({ where: { id } });
    await storage.remove(m.path.replace(/^uploads\//, ""));
    await audit({ actorId: user.id, action: "media.delete", entityType: "media", entityId: id, summary: `Deleted ${m.path}`, ip: (await requestMeta()).ip });
    return { ok: true, message: "Deleted." };
  } catch (e) {
    return { ok: false, error: e instanceof AuthorizationError ? e.message : "Could not delete." };
  }
}
