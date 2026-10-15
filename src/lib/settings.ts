import "server-only";
import { cache } from "react";
import { db } from "@/lib/db";
import { SETTINGS_SCHEMA, type SettingKey, type Settings } from "./settings-schema";

export { SETTINGS_SCHEMA, SETTING_KEYS, type SettingKey, type Settings } from "./settings-schema";

/** All settings merged over defaults. Invalid stored values fall back to the default. */
export const getSettings = cache(async (): Promise<Settings> => {
  const rows = await db.siteSetting.findMany();
  const raw: Record<string, unknown> = {};
  for (const row of rows) {
    const field = SETTINGS_SCHEMA.shape[row.key as SettingKey];
    if (field && field.safeParse(row.value).success) raw[row.key] = row.value;
  }
  return SETTINGS_SCHEMA.parse(raw);
});
