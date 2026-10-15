import Link from "next/link";
import { notFound } from "next/navigation";
import { Cell } from "@/components/admin/Cell";
import { requirePagePermission } from "@/lib/auth/guards";
import { hasPermission } from "@/lib/auth/permissions";
import { listRecords } from "@/lib/admin/list";
import { permissionFor, resourceByKey } from "@/lib/admin/resources";

type Props = { params: Promise<{ resource: string }>; searchParams: Promise<Record<string, string | undefined>> };

export async function generateMetadata({ params }: Props) {
  return { title: resourceByKey((await params).resource)?.label ?? "Content" };
}

export default async function ResourceListPage({ params, searchParams }: Props) {
  const def = resourceByKey((await params).resource);
  if (!def) notFound();
  const user = await requirePagePermission(permissionFor(def, "read"));
  const sp = await searchParams;
  const filters = Object.fromEntries((def.filters ?? []).map((f) => [f.name, sp[f.name] ?? ""]));
  const { rows, total, page, pages } = await listRecords(def, { q: sp.q, page: Number(sp.page ?? 1), filters });
  const canCreate = hasPermission(user, permissionFor(def, "create"));
  const qs = (p: number) => new URLSearchParams({ ...(sp.q ? { q: sp.q } : {}), ...Object.fromEntries(Object.entries(filters).filter(([, v]) => v)), page: String(p) }).toString();

  return (
    <>
      <div className="a-spread">
        <div>
          <h1>{def.label}</h1>
          <p className="a-muted">
            {total} {total === 1 ? "record" : "records"}
            {def.description ? ` · ${def.description}` : ""}
          </p>
        </div>
        <div className="a-row">
          {hasPermission(user, "content.export") && (
            <a className="a-btn secondary" href={`/api/admin/export/${def.key}`}>
              Export JSON
            </a>
          )}
          {canCreate && (
            <Link className="a-btn" href={`/admin/content/${def.key}/new`}>
              + New {def.singular.toLowerCase()}
            </Link>
          )}
        </div>
      </div>
      {sp.deleted && <div className="a-alert ok">Deleted.</div>}
      <form className="a-filters" method="get">
        <input className="a-input" type="search" name="q" defaultValue={sp.q ?? ""} placeholder={`Search ${def.label.toLowerCase()}…`} aria-label="Search" />
        {(def.filters ?? []).map((f) => (
          <select key={f.name} name={f.name} defaultValue={filters[f.name]} aria-label={f.label}>
            <option value="">All {f.label.toLowerCase()}</option>
            {f.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        ))}
        <button className="a-btn secondary" type="submit">
          Filter
        </button>
      </form>
      <div className="a-table-wrap">
        <table className="a-table">
          <thead>
            <tr>
              {def.columns.map((c) => (
                <th key={c.name} scope="col">
                  {c.label}
                </th>
              ))}
              <th scope="col">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                {def.columns.map((c) => (
                  <td key={c.name}>
                    {c.name === def.titleField ? (
                      <Link href={`/admin/content/${def.key}/${r.id}`}>
                        <Cell col={c} value={r[c.name]} />
                      </Link>
                    ) : (
                      <Cell col={c} value={r[c.name]} />
                    )}
                  </td>
                ))}
                <td style={{ whiteSpace: "nowrap" }}>
                  <Link className="a-btn secondary small" href={`/admin/content/${def.key}/${r.id}`}>
                    Open
                  </Link>
                </td>
              </tr>
            ))}
            {!rows.length && (
              <tr>
                <td colSpan={def.columns.length + 1} className="a-muted">
                  Nothing found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {pages > 1 && (
        <nav className="a-pagination" aria-label="Pagination">
          {page > 1 && (
            <Link className="a-btn secondary small" href={`?${qs(page - 1)}`}>
              ← Previous
            </Link>
          )}
          <span className="a-small a-muted">
            Page {page} of {pages}
          </span>
          {page < pages && (
            <Link className="a-btn secondary small" href={`?${qs(page + 1)}`}>
              Next →
            </Link>
          )}
        </nav>
      )}
    </>
  );
}
