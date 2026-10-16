import { db } from "@/lib/db";
import { audit } from "@/lib/audit";
import { requirePermission } from "@/lib/auth/guards";
import type { SubmissionStatus } from "@/generated/prisma/enums";

/** CSV export of contact submissions. Cells are escaped and formula-injection guarded. */
const cell = (v: unknown) => {
  let s = v == null ? "" : String(v);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
};

export async function GET(request: Request) {
  let user;
  try {
    user = await requirePermission("submissions.export");
  } catch (e) {
    return new Response((e as Error).message, { status: 403 });
  }
  const status = new URL(request.url).searchParams.get("status");
  const rows = await db.formSubmission.findMany({
    where: status && ["NEW", "READ", "ARCHIVED", "SPAM"].includes(status) ? { status: status as SubmissionStatus } : {},
    orderBy: { createdAt: "desc" },
  });
  const header = ["received_at", "name", "email", "phone", "subject", "message", "status", "email_status"];
  const lines = [header.join(","), ...rows.map((r) => [r.createdAt.toISOString(), r.name, r.email, r.phone, r.subject, r.message, r.status, r.emailStatus].map(cell).join(","))];
  await audit({ actorId: user.id, action: "submissions.export", entityType: "submissions", summary: `Exported ${rows.length} submissions as CSV` });
  return new Response("﻿" + lines.join("\r\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="cci-enquiries-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
