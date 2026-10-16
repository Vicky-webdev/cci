/**
 * Safe, repeatable seed: creates the system roles if they are missing and keeps
 * Super Admin at "*". Never creates users, never touches content.
 *   npm run db:seed
 */
import { createScriptClient } from "../scripts/lib/db";
import { SYSTEM_ROLES } from "../src/lib/auth/permissions";

const db = createScriptClient();

async function main() {
  for (const role of SYSTEM_ROLES) {
    const existing = await db.role.findUnique({ where: { key: role.key } });
    if (!existing) {
      await db.role.create({ data: { ...role, isSystem: true } });
      console.log(`created role ${role.key}`);
    } else if (role.key === "super_admin" && existing.permissions.join() !== "*") {
      await db.role.update({ where: { key: role.key }, data: { permissions: ["*"] } });
      console.log("restored super_admin permissions");
    } else {
      console.log(`role ${role.key} exists — left unchanged`);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
