import { audit } from "@/lib/audit";
import { requirePermission } from "@/lib/auth/guards";
import { hasPermission } from "@/lib/auth/permissions";
import { permissionFor, resourceByKey } from "@/lib/admin/resources";
import { STORES, delegateFor } from "@/lib/admin/resource-store";

/** JSON export of every record of one content type (needs content.export plus read access). */
export async function GET(_req: Request, { params }: { params: Promise<{ resource: string }> }) {
  const def = resourceByKey((await params).resource);
  if (!def) return new Response("Not found", { status: 404 });
  let user;
  try {
    user = await requirePermission("content.export");
  } catch (e) {
    return new Response((e as Error).message, { status: 403 });
  }
  if (!hasPermission(user, permissionFor(def, "read"))) return new Response("Forbidden", { status: 403 });
  const rows = await delegateFor(def).findMany({ include: STORES[def.key].include, orderBy: STORES[def.key].orderBy });
  await audit({ actorId: user.id, action: "content.export", entityType: def.key, summary: `Exported ${rows.length} ${def.label.toLowerCase()} as JSON` });
  return new Response(JSON.stringify({ type: def.key, exportedAt: new Date().toISOString(), count: rows.length, records: rows }, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="cci-${def.key}-${new Date().toISOString().slice(0, 10)}.json"`,
      "Cache-Control": "no-store",
    },
  });
}
