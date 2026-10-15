import { z } from "zod";
import type { FieldDef } from "@/lib/content/sections";

/**
 * Field types for admin forms: everything page sections support, plus record-level types.
 * Shared by the client form renderer and the server validator.
 */
export type AdminField =
  | FieldDef
  | { name: string; label: string; type: "date" | "datetime" | "slug" | "strings" | "sections" | "readonly"; help?: string; required?: boolean }
  | { name: string; label: string; type: "list"; fields: AdminField[]; itemLabel: string; help?: string };

export interface Fieldset {
  legend: string;
  fields: AdminField[];
}

export const SLUG_RE = /^[a-z0-9]+(?:[-/][a-z0-9]+)*$/;

function fieldSchema(f: AdminField): z.ZodTypeAny {
  const req = "required" in f && f.required;
  switch (f.type) {
    case "readonly":
      return z.any().optional();
    case "number":
      return z.coerce.number().int().min(f.min ?? -1_000_000).max(f.max ?? 1_000_000).optional();
    case "boolean":
      return z.boolean().optional();
    case "select":
      return z.enum(f.options.map((o) => o.value) as [string, ...string[]]).optional();
    case "date":
      return z
        .string()
        .regex(/^(\d{4}-\d{2}-\d{2})?$/, "Use YYYY-MM-DD")
        .optional();
    case "datetime":
      return z
        .string()
        .regex(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?)?$/, "Invalid date/time")
        .optional();
    case "slug":
      return z.string().trim().min(1, "Slug is required").max(200).regex(SLUG_RE, "Lowercase letters, numbers and hyphens only");
    case "strings":
      return z.array(z.string().max(2000)).max(500).default([]);
    case "sections":
      return z.array(z.any()).max(60).default([]);
    case "list":
      return z
        .array(z.object(Object.fromEntries(f.fields.map((x) => [x.name, fieldSchema(x)]))))
        .max(500)
        .default([]);
    case "url":
      return req ? z.string().trim().min(1).max(2000) : z.string().trim().max(2000).optional();
    default: {
      const max = f.type === "html" ? 500_000 : f.type === "textarea" || f.type === "inline-html" ? 20_000 : 1_000;
      return req ? z.string().trim().min(1, `${f.label} is required`).max(max) : z.string().max(max).optional();
    }
  }
}

export function allFields(fieldsets: Fieldset[]): AdminField[] {
  return fieldsets.flatMap((fs) => fs.fields);
}

export function recordSchema(fieldsets: Fieldset[]) {
  return z.object(
    Object.fromEntries(
      allFields(fieldsets)
        .filter((f) => f.type !== "readonly")
        .map((f) => [f.name, fieldSchema(f)]),
    ),
  );
}
