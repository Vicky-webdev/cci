import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../src/generated/prisma/client";

/** Prisma client for CLI scripts (the app's src/lib/db.ts is server-only). */
export function createScriptClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is not set (copy .env.example to .env)");
  return new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
}
