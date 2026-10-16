import fs from "node:fs";
import pg from "pg";

/** Drops the throwaway database created by prepare.ts (and nothing else). */
export default async function teardown() {
  if (process.env.E2E_KEEP_DB) return;
  if (!fs.existsSync(".e2e/env.json")) return;
  const { adminUrl, name } = JSON.parse(fs.readFileSync(".e2e/env.json", "utf8")) as { adminUrl: string; name: string };
  if (!/^cci_e2e_\d+$/.test(name)) return;
  const client = new pg.Client({ connectionString: adminUrl });
  await client.connect();
  await client.query(`DROP DATABASE IF EXISTS "${name}" WITH (FORCE)`);
  await client.end();
  fs.rmSync(".e2e", { recursive: true, force: true });
}
