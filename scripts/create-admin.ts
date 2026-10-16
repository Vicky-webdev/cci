/**
 * Provision an administrator account from the command line (there is no public sign-up).
 *   npm run admin:create -- --email=you@example.org --name="Your Name" [--role=super_admin]
 * The password is read from the ADMIN_PASSWORD environment variable or prompted for,
 * so it never appears in shell history or process lists.
 */
import { createInterface } from "node:readline/promises";
import { hash } from "@node-rs/argon2";
import { createScriptClient } from "./lib/db";

const arg = (n: string) => process.argv.find((a) => a.startsWith(`--${n}=`))?.split("=").slice(1).join("=");

function strength(p: string): string | null {
  if (p.length < 12) return "Password must be at least 12 characters.";
  const classes = [/[a-z]/, /[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/].filter((re) => re.test(p)).length;
  return classes < 3 ? "Use at least three of: lowercase, uppercase, digits, symbols." : null;
}

async function main() {
  const email = arg("email")?.trim().toLowerCase();
  const name = arg("name")?.trim();
  const roleKey = arg("role") ?? "super_admin";
  if (!email || !name) throw new Error('Usage: npm run admin:create -- --email=… --name="…" [--role=super_admin]');
  let password = process.env.ADMIN_PASSWORD ?? "";
  if (!password) {
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    password = await rl.question("Password (min 12 chars): ");
    rl.close();
  }
  const weak = strength(password);
  if (weak) throw new Error(weak);
  const db = createScriptClient();
  try {
    const role = await db.role.findUnique({ where: { key: roleKey } });
    if (!role) throw new Error(`Role "${roleKey}" not found — run npm run db:seed first.`);
    if (await db.user.findUnique({ where: { email } })) throw new Error(`A user with ${email} already exists.`);
    const passwordHash = await hash(password, { memoryCost: 19456, timeCost: 2, parallelism: 1 });
    const user = await db.user.create({ data: { email, name, passwordHash, roles: { create: { roleId: role.id } } } });
    await db.auditLog.create({ data: { actorId: user.id, action: "users.create.cli", entityType: "users", entityId: user.id, summary: `Created ${email} (${roleKey}) from the command line` } });
    console.log(`Created ${email} with role ${roleKey}.`);
  } finally {
    await db.$disconnect();
  }
}

main().catch((e) => {
  console.error(e.message ?? e);
  process.exitCode = 1;
});
