import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { allFields } from "@/lib/admin/fields";
import { RESOURCES } from "@/lib/admin/resources";

// Maps each admin resource to its Prisma model and fields that are persisted as relations.
const MODEL: Record<string, string> = {
  pages: "Page", events: "Event", news: "NewsArticle", press: "PressItem", publications: "Publication",
  awards: "AwardRecipient", "award-categories": "AwardCategory", artisans: "Artisan", team: "TeamMember",
  councils: "StateCouncil", "craft-states": "CraftState", processes: "CraftProcess", "menu-items": "MenuItem", redirects: "Redirect",
};

const schema = fs.readFileSync("prisma/schema.prisma", "utf8");
function modelFields(name: string): Set<string> {
  const block = schema.match(new RegExp(`model ${name} \\{([\\s\\S]*?)\\n\\}`))?.[1] ?? "";
  return new Set(block.split("\n").map((l) => l.trim().split(/\s+/)[0]).filter((w) => /^[a-z]\w*$/.test(w)));
}

describe("admin registry ↔ database schema", () => {
  for (const def of RESOURCES) {
    it(`${def.key}: every editable field exists on ${MODEL[def.key]}`, () => {
      const fields = modelFields(MODEL[def.key]);
      expect(fields.size).toBeGreaterThan(3);
      const missing = allFields(def.fieldsets)
        .filter((f) => f.type !== "readonly")
        .map((f) => f.name)
        .filter((n) => !fields.has(n));
      expect(missing).toEqual([]);
    });
  }
});
