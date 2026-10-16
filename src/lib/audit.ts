import "server-only";
import { db } from "@/lib/db";
import type { Prisma } from "@/generated/prisma/client";

export interface AuditEntry {
  actorId?: string | null;
  action: string;
  entityType?: string;
  entityId?: string;
  summary?: string;
  metadata?: Prisma.InputJsonValue;
  ip?: string | null;
}

/** Writes an audit record. Never throws: auditing must not break the operation it records. */
export async function audit(entry: AuditEntry): Promise<void> {
  try {
    await db.auditLog.create({
      data: {
        actorId: entry.actorId ?? null,
        action: entry.action,
        entityType: entry.entityType,
        entityId: entry.entityId,
        summary: entry.summary ?? "",
        metadata: entry.metadata,
        ip: entry.ip ?? null,
      },
    });
  } catch (err) {
    console.error("[audit] failed to record", entry.action, err);
  }
}
