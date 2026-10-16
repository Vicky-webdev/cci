"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { audit } from "@/lib/audit";
import { requirePermission } from "@/lib/auth/guards";
import { requestMeta } from "@/lib/request";

const STATUSES = ["NEW", "READ", "ARCHIVED", "SPAM"] as const;

export async function setSubmissionStatus(id: string, status: string) {
  const user = await requirePermission("submissions.update");
  if (!(STATUSES as readonly string[]).includes(status)) throw new Error("Invalid status");
  await db.formSubmission.update({ where: { id }, data: { status: status as (typeof STATUSES)[number] } });
  await audit({ actorId: user.id, action: "submissions.status", entityType: "submissions", entityId: id, summary: `Marked enquiry as ${status}`, ip: (await requestMeta()).ip });
  revalidatePath("/admin/submissions");
}

export async function deleteSubmission(id: string) {
  const user = await requirePermission("submissions.delete");
  const s = await db.formSubmission.delete({ where: { id } });
  await audit({ actorId: user.id, action: "submissions.delete", entityType: "submissions", entityId: id, summary: `Deleted enquiry from ${s.email}`, ip: (await requestMeta()).ip });
  revalidatePath("/admin/submissions");
}
