import "server-only";
import { db } from "@/lib/db";
import type { Prisma } from "@/generated/prisma/client";

/** Stores a snapshot of a record after a change; keeps the newest 50 per record. */
export async function recordRevision(
  tx: Prisma.TransactionClient,
  entityType: string,
  entityId: string,
  data: unknown,
  createdById: string | null,
  note = "",
) {
  await tx.revision.create({
    data: { entityType, entityId, data: JSON.parse(JSON.stringify(data)) as Prisma.InputJsonValue, createdById, note },
  });
  const old = await tx.revision.findMany({
    where: { entityType, entityId },
    orderBy: { createdAt: "desc" },
    skip: 50,
    select: { id: true },
  });
  if (old.length) await tx.revision.deleteMany({ where: { id: { in: old.map((r) => r.id) } } });
}

export function listRevisions(entityType: string, entityId: string) {
  return db.revision.findMany({
    where: { entityType, entityId },
    orderBy: { createdAt: "desc" },
    take: 50,
    select: { id: true, createdAt: true, createdById: true, note: true },
  });
}
