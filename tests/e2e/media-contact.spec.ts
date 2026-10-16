import { expect, test } from "@playwright/test";
import { login } from "./helpers";

// 1×1 PNG
const PNG = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==", "base64");

test("upload validates file contents, dedupes, serves and deletes", async ({ page }) => {
  await login(page, "media");
  const origin = new URL(page.url()).origin;
  const bad = await page.request.post("/api/admin/media", {
    headers: { origin },
    multipart: { file: { name: "evil.png", mimeType: "image/png", buffer: Buffer.from("<script>alert(1)</script>".padEnd(64, " ")) } },
  });
  expect(bad.status()).toBe(422);
  const html = await page.request.post("/api/admin/media", {
    headers: { origin },
    multipart: { file: { name: "page.svg", mimeType: "image/svg+xml", buffer: Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"><script>1</script></svg>') } },
  });
  expect(html.status()).toBe(422);

  const ok = await page.request.post("/api/admin/media", { headers: { origin }, multipart: { file: { name: "Tiny Pixel.png", mimeType: "image/png", buffer: PNG } } });
  expect(ok.status()).toBe(200);
  const { item, reused } = await ok.json();
  expect(reused).toBe(false);
  expect(item.path).toMatch(/^uploads\/\d{4}\/\d{2}\/[0-9a-f]{8}-tiny-pixel\.png$/);
  const again = await page.request.post("/api/admin/media", { headers: { origin }, multipart: { file: { name: "copy.png", mimeType: "image/png", buffer: PNG } } });
  expect((await again.json()).reused).toBe(true);

  const served = await page.request.get(item.url);
  expect(served.status()).toBe(200);
  expect(served.headers()["content-type"]).toBe("image/png");
  expect(served.headers()["x-content-type-options"]).toBe("nosniff");
  expect((await page.request.get("/uploads/../../etc/passwd")).status()).toBe(404);

  await page.goto("/admin/media?storage=LOCAL");
  await page.locator(".a-media-tile").first().click();
  await page.getByLabel("Alt text").fill("A single pixel");
  await page.getByRole("button", { name: "Save details" }).click();
  await expect(page.getByText("Saved.")).toBeVisible();
  page.once("dialog", (d) => d.accept());
  await page.getByRole("button", { name: "Delete file" }).click();
  await expect(page).toHaveURL(/\/admin\/media$/);
  expect((await page.request.get(item.url)).status()).toBe(404);
});

test("legacy originals and referenced files cannot be deleted", async ({ page }) => {
  await login(page, "media");
  await page.goto("/admin/media?q=cci-logo.png&storage=LEGACY");
  await page.locator(".a-media-tile").first().click();
  await expect(page.getByText("Original file from the legacy site (protected)")).toBeVisible();
  await expect(page.getByRole("button", { name: "Delete file" })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: /Used in/ })).toBeVisible();
});

test("contact form validates, stores the enquiry and shows success", async ({ page }) => {
  await page.goto("/contact");
  await page.getByLabel("Full Name *").fill("E2E Visitor");
  await page.getByLabel("Email Address *").fill("visitor@e2e.test");
  await page.getByLabel("Subject *").fill("Partnership enquiry");
  await page.getByLabel("Message *").fill("Hello <b>CCI</b>");
  await page.getByRole("button", { name: "Send Message" }).click();
  await expect(page.locator("#formMessage")).toContainText("Message sent successfully");

  await login(page, "super");
  await page.goto("/admin/submissions");
  await page.getByRole("link", { name: "E2E Visitor" }).click();
  await expect(page.getByText("Hello <b>CCI</b>")).toBeVisible(); // rendered as text, not HTML
  const csv = await page.request.get("/api/admin/submissions/export");
  expect(csv.headers()["content-type"]).toContain("text/csv");
  expect(await csv.text()).toContain("visitor@e2e.test");
});

test("contact API rejects cross-site posts, honeypot and bad input", async ({ request, baseURL }) => {
  const form = { full_name: "A", email: "a@b.co", subject: "s", message: "m" };
  expect((await request.post("/api/contact", { form, headers: { origin: "https://evil.example" } })).status()).toBe(403);
  const bot = await request.post("/api/contact", { form: { ...form, website: "http://spam" }, headers: { origin: baseURL! } });
  expect((await bot.json()).success).toBe(true);
  const bad = await request.post("/api/contact", { form: { ...form, email: "nope" }, headers: { origin: baseURL! } });
  expect(bad.status()).toBe(422);
  expect((await request.post("/send_enquiry.php", { form: { ...form, email: "nope" }, headers: { origin: baseURL! } })).status()).toBe(422);
});
