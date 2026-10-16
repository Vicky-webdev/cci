import { expect, test } from "@playwright/test";
import { login } from "./helpers";

test("author drafts, cannot publish, reviewer publishes, site updates", async ({ page, browser }) => {
  const slug = `e2e-workshop-${Date.now()}`;
  const title = `E2E Weaving Workshop ${Date.now()}`;
  await login(page, "author");
  await page.goto("/admin/content/events/new");
  await page.getByLabel("Title *").fill(title);
  await page.getByLabel("Slug (URL)").fill(slug);
  await page.getByLabel("Dates as displayed").fill("9–12 December 2099");
  await page.getByLabel("Venue").fill("Kamala Crafts Shop");
  await page.getByLabel("City").fill("Chennai");
  await page.getByRole("button", { name: "Create event" }).click();
  await expect(page).toHaveURL(/\/admin\/content\/events\/[a-z0-9]+\?created=1/);
  const editUrl = page.url().split("?")[0];
  // Author has no "Save & publish" and the status menu only offers draft/review.
  await expect(page.getByRole("button", { name: "Save & publish" })).toHaveCount(0);
  await page.getByRole("button", { name: "Submit for review" }).click();
  await expect(page.getByRole("status")).toContainText("Saved");

  // Not public yet.
  const anon = await browser.newContext();
  expect((await (await anon.newPage()).goto(`/events/${slug}`))?.status()).toBe(404);

  await login(page, "reviewer");
  await page.goto("/admin");
  await expect(page.getByRole("link", { name: title })).toBeVisible();
  await page.goto(editUrl);
  await page.getByRole("button", { name: "Approve & publish" }).click();
  await expect(page.getByRole("status")).toContainText("Published");

  const pub = await anon.newPage();
  expect((await pub.goto(`/events/${slug}`))?.status()).toBe(200);
  await expect(pub.locator("h1")).toHaveText(title);
  // The free-text date was parsed, so it is upcoming and on the home page grid.
  await pub.goto("/events");
  await pub.getByRole("button", { name: "Upcoming" }).click();
  await expect(pub.locator("#eventsGrid")).toContainText(title);
  await anon.close();
});

test("author cannot edit someone else's event", async ({ page }) => {
  await login(page, "author");
  await page.goto("/admin/content/events?q=Kamala%20Awards%20Ceremony");
  await page.locator("table a").first().click();
  await expect(page.getByText(/view this event but not change it/)).toBeVisible();
});

test("editor edits a page section; revision history can restore it", async ({ page }) => {
  await login(page, "editor");
  await page.goto("/admin/content/pages?q=about");
  await page.getByRole("link", { name: "About", exact: true }).click();
  await page.getByRole("button", { name: "Edit" }).first().click();
  const title = page.getByLabel("Title *").nth(1);
  await title.fill("About CCI (edited)");
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByRole("status")).toContainText("Saved");
  await page.goto("/about");
  await expect(page.locator("h1")).toHaveText("About CCI (edited)");

  await page.goBack();
  await page.reload();
  page.once("dialog", (d) => d.accept());
  await page.getByRole("button", { name: "Restore this version" }).first().click();
  await expect(page.getByText("Restored.")).toBeVisible();
  await page.goto("/about");
  await expect(page.locator("h1")).toHaveText("About CCI");
});

test("invalid input is rejected with field errors", async ({ page }) => {
  await login(page, "editor");
  await page.goto("/admin/content/news/new");
  await page.getByLabel("Title *").fill("x");
  await page.getByLabel("Slug (URL)").fill("Not A Valid Slug!");
  await page.getByRole("button", { name: "Create news article" }).click();
  await expect(page.locator(".a-alert.error")).toContainText("correct the highlighted fields");
  await expect(page.getByText("Lowercase letters, numbers and hyphens only")).toBeVisible();
});

test("stored XSS is neutralised end to end", async ({ page }) => {
  const slug = `e2e-xss-${Date.now()}`;
  await login(page, "editor");
  await page.goto("/admin/content/news/new");
  await page.getByLabel("Title *").fill("XSS probe");
  await page.getByLabel("Slug (URL)").fill(slug);
  await page.getByRole("button", { name: "HTML" }).first().click();
  await page.locator("textarea#f-bodyHtml").fill('<p>safe</p><script>window.__xss=1</script><img src=x onerror="window.__xss=1">');
  await page.getByRole("button", { name: "Save & publish" }).click();
  await expect(page).toHaveURL(/created=1/);
  await page.goto(`/news/${slug}`);
  await expect(page.locator(".ed-description")).toContainText("safe");
  expect(await page.evaluate(() => (window as unknown as { __xss?: number }).__xss)).toBeUndefined();
  expect(await page.locator(".ed-description script").count()).toBe(0);
});

test("settings changes appear on the site and are audited", async ({ page }) => {
  await login(page, "admin");
  await page.goto("/admin/settings");
  await page.getByLabel("Footer copyright line").fill("© Crafts Council of India, 2026. E2E.");
  await page.getByRole("button", { name: "Save settings" }).click();
  await expect(page.getByRole("status")).toContainText("Saved");
  await page.goto("/");
  await expect(page.locator(".f-copy")).toContainText("E2E.");
  await page.goto("/admin/audit?action=settings.");
  await expect(page.locator("table")).toContainText("site.copyright");
});
