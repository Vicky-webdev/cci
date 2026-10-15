import { expect, test } from "@playwright/test";
import { login } from "./helpers";
import { E2E_PASSWORD } from "./users";

test("admin routes redirect to sign-in when signed out", async ({ page }) => {
  await page.goto("/admin/content/events");
  await expect(page).toHaveURL(/\/admin\/login$/);
});

test("there is no public registration", async ({ request }) => {
  for (const p of ["/admin/register", "/admin/signup", "/api/auth/register"]) {
    expect([307, 404]).toContain((await request.get(p, { maxRedirects: 0 })).status());
  }
});

test("wrong password shows a generic error", async ({ page }) => {
  await page.goto("/admin/login");
  await page.getByLabel("Email").fill("editor@e2e.test");
  await page.getByLabel("Password").fill("wrong-password");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.locator(".a-alert.error")).toHaveText("Invalid email or password.");
  await page.getByLabel("Email").fill("nobody@e2e.test");
  await page.getByLabel("Password").fill("wrong-password");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.locator(".a-alert.error")).toHaveText("Invalid email or password.");
});

test("accounts lock after repeated failures", async ({ page }) => {
  await page.goto("/admin/login");
  for (let i = 0; i < 5; i++) {
    await page.getByLabel("Email").fill("lockout@e2e.test");
    await page.getByLabel("Password").fill(`bad-${i}`);
    await Promise.all([page.waitForResponse((r) => r.request().method() === "POST"), page.getByRole("button", { name: "Sign in" }).click()]);
    await expect(page.getByRole("button", { name: "Sign in" })).toBeEnabled();
  }
  // Even the correct password is refused while locked.
  await page.getByLabel("Email").fill("lockout@e2e.test");
  await page.getByLabel("Password").fill(E2E_PASSWORD);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.locator(".a-alert.error")).toContainText("Too many failed sign-in attempts");
});

test("sign in, session cookie flags, sign out revokes the session", async ({ page }) => {
  await login(page, "editor");
  const cookie = (await page.context().cookies()).find((c) => c.name === "cci_session")!;
  expect(cookie.httpOnly).toBe(true);
  expect(cookie.sameSite).toBe("Lax");
  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(page).toHaveURL(/\/admin\/login$/);
  // Replaying the old cookie must not work.
  await page.context().addCookies([cookie]);
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/login$/);
});

test("forged session cookies are rejected", async ({ page, context, baseURL }) => {
  await context.addCookies([{ name: "cci_session", value: "forged-token-value", url: baseURL! }]);
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/login$/);
});
