import { expect, test } from "@playwright/test";
import { login } from "./helpers";

test("analyst can read but not edit content", async ({ page }) => {
  await login(page, "analyst");
  await page.goto("/admin/content/events");
  await expect(page.getByRole("link", { name: /New event/ })).toHaveCount(0);
  await page.locator("table a").first().click();
  await expect(page.getByText("You can view this event but not change it.")).toBeVisible();
  await expect(page.getByRole("button", { name: "Save changes" })).toHaveCount(0);
});

test("forbidden admin areas are blocked server-side", async ({ page }) => {
  await login(page, "editor");
  for (const p of ["/admin/users", "/admin/roles", "/admin/audit", "/admin/submissions", "/admin/content/redirects/new"]) {
    await page.goto(p);
    await expect(page, p).toHaveURL(/\/admin\/forbidden$/);
  }
  await page.goto("/admin/content/events/new");
  await expect(page.locator("h1")).toContainText("New event");
});

test("media manager cannot open content modules", async ({ page }) => {
  await login(page, "media");
  await page.goto("/admin/content/pages");
  await expect(page).toHaveURL(/\/admin\/forbidden$/);
  await page.goto("/admin/media");
  await expect(page.locator("h1")).toHaveText("Media library");
});

test("APIs refuse unauthenticated and unauthorised callers", async ({ request, page }) => {
  expect((await request.get("/api/admin/media?q=logo")).status()).toBe(403);
  expect((await request.get("/api/admin/submissions/export")).status()).toBe(403);
  expect((await request.get("/api/admin/export/events")).status()).toBe(403);
  await login(page, "author");
  const r = await page.request.get("/api/admin/submissions/export");
  expect(r.status()).toBe(403);
  const e = await page.request.get("/api/admin/export/events");
  expect(e.status()).toBe(403);
});

test("uploads require same-origin requests and upload permission", async ({ page }) => {
  await login(page, "analyst");
  const res = await page.request.post("/api/admin/media", {
    multipart: { file: { name: "a.png", mimeType: "image/png", buffer: Buffer.from("x") } },
    headers: { origin: new URL(page.url()).origin },
  });
  expect(res.status()).toBe(403);
  await login(page, "media");
  const cross = await page.request.post("/api/admin/media", {
    multipart: { file: { name: "a.png", mimeType: "image/png", buffer: Buffer.from("x") } },
    headers: { origin: "https://evil.example" },
  });
  expect(cross.status()).toBe(403);
});

test("only a Super Admin can manage users and roles", async ({ page }) => {
  await login(page, "admin");
  await page.goto("/admin/users");
  await expect(page.locator("h1")).toHaveText("Users");
  await expect(page.getByRole("link", { name: "+ New user" })).toHaveCount(0);
  await page.goto("/admin/roles");
  await expect(page).toHaveURL(/forbidden/);
  await login(page, "super");
  await page.goto("/admin/roles");
  await expect(page.locator("h1")).toContainText("Roles");
});
