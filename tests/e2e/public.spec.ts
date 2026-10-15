import { expect, test } from "@playwright/test";
import { watchErrors } from "./helpers";

const PAGES: [string, string][] = [
  ["/", "Preserving and Sustaining"],
  ["/about", "About CCI"],
  ["/what-we-do", "What We Do"],
  ["/awards", "Kamala Awards"],
  ["/past-awards", "Kamala Awards"],
  ["/events", "Events & Exhibitions"],
  ["/past-events", "Past Events Archive"],
  ["/news", "News"],
  ["/press", "Press & Media"],
  ["/books", "Books"],
  ["/newsletters", "Newsletters"],
  ["/past-newsletters", "Newsletters"],
  ["/happenings-in-handmade", "Happenings in Handmade"],
  ["/past-happenings-in-handmade", "Happenings in Handmade"],
  ["/reports", "Reports"],
  ["/crafts-map", "Indian Crafts Map"],
  ["/craft-processes", "Craft Processes"],
  ["/contact", "Get in Touch"],
  ["/privacy-policy", "Privacy Policy"],
  ["/disclaimer", "Terms & Conditions"],
  ["/events/kamala-awards-2025", "Kamala Awards Ceremony 2024 - 2025"],
  ["/events/ugadi-celebrations-with-andhra-food", "Ugadi Celebrations"],
  ["/news/economics-of-indian-craft-landmark-report", "Economics of Indian Craft"],
  ["/press/c4c-2025", "C4C 2025"],
  ["/press/1980-1990-archive", "1980 - 1990 Archive"],
];

for (const [path, heading] of PAGES) {
  test(`renders ${path} without errors`, async ({ page }) => {
    const errors = watchErrors(page);
    const res = await page.goto(path);
    expect(res?.status()).toBe(200);
    await expect(page.locator("h1").first()).toContainText(heading);
    await expect(page.locator("#main-nav")).toBeVisible();
    await expect(page.locator("footer")).toContainText("Crafts Council of India");
    expect(errors).toEqual([]);
  });
}

test("content is server-rendered (visible without JavaScript)", async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto("/events");
  expect(await page.locator(".event-card").count()).toBe(43);
  await page.goto("/events/kamala-awards-2025");
  await expect(page.locator(".ed-person")).toHaveCount(7);
  await ctx.close();
});

test("events filters behave like the legacy page", async ({ page }) => {
  await page.goto("/events");
  const cards = page.locator("#eventsGrid .event-card");
  await expect(cards).toHaveCount(43);
  await page.getByRole("button", { name: "Workshops" }).click();
  const n = await cards.count();
  expect(n).toBeGreaterThan(0);
  expect(n).toBeLessThan(43);
  await page.getByRole("button", { name: "All Events" }).click();
  await expect(cards).toHaveCount(43);
});

test("past events load six at a time", async ({ page }) => {
  await page.goto("/past-events");
  const cards = page.locator("#eventsGrid .event-card");
  await expect(cards).toHaveCount(6);
  await page.getByRole("button", { name: "Load More Events" }).click();
  await expect(cards).toHaveCount(12);
});

test("press year filter", async ({ page }) => {
  await page.goto("/press");
  await page.getByRole("button", { name: "1980 - 1990" }).click();
  await expect(page.locator("#pressGrid .event-card")).toHaveCount(1);
});

test("gallery lightbox opens, navigates and closes with the keyboard", async ({ page }) => {
  await page.goto("/events/kamala-awards-2025");
  await page.locator(".ed-gallery-item").first().click();
  const box = page.locator("#lightbox");
  await expect(box).toHaveClass(/active/);
  const first = await page.locator("#lightboxImg").getAttribute("src");
  await page.keyboard.press("ArrowRight");
  await expect(page.locator("#lightboxImg")).not.toHaveAttribute("src", first ?? "");
  await page.keyboard.press("Escape");
  await expect(box).not.toHaveClass(/active/);
});

test("crafts map: tooltip on hover, district table on click", async ({ page }) => {
  await page.goto("/crafts-map");
  const kerala = page.locator('path[data-state="kl"]');
  await kerala.hover();
  await expect(page.locator("#mapTooltip")).toContainText("Kerala");
  await kerala.click();
  await expect(page.locator(".sidebar-state-name")).toHaveText("Kerala");
  expect(await page.locator(".craft-table tbody tr").count()).toBeGreaterThan(3);
});

test("craft process panel opens and closes", async ({ page }) => {
  await page.goto("/craft-processes");
  await expect(page.locator(".process-card")).toHaveCount(16);
  await page.locator(".process-card").first().click();
  await expect(page.locator("#detailPanel")).toHaveClass(/open/);
  await page.keyboard.press("Escape");
  await expect(page.locator("#detailPanel")).not.toHaveClass(/open/);
});

test("publications link to existing PDFs", async ({ page, request }) => {
  await page.goto("/newsletters");
  const hrefs = await page.locator(".nl-card-read, .nl-latest-actions a").evaluateAll((els) => els.map((e) => (e as HTMLAnchorElement).getAttribute("href")));
  expect(hrefs.length).toBeGreaterThan(3);
  for (const href of hrefs) expect((await request.head(href!)).status(), href!).toBe(200);
});

test("mobile menu opens, expands a submenu and closes on outside click", async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  await page.goto("/");
  await expect(page.locator(".nav-center")).toBeHidden();
  await page.getByRole("button", { name: "Open menu" }).click();
  await expect(page.locator("#mobileMenu")).toHaveClass(/active/);
  await page.locator("#mobileMenu").getByRole("button", { name: "Resources" }).click();
  await expect(page.locator("#mobileMenu .mobile-submenu.open")).toContainText("Books");
  await page.mouse.click(200, 800);
  await expect(page.locator("#mobileMenu")).not.toHaveClass(/active/);
  await ctx.close();
});

test("unknown pages return the 404 page", async ({ page }) => {
  const res = await page.goto("/this-page-does-not-exist");
  expect(res?.status()).toBe(404);
  await expect(page.locator("h1")).toContainText("Page not found");
});
