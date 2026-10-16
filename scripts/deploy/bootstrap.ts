/**
 * Database bootstrap for hosted builds (used by `npm run vercel-build`).
 *
 *  1. Applies pending migrations (`prisma migrate deploy` — never resets or drops data).
 *  2. Seeds the system roles (idempotent).
 *  3. Imports the legacy content ONLY when the database has no content yet, so CMS edits
 *     are never overwritten by later builds.
 *  4. Creates the first Super Admin ONLY when there are no users and both ADMIN_EMAIL and
 *     ADMIN_PASSWORD are set. Remove ADMIN_PASSWORD from the host afterwards.
 */
import { execFileSync } from "node:child_process";
import { createScriptClient } from "../lib/db";

const run = (cmd: string, args: string[], env: NodeJS.ProcessEnv = process.env) =>
  execFileSync(cmd, args, { stdio: "inherit", env });

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set — connect a PostgreSQL database to the project first.");
  }

  console.log("› Applying database migrations");
  run("npx", ["prisma", "migrate", "deploy"]);

  console.log("› Seeding system roles");
  run("npx", ["tsx", "prisma/seed.ts"]);

  const db = createScriptClient();
  try {
    const [pages, events] = await Promise.all([db.page.count(), db.event.count()]);
    if (pages === 0 && events === 0) {
      console.log("› Empty database: importing legacy content");
      run("npx", ["tsx", "scripts/import-legacy-content/index.ts"]);
    } else {
      console.log(`› Content present (${pages} pages, ${events} events): skipping legacy import`);
    }

    const users = await db.user.count();
    const { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME } = process.env;
    if (users === 0 && ADMIN_EMAIL && ADMIN_PASSWORD) {
      console.log(`› No users: creating Super Admin ${ADMIN_EMAIL}`);
      run("npx", ["tsx", "scripts/create-admin.ts", `--email=${ADMIN_EMAIL}`, `--name=${ADMIN_NAME ?? "Site Admin"}`]);
    } else if (users === 0) {
      console.log("› No users yet. Set ADMIN_EMAIL and ADMIN_PASSWORD and redeploy, or run npm run admin:create.");
    }
  } finally {
    await db.$disconnect();
  }
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
