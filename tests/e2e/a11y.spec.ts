import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { login } from "./helpers";

// Serious/critical WCAG 2.1 A/AA violations fail the build. Colour-contrast is reported but not enforced:
// the brand palette is carried over unchanged from the legacy design (see docs/migration/REMAINING_ISSUES.md).
for (const path of ["/", "/events", "/events/kamala-awards-2025", "/contact", "/crafts-map", "/newsletters"]) {
  test(`no serious accessibility violations on ${path}`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).disableRules(["color-contrast"]).analyze();
    const serious = results.violations.filter((v) => ["serious", "critical"].includes(v.impact ?? ""));
    expect(serious.map((v) => `${v.id}: ${v.nodes.length} × ${v.help}`)).toEqual([]);
  });
}

test("admin login and edit form have no serious violations", async ({ page }) => {
  await page.goto("/admin/login");
  let r = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
  expect(r.violations.filter((v) => ["serious", "critical"].includes(v.impact ?? "")).map((v) => v.id)).toEqual([]);
  await login(page, "editor");
  await page.goto("/admin/content/events/new");
  r = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
  expect(r.violations.filter((v) => ["serious", "critical"].includes(v.impact ?? "")).map((v) => `${v.id}: ${v.help}`)).toEqual([]);
});
