import "server-only";
import { db } from "@/lib/db";

/**
 * Database-backed sliding window: works across multiple app instances.
 * Returns true when the call is allowed (and records it).
 */
export async function consumeRateLimit(key: string, limit: number, windowMs: number): Promise<boolean> {
  const since = new Date(Date.now() - windowMs);
  const count = await db.rateLimitEvent.count({ where: { key, createdAt: { gte: since } } });
  if (count >= limit) return false;
  await db.rateLimitEvent.create({ data: { key } });
  // Opportunistic cleanup of old rows (1% of calls).
  if (Math.random() < 0.01) {
    await db.rateLimitEvent.deleteMany({ where: { createdAt: { lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } } });
  }
  return true;
}
