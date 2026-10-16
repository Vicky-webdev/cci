import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requirePagePermission } from "@/lib/auth/guards";
import { hasPermission } from "@/lib/auth/permissions";
import { db } from "@/lib/db";
import { deleteSubmission, setSubmissionStatus } from "../actions";

export default async function SubmissionDetail({ params }: { params: Promise<{ id: string }> }) {
  const user = await requirePagePermission("submissions.read");
  const { id } = await params;
  let s = await db.formSubmission.findUnique({ where: { id } });
  if (!s) notFound();
  if (s.status === "NEW" && hasPermission(user, "submissions.update")) {
    s = await db.formSubmission.update({ where: { id }, data: { status: "READ" } });
  }
  const canUpdate = hasPermission(user, "submissions.update");
  return (
    <>
      <p className="a-small"><Link href="/admin/submissions">← Form submissions</Link></p>
      <h1>{s.subject}</h1>
      <div className="a-card">
        <p><strong>From:</strong> {s.name} &lt;<a href={`mailto:${s.email}`}>{s.email}</a>&gt;{s.phone && <> · {s.phone}</>}</p>
        <p className="a-small a-muted">
          Received {s.createdAt.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} · status {s.status} · email notification {s.emailStatus}
          {s.emailError && <> ({s.emailError})</>}
        </p>
        <div style={{ whiteSpace: "pre-wrap", borderTop: "1px solid var(--a-line)", paddingTop: 12 }}>{s.message}</div>
      </div>
      <div className="a-row">
        {canUpdate &&
          (["READ", "ARCHIVED", "SPAM", "NEW"] as const)
            .filter((st) => st !== s.status)
            .map((st) => (
              <form key={st} action={setSubmissionStatus.bind(null, s.id, st)}>
                <button className="a-btn secondary small">Mark as {st.toLowerCase()}</button>
              </form>
            ))}
        {hasPermission(user, "submissions.delete") && (
          <form
            action={async () => {
              "use server";
              await deleteSubmission(id);
              redirect("/admin/submissions");
            }}
          >
            <button className="a-btn danger small">Delete permanently</button>
          </form>
        )}
      </div>
    </>
  );
}
