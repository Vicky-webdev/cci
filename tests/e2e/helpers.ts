import { expect, type Page } from "@playwright/test";
import { E2E_PASSWORD, E2E_USERS, type E2EUserKey } from "./users";

export async function login(page: Page, key: E2EUserKey) {
  const u = E2E_USERS.find((x) => x.key === key)!;
  await page.context().clearCookies();
  await page.goto("/admin/login");
  await page.getByLabel("Email").fill(u.email);
  await page.getByLabel("Password").fill(E2E_PASSWORD);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/admin$/);
}

/** Collects console errors and failed same-origin requests while a test runs. */
export function watchErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  page.on("console", (m) => {
    // External services (fonts, analytics, Instagram feed, reCAPTCHA) are unreachable in CI sandboxes.
    if (m.type() === "error" && !/ERR_TUNNEL|ERR_NAME_NOT_RESOLVED|ERR_INTERNET|net::ERR_|behold|googletagmanager|google-analytics/i.test(m.text())) errors.push(`console: ${m.text()}`);
  });
  page.on("response", (r) => {
    const u = new URL(r.url());
    if (u.host === new URL(page.url() || "http://localhost").host && r.status() >= 400 && !u.pathname.startsWith("/_next/webpack-hmr")) {
      errors.push(`HTTP ${r.status()} ${u.pathname}`);
    }
  });
  return errors;
}
