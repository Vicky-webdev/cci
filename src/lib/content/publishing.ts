import type { ContentStatus } from "@/generated/prisma/enums";

export const STATUSES: ContentStatus[] = ["DRAFT", "IN_REVIEW", "SCHEDULED", "PUBLISHED", "ARCHIVED"];

export const STATUS_LABELS: Record<ContentStatus, string> = {
  DRAFT: "Draft",
  IN_REVIEW: "In review",
  SCHEDULED: "Scheduled",
  PUBLISHED: "Published",
  ARCHIVED: "Archived",
};

/** Prisma `where` fragment selecting records that are publicly visible right now. */
export function publishedWhere(now = new Date()) {
  return {
    OR: [{ status: "PUBLISHED" as const }, { status: "SCHEDULED" as const, publishAt: { lte: now } }],
  };
}

export function isPublic(record: { status: ContentStatus; publishAt: Date | null }, now = new Date()): boolean {
  return record.status === "PUBLISHED" || (record.status === "SCHEDULED" && !!record.publishAt && record.publishAt <= now);
}

/** Status changes that require the publish permission rather than plain update. */
export function requiresPublishPermission(from: ContentStatus | null, to: ContentStatus): boolean {
  const gated: ContentStatus[] = ["PUBLISHED", "SCHEDULED", "ARCHIVED"];
  return gated.includes(to) || (from !== null && gated.includes(from) && from !== to);
}
