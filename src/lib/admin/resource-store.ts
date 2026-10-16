import "server-only";
import { db } from "@/lib/db";
import type { Prisma } from "@/generated/prisma/client";
import { parseDateRange } from "@/lib/dates";
import { slugifyId } from "@/lib/links";
import { sanitizeInline, sanitizeRichText } from "@/lib/sanitize";
import { sanitizeSections } from "@/lib/content/sections-sanitize";
import { sectionsSchema, type Section } from "@/lib/content/sections";
import { allFields, type AdminField } from "./fields";
import type { ResourceDef } from "./resources";

type Row = Record<string, unknown> & { id: string };
type Data = Record<string, unknown>;

/** Minimal delegate surface shared by every model we manage generically. */
interface Delegate {
  findMany(args: unknown): Promise<Row[]>;
  findUnique(args: unknown): Promise<Row | null>;
  count(args: unknown): Promise<number>;
  create(args: unknown): Promise<Row>;
  update(args: unknown): Promise<Row>;
  delete(args: unknown): Promise<Row>;
}

const tx = (client: Prisma.TransactionClient | typeof db, model: string) => (client as unknown as Record<string, Delegate>)[model];

interface StoreConfig {
  model: string;
  include?: Record<string, unknown>;
  orderBy: Record<string, unknown>[];
  /** Record → form values. */
  toForm?: (r: Row) => Data;
  /** Form values → Prisma data (may include nested writes). */
  toData?: (form: Data, existing: Row | null) => Data;
  listExtra?: (rows: Row[]) => Promise<Row[]>;
}

const srcList = (v: unknown) => (Array.isArray(v) ? v.map((x) => ({ src: String(x) })) : []);
const fromSrcList = (v: unknown) =>
  Array.isArray(v) ? v.map((x) => String((x as { src?: string }).src ?? "").trim()).filter(Boolean) : [];

export const STORES: Record<string, StoreConfig> = {
  pages: { model: "page", orderBy: [{ slug: "asc" }] },
  events: {
    model: "event",
    orderBy: [{ startDate: { sort: "desc", nulls: "last" } }, { sortOrder: "asc" }],
    toForm: (r) => ({ ...r, gallery: srcList(r.gallery) }),
    toData: (f) => {
      const range = parseDateRange(String(f.dateText ?? ""));
      return {
        ...f,
        gallery: fromSrcList(f.gallery),
        relatedSlugs: ((f.relatedSlugs as string[]) ?? []).map(slugifyId).filter(Boolean),
        startDate: f.startDate ? new Date(`${f.startDate}T00:00:00Z`) : (range?.start ?? null),
        endDate: f.endDate ? new Date(`${f.endDate}T00:00:00Z`) : (f.startDate ? null : (range?.end ?? null)),
      };
    },
  },
  news: { model: "newsArticle", orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] },
  press: {
    model: "pressItem",
    include: { groups: { orderBy: { sortOrder: "asc" } } },
    orderBy: [{ sortOrder: "asc" }],
    toForm: (r) => ({
      ...r,
      groups: ((r.groups as Row[]) ?? []).map((g) => ({ media: g.media, dateText: g.dateText, readOnlineUrl: g.readOnlineUrl, items: srcList(g.items) })),
    }),
    toData: (f) => ({
      ...f,
      groups: {
        deleteMany: {},
        create: ((f.groups as Data[]) ?? []).map((g, i) => ({
          media: String(g.media ?? ""),
          dateText: String(g.dateText ?? ""),
          readOnlineUrl: String(g.readOnlineUrl ?? ""),
          items: fromSrcList(g.items),
          sortOrder: i,
        })),
      },
    }),
  },
  publications: { model: "publication", orderBy: [{ kind: "asc" }, { isArchived: "asc" }, { sortOrder: "asc" }] },
  awards: { model: "awardRecipient", orderBy: [{ listing: "asc" }, { year: "desc" }, { sortOrder: "asc" }] },
  "award-categories": { model: "awardCategory", orderBy: [{ sortOrder: "asc" }] },
  artisans: { model: "artisan", orderBy: [{ sortOrder: "asc" }] },
  team: { model: "teamMember", orderBy: [{ group: "asc" }, { sortOrder: "asc" }] },
  councils: { model: "stateCouncil", orderBy: [{ sortOrder: "asc" }] },
  "craft-states": {
    model: "craftState",
    include: { locations: { orderBy: { sortOrder: "asc" } }, images: { orderBy: { sortOrder: "asc" } } },
    orderBy: [{ sortOrder: "asc" }],
    toForm: (r) => ({
      ...r,
      locations: ((r.locations as Row[]) ?? []).map((l) => ({ craft: l.craft, district: l.district, village: l.village })),
      images: ((r.images as Row[]) ?? []).map((i) => ({ src: i.src })),
    }),
    toData: (f) => ({
      ...f,
      locations: {
        deleteMany: {},
        create: ((f.locations as Data[]) ?? []).map((l, i) => ({
          craft: String(l.craft ?? ""),
          district: String(l.district ?? ""),
          village: String(l.village ?? ""),
          sortOrder: i,
        })),
      },
      images: { deleteMany: {}, create: fromSrcList(f.images).map((src, i) => ({ src, sortOrder: i })) },
    }),
  },
  processes: { model: "craftProcess", orderBy: [{ sortOrder: "asc" }] },
  "menu-items": {
    model: "menuItem",
    orderBy: [{ menu: "asc" }, { parentId: { sort: "asc", nulls: "first" } }, { sortOrder: "asc" }],
    toData: (f) => ({ ...f, parentId: f.parentId ? String(f.parentId) : null }),
    listExtra: async (rows) => {
      const labels = new Map(rows.map((r) => [r.id, String(r.label)]));
      return rows.map((r) => ({ ...r, parentLabel: r.parentId ? (labels.get(String(r.parentId)) ?? "") : "" }));
    },
  },
  redirects: { model: "redirect", orderBy: [{ source: "asc" }] },
};

export function delegateFor(def: ResourceDef, client: Prisma.TransactionClient | typeof db = db) {
  return tx(client, STORES[def.key].model);
}

const toLocalInput = (d: Date, withTime: boolean) => {
  const iso = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString();
  return withTime ? iso.slice(0, 16) : d.toISOString().slice(0, 10);
};

/** Normalises a stored record into plain form values (dates as input strings, nulls as ""). */
export function recordToForm(def: ResourceDef, record: Row): Data {
  const store = STORES[def.key];
  const base = store.toForm ? store.toForm(record) : record;
  const out: Data = { id: record.id };
  for (const f of allFields(def.fieldsets)) {
    const v = base[f.name];
    if (f.type === "date") out[f.name] = v instanceof Date ? toLocalInput(v, false) : "";
    else if (f.type === "datetime") out[f.name] = v instanceof Date ? toLocalInput(v, true) : "";
    else if (f.type === "boolean") out[f.name] = v === true;
    else if (f.type === "list" || f.type === "strings" || f.type === "sections") out[f.name] = Array.isArray(v) ? v : [];
    else out[f.name] = v ?? "";
  }
  for (const meta of ["status", "createdById", "updatedAt", "createdAt"]) if (meta in record) out[`_${meta}`] = record[meta];
  return out;
}

function cleanField(f: AdminField, v: unknown): unknown {
  if (v === undefined) return undefined;
  switch (f.type) {
    case "html":
      return sanitizeRichText(String(v ?? ""));
    case "inline-html":
      return sanitizeInline(String(v ?? ""));
    case "datetime":
      return v ? new Date(String(v)) : null;
    case "date":
      return v ? String(v) : "";
    case "number":
      return v === "" || v === null ? undefined : Number(v);
    case "list":
      return Array.isArray(v)
        ? v.map((item) => Object.fromEntries(f.fields.map((sub) => [sub.name, cleanField(sub, (item as Data)[sub.name]) ?? ""])))
        : [];
    case "strings":
      return Array.isArray(v) ? v.map((x) => String(x).trim()).filter(Boolean) : [];
    case "sections": {
      const parsed = sectionsSchema.parse(v);
      return sanitizeSections(parsed as Section[]);
    }
    case "readonly":
      return undefined;
    default:
      return typeof v === "string" ? v.trim() : v;
  }
}

/** Validated form values → Prisma data: sanitizes HTML, converts dates, drops read-only fields. */
export function formToData(def: ResourceDef, values: Data, existing: Row | null): Data {
  const data: Data = {};
  for (const f of allFields(def.fieldsets)) {
    const v = cleanField(f, values[f.name]);
    if (v !== undefined) data[f.name] = v;
  }
  const store = STORES[def.key];
  return store.toData ? store.toData(data, existing) : data;
}
