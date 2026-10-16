/**
 * E2E environment: a brand-new database (cci_e2e_<timestamp>) with migrations, roles, the full
 * legacy import and one account per role. Its URL is written to .e2e/env.json for playwright.config.ts.
 * Requires E2E_ADMIN_DATABASE_URL (or TEST_DATABASE_URL) for a role with CREATEDB.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import pg from "pg";
import { hash } from "@node-rs/argon2";
import { createScriptClient } from "../../scripts/lib/db";
import { E2E_PASSWORD, E2E_USERS } from "./users";

const adminUrl = process.env.E2E_ADMIN_DATABASE_URL ?? process.env.TEST_DATABASE_URL;
if (!adminUrl) throw new Error("Set E2E_ADMIN_DATABASE_URL (a PostgreSQL URL for a role with CREATEDB).");
const name = `cci_e2e_${Date.now()}`;
const url = adminUrl.replace(/\/[^/?]+(\?|$)/, `/${name}$1`);

async function main() {
  const client = new pg.Client({ connectionString: adminUrl });
  await client.connect();
  await client.query(`CREATE DATABASE "${name}"`);
  await client.end();
  const env = { ...process.env, DATABASE_URL: url, SITE_ENV: "development" };
  execFileSync("npx", ["prisma", "migrate", "deploy"], { env, stdio: "inherit" });
  execFileSync("npx", ["tsx", "prisma/seed.ts"], { env, stdio: "inherit" });
  execFileSync("npx", ["tsx", "scripts/import-legacy-content/index.ts", "--only=settings,pages,events,news,press,publications,awards,people,crafts,media"], {
    env,
    stdio: "inherit",
  });
  process.env.DATABASE_URL = url;
  const db = createScriptClient();
  const passwordHash = await hash(E2E_PASSWORD, { memoryCost: 19456, timeCost: 2, parallelism: 1 });
  for (const u of E2E_USERS) {
    const role = await db.role.findUniqueOrThrow({ where: { key: u.role } });
    await db.user.create({ data: { email: u.email, name: u.name, passwordHash, roles: { create: { roleId: role.id } } } });
  }
  await db.$disconnect();
  fs.mkdirSync(".e2e", { recursive: true });
  fs.writeFileSync(".e2e/env.json", JSON.stringify({ databaseUrl: url, adminUrl, name }));
  console.log(`E2E database ready: ${name}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
