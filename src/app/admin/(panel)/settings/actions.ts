"use server";

import { db } from "@/lib/db";
import { audit } from "@/lib/audit";
import { AuthorizationError, requirePermission } from "@/lib/auth/guards";
import { requestMeta } from "@/lib/request";
import { SETTINGS_SCHEMA, type SettingKey } from "@/lib/settings-schema";
import type { Prisma } from "@/generated/prisma/client";

export async function saveSettingsAction(payload: string): Promise<{ ok: boolean; message: string; fieldErrors?: Record<string, string> }> {
  try {
    const user = await requirePermission("settings.manage");
    const values = JSON.parse(payload) as Record<string, unknown>;
    const fieldErrors: Record<string, string> = {};
    const clean: Partial<Record<SettingKey, unknown>> = {};
    for (const [key, schema] of Object.entries(SETTINGS_SCHEMA.shape)) {
      if (!(key in values)) continue;
      let v = values[key];
      if (Array.isArray(v) && v.every((x) => typeof x === "string")) v = (v as string[]).map((s) => s.trim()).filter(Boolean);
      const r = schema.safeParse(v);
      if (r.success) clean[key as SettingKey] = r.data;
      else fieldErrors[key] = r.error.issues[0]?.message ?? "Invalid value";
    }
    if (clean["analytics.gaMeasurementId"] && !/^G-[A-Z0-9]+$/.test(String(clean["analytics.gaMeasurementId"]))) {
      fieldErrors["analytics.gaMeasurementId"] = "Must look like G-XXXXXXX";
    }
    if (clean["forms.contact.notifyTo"] && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(clean["forms.contact.notifyTo"]))) {
      fieldErrors["forms.contact.notifyTo"] = "Enter a valid email address";
    }
    if (Object.keys(fieldErrors).length) return { ok: false, message: "Please correct the highlighted fields.", fieldErrors };
    const before = new Map((await db.siteSetting.findMany()).map((s) => [s.key, JSON.stringify(s.value)]));
    const changed = Object.entries(clean).filter(([k, v]) => before.get(k) !== JSON.stringify(v));
    await db.$transaction(
      changed.map(([key, value]) =>
        db.siteSetting.upsert({
          where: { key },
          create: { key, value: value as Prisma.InputJsonValue, updatedById: user.id },
          update: { value: value as Prisma.InputJsonValue, updatedById: user.id },
        }),
      ),
    );
    if (changed.length) {
      await audit({ actorId: user.id, action: "settings.update", entityType: "settings", summary: `Changed settings: ${changed.map(([k]) => k).join(", ")}`, ip: (await requestMeta()).ip });
    }
    return { ok: true, message: changed.length ? `Saved ${changed.length} setting(s).` : "No changes." };
  } catch (e) {
    return { ok: false, message: e instanceof AuthorizationError ? e.message : "Could not save settings." };
  }
}
