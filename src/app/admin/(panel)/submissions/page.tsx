import Link from "next/link";
import { requirePagePermission } from "@/lib/auth/guards";
import { hasPermission } from "@/lib/auth/permissions";
import { db } from "@/lib/db";
import type { SubmissionStatus } from "@/generated/prisma/enums";

export const metadata = { title: "Form submissions" };
const STATUSES = ["NEW", "READ", "ARCHIVED", "SPAM"];

export default async function SubmissionsPage({ searchParams }: { searchParams: Promise<{ status?: string; q?: string }> }) {
  const user = await requirePagePermission("submissions.read");
  const sp = await searchParams;
  const status = STATUSES.includes(sp.status ?? "") ? (sp.status as SubmissionStatus) : undefined;
  const rows = await db.formSubmission.findMany({
    where: {
      ...(status ? { status } : { status: { not: "SPAM" } }),
      ...(sp.q ? { OR: [{ name: { contains: sp.q, mode: "insensitive" } }, { email: { contains: sp.q, mode: "insensitive" } }, { subject: { contains: sp.q, mode: "insensitive" } }] } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 200,
  });
  return (
    <>
      <div className="a-spread">
        <div>
          <h1>Form submissions</h1>
          <p className="a-muted">Contact-form enquiries are stored here even if the notification email fails.</p>
        </div>
        {hasPermission(user, "submissions.export") && (
          <a className="a-btn secondary" href={`/api/admin/submissions/export${status ? `?status=${status}` : ""}`}>
            Export CSV
          </a>
        )}
      </div>
      <form className="a-filters" method="get">
        <input className="a-input" type="search" name="q" defaultValue={sp.q ?? ""} placeholder="Search name, email, subject…" aria-label="Search submissions" />
        <select name="status" defaultValue={status ?? ""} aria-label="Status">
          <option value="">All except spam</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <button className="a-btn secondary">Filter</button>
      </form>
      <div className="a-table-wrap">
        <table className="a-table">
          <thead>
            <tr>
              <th>Received</th>
              <th>From</th>
              <th>Subject</th>
              <th>Status</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td className="a-small">{r.createdAt.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</td>
                <td>
                  <Link href={`/admin/submissions/${r.id}`}>{r.name}</Link>
                  <div className="a-small a-muted">{r.email}</div>
                </td>
                <td>{r.subject}</td>
                <td><span className={`a-badge ${r.status}`}>{r.status}</span></td>
                <td><span className={`a-badge ${r.emailStatus}`}>{r.emailStatus}</span></td>
              </tr>
            ))}
            {!rows.length && (
              <tr>
                <td colSpan={5} className="a-muted">No submissions.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
