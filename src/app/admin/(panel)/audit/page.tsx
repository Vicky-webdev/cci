import Link from "next/link";
import { requirePagePermission } from "@/lib/auth/guards";
import { db } from "@/lib/db";
import type { Prisma } from "@/generated/prisma/client";

export const metadata = { title: "Audit log" };
const PAGE = 100;

export default async function AuditPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  await requirePagePermission("audit.read");
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page ?? 1));
  const where: Prisma.AuditLogWhereInput = {
    ...(sp.action ? { action: { startsWith: sp.action } } : {}),
    ...(sp.q ? { summary: { contains: sp.q, mode: "insensitive" } } : {}),
    ...(sp.actor ? { actorId: sp.actor } : {}),
  };
  const [total, rows, actors] = await Promise.all([
    db.auditLog.count({ where }),
    db.auditLog.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * PAGE, take: PAGE, include: { actor: { select: { name: true, email: true } } } }),
    db.user.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ]);
  const pages = Math.max(1, Math.ceil(total / PAGE));
  const qs = (p: number) => new URLSearchParams({ ...Object.fromEntries(Object.entries(sp).filter(([k, v]) => v && k !== "page")) as Record<string, string>, page: String(p) }).toString();
  return (
    <>
      <h1>Audit log</h1>
      <p className="a-muted" style={{ marginBottom: 14 }}>
        Sign-ins, permission changes, publishing, deletions, exports and other sensitive operations. {total} entries.
      </p>
      <form className="a-filters" method="get">
        <input className="a-input" name="q" defaultValue={sp.q ?? ""} placeholder="Search summary…" aria-label="Search" />
        <select name="action" defaultValue={sp.action ?? ""} aria-label="Action type">
          <option value="">All actions</option>
          {["auth.", "users.", "roles.", "settings.", "media.", "pages.", "events.", "news.", "press.", "publications.", "submissions."].map((a) => (
            <option key={a} value={a}>{a.replace(".", "")}</option>
          ))}
        </select>
        <select name="actor" defaultValue={sp.actor ?? ""} aria-label="User">
          <option value="">All users</option>
          {actors.map((a) => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>
        <button className="a-btn secondary">Filter</button>
      </form>
      <div className="a-table-wrap">
        <table className="a-table">
          <thead>
            <tr>
              <th>When</th>
              <th>Who</th>
              <th>Action</th>
              <th>Details</th>
              <th>IP</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td className="a-small" style={{ whiteSpace: "nowrap" }}>{r.createdAt.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</td>
                <td className="a-small">{r.actor?.name ?? "—"}</td>
                <td><code>{r.action}</code></td>
                <td className="a-small">{r.summary}</td>
                <td className="a-small">{r.ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pages > 1 && (
        <nav className="a-pagination">
          {page > 1 && <Link className="a-btn secondary small" href={`?${qs(page - 1)}`}>← Newer</Link>}
          <span className="a-small a-muted">Page {page} of {pages}</span>
          {page < pages && <Link className="a-btn secondary small" href={`?${qs(page + 1)}`}>Older →</Link>}
        </nav>
      )}
    </>
  );
}
