import Link from "next/link";
import { notFound } from "next/navigation";
import { ResourceForm } from "@/components/admin/ResourceForm";
import { RevisionList } from "@/components/admin/RevisionList";
import { requirePagePermission } from "@/lib/auth/guards";
import { canModify, hasPermission, type ContentResource } from "@/lib/auth/permissions";
import { db } from "@/lib/db";
import { permissionFor, resourceByKey } from "@/lib/admin/resources";
import { STORES, delegateFor, recordToForm } from "@/lib/admin/resource-store";
import { listRevisions } from "@/lib/revisions";

type Props = { params: Promise<{ resource: string; id: string }>; searchParams: Promise<{ created?: string }> };

export default async function EditRecordPage({ params, searchParams }: Props) {
  const { resource, id } = await params;
  const def = resourceByKey(resource);
  if (!def) notFound();
  const user = await requirePagePermission(permissionFor(def, "read"));
  const record = (await delegateFor(def).findUnique({ where: { id }, include: STORES[def.key].include })) as (Record<string, unknown> & { id: string }) | null;
  if (!record) notFound();

  const owner = { createdById: (record.createdById as string | null) ?? null };
  const caps =
    def.kind === "content"
      ? {
          canSave: canModify(user, def.permission as ContentResource, "update", owner),
          canDelete: canModify(user, def.permission as ContentResource, "delete", owner),
          canDuplicate: hasPermission(user, permissionFor(def, "create")),
          canPublish: hasPermission(user, permissionFor(def, "publish")),
        }
      : (() => {
          const m = hasPermission(user, permissionFor(def, "update"));
          return { canSave: m, canDelete: m, canDuplicate: m, canPublish: true };
        })();

  const revisions = await listRevisions(def.key, id);
  const authorIds = [...new Set(revisions.map((r) => r.createdById).filter(Boolean))] as string[];
  const authors = new Map((await db.user.findMany({ where: { id: { in: authorIds } }, select: { id: true, name: true } })).map((u) => [u.id, u.name]));
  const title = String(record[def.titleField] ?? def.singular);

  return (
    <>
      <p className="a-small">
        <Link href={`/admin/content/${def.key}`}>← {def.label}</Link>
      </p>
      <div className="a-spread">
        <div>
          <h1>{title}</h1>
          <p className="a-muted a-small">
            {def.singular}
            {record.updatedAt instanceof Date && ` · last updated ${record.updatedAt.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}`}
            {typeof record.legacyId === "string" && record.legacyId && <> · legacy id <code>{record.legacyId}</code></>}
          </p>
        </div>
      </div>
      {(await searchParams).created && <div className="a-alert ok">Created.</div>}
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 280px", gap: 18 }} className="a-edit-grid">
        <ResourceForm
          resourceKey={def.key}
          singular={def.singular}
          id={id}
          initial={recordToForm(def, record)}
          fieldsets={def.fieldsets}
          caps={caps}
          viewUrl={def.publicPath?.(record) ?? null}
          previewUrl={def.previewable ? `/preview/${def.key}/${id}` : null}
        />
        <aside>
          <div className="a-card">
            <h3>History</h3>
            <RevisionList
              resourceKey={def.key}
              id={id}
              canRestore={caps.canSave}
              revisions={revisions.map((r) => ({ id: r.id, createdAt: r.createdAt.toISOString(), note: r.note, author: (r.createdById && authors.get(r.createdById)) || "Import / system" }))}
            />
          </div>
        </aside>
      </div>
    </>
  );
}
