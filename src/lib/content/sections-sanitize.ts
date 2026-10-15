import { sanitizeInline, sanitizeRichText } from "@/lib/sanitize";
import { sectionDef, type FieldDef, type Section } from "./sections";

function cleanValue(field: FieldDef, value: unknown): unknown {
  if (value === undefined || value === null) return value;
  switch (field.type) {
    case "html":
      return sanitizeRichText(String(value));
    case "inline-html":
      return sanitizeInline(String(value));
    case "list":
      return Array.isArray(value)
        ? value.map((item) => cleanFields(field.fields, (item ?? {}) as Record<string, unknown>))
        : [];
    default:
      return value;
  }
}

function cleanFields(fields: FieldDef[], data: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const f of fields) if (f.name in data) out[f.name] = cleanValue(f, data[f.name]);
  return out;
}

/** Sanitizes every HTML-bearing field and drops unknown keys (prevents stored XSS and junk). */
export function sanitizeSections(sections: Section[]): Section[] {
  return sections.map((s) => {
    const def = sectionDef(s.type);
    return def ? { ...s, data: cleanFields(def.fields, s.data) } : s;
  });
}
