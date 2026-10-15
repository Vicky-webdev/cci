import Link from "next/link";
import { notFound } from "next/navigation";
import { ResourceForm } from "@/components/admin/ResourceForm";
import { requirePagePermission } from "@/lib/auth/guards";
import { hasPermission } from "@/lib/auth/permissions";
import { defaultValues } from "@/lib/admin/defaults";
import { permissionFor, resourceByKey } from "@/lib/admin/resources";

type Props = { params: Promise<{ resource: string }> };

export default async function NewRecordPage({ params }: Props) {
  const def = resourceByKey((await params).resource);
  if (!def) notFound();
  const user = await requirePagePermission(permissionFor(def, "create"));
  return (
    <>
      <p className="a-small">
        <Link href={`/admin/content/${def.key}`}>← {def.label}</Link>
      </p>
      <h1 style={{ marginBottom: 16 }}>New {def.singular.toLowerCase()}</h1>
      <ResourceForm
        resourceKey={def.key}
        singular={def.singular}
        id={null}
        initial={defaultValues(def)}
        fieldsets={def.fieldsets}
        caps={{ canSave: true, canDelete: false, canDuplicate: false, canPublish: def.kind === "simple" || hasPermission(user, permissionFor(def, "publish")) }}
      />
    </>
  );
}
