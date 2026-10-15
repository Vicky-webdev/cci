import "server-only";
import type { ResourceDef } from "./resources";
import { STORES, delegateFor } from "./resource-store";

export const PAGE_SIZE = 50;

export async function listRecords(def: ResourceDef, params: { q?: string; page?: number; filters?: Record<string, string> }) {
  const where: Record<string, unknown> = {};
  const q = params.q?.trim();
  if (q) where.OR = def.searchFields.map((f) => ({ [f]: { contains: q, mode: "insensitive" } }));
  for (const f of def.filters ?? []) {
    const v = params.filters?.[f.name];
    if (v && f.options.some((o) => o.value === v)) where[f.name] = v;
  }
  const page = Math.max(1, params.page ?? 1);
  const delegate = delegateFor(def);
  const [total, rows] = await Promise.all([
    delegate.count({ where }),
    delegate.findMany({ where, orderBy: STORES[def.key].orderBy, skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE }),
  ]);
  const extra = STORES[def.key].listExtra;
  return { total, page, pages: Math.max(1, Math.ceil(total / PAGE_SIZE)), rows: extra ? await extra(rows) : rows };
}
