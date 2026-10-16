import type { ResourceDef } from "./resources";
import { allFields } from "./fields";

/** Initial form values for a new record. */
export function defaultValues(def: ResourceDef): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const f of allFields(def.fieldsets)) {
    if (f.type === "list" || f.type === "strings" || f.type === "sections") out[f.name] = [];
    else if (f.type === "boolean") out[f.name] = ["isPublished", "isVisible", "isActive", "permanent", "showRead", "showDownload"].includes(f.name);
    else out[f.name] = "";
  }
  if (def.kind === "content") out.status = "DRAFT";
  if ("sortOrder" in out) out.sortOrder = 0;
  if (def.key === "events") Object.assign(out, { collection: "CURRENT", type: "event", tagLabel: "Upcoming Event", tagClass: "upcoming" });
  if (def.key === "pages") out.template = "standard";
  if (def.key === "publications") out.kind = "NEWSLETTER";
  if (def.key === "awards") out.listing = "awards";
  if (def.key === "team") out.group = "EC_MEMBER";
  if (def.key === "menu-items") out.menu = "main";
  if (def.key === "councils") out.focusLabel = "Focus";
  return out;
}
