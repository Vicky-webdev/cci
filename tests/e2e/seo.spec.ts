import { expect, test } from "@playwright/test";

const REDIRECTS: [string, string][] = [
  ["/index.html", "/"],
  ["/about.html", "/about"],
  ["/what-we-do.html", "/what-we-do"],
  ["/past-happenings-in-handmade.html", "/past-happenings-in-handmade"],
  ["/disclaimer.html", "/disclaimer"],
  ["/event-detail.html?id=kamala-awards-2025", "/events/kamala-awards-2025"],
  ["/news-detail.html?id=A-Symposium-on-The-Future-of-Handmade", "/news/a-symposium-on-the-future-of-handmade"],
  ["/press-details.html?id=c4c-2025", "/press/c4c-2025"],
  ["/event/ugadi-celebrations-with-andhra-food", "/events/ugadi-celebrations-with-andhra-food"],
  ["/news/A-Symposium-on-The-Future-of-Handmade", "/news/a-symposium-on-the-future-of-handmade"],
];

for (const [from, to] of REDIRECTS) {
  test(`permanent redirect ${from}`, async ({ request }) => {
    const res = await request.get(from, { maxRedirects: 0 });
    expect([301, 308]).toContain(res.status());
    expect(new URL(res.headers()["location"], "http://x").pathname).toBe(to);
    const final = await request.get(from);
    expect(final.status()).toBe(200);
  });
}

test("legacy asset URLs are unchanged", async ({ request }) => {
  for (const p of ["/images/cci-logo.png", "/images/favico.png", "/docs/Ebook-CCI-60years.pdf", "/images/News%20letter%20images/CCI%20Newsletter%20June%202025.webp"]) {
    expect((await request.head(p)).status(), p).toBe(200);
  }
});

test("page metadata: unique title, description, canonical, Open Graph", async ({ page }) => {
  const seen = new Set<string>();
  for (const path of ["/", "/about", "/events", "/events/kamala-awards-2025", "/news/economics-of-indian-craft-landmark-report"]) {
    await page.goto(path);
    const title = await page.title();
    expect(title.length).toBeGreaterThan(5);
    seen.add(title);
    expect(await page.locator('meta[name="description"]').getAttribute("content")).toBeTruthy();
    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(new URL(canonical!).pathname).toBe(path);
    expect(await page.locator('meta[property="og:title"]').getAttribute("content")).toBeTruthy();
  }
  expect(seen.size).toBe(5);
});

test("legacy page titles are preserved", async ({ page }) => {
  await page.goto("/about");
  await expect(page).toHaveTitle("About Us - Crafts Council of India");
  await page.goto("/crafts-map");
  await expect(page).toHaveTitle("Crafts Map of India - Statewise crafts data of India");
});

test("structured data: Organization, Event and BreadcrumbList", async ({ page }) => {
  await page.goto("/events/kamala-awards-2025");
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
  const types = blocks.flatMap((b) => [JSON.parse(b)].flat().map((x: { "@type": string }) => x["@type"]));
  expect(types).toEqual(expect.arrayContaining(["Organization", "Event", "BreadcrumbList"]));
  const event = blocks.flatMap((b) => [JSON.parse(b)].flat()).find((x) => x["@type"] === "Event");
  expect(event.startDate).toBe("2026-03-21");
  const org = blocks.flatMap((b) => [JSON.parse(b)].flat()).find((x) => x["@type"] === "Organization");
  expect(org.logo).toMatch(/\/images\/cci-logo\.png$/);
});

test("sitemap lists published canonical URLs only", async ({ request }) => {
  const xml = await (await request.get("/sitemap.xml")).text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
  expect(urls.length).toBe(155);
  expect(urls).toContain("/");
  expect(urls).toContain("/events/kamala-awards-2025");
  expect(urls.some((u) => u.startsWith("/admin") || u.startsWith("/preview"))).toBe(false);
  expect(urls.some((u) => u.endsWith(".html"))).toBe(false);
});

test("robots.txt blocks everything outside production", async ({ request }) => {
  const txt = await (await request.get("/robots.txt")).text();
  expect(txt).toMatch(/Disallow: \/\s*$/m);
});

test("non-production pages carry noindex; admin is never indexable", async ({ page, request }) => {
  await page.goto("/");
  expect(await page.locator('meta[name="robots"]').getAttribute("content")).toContain("noindex");
  const res = await request.get("/admin/login");
  expect(res.headers()["x-robots-tag"]).toContain("noindex");
});

test("security headers are set", async ({ request }) => {
  const h = (await request.get("/")).headers();
  expect(h["x-frame-options"]).toBe("SAMEORIGIN");
  expect(h["x-content-type-options"]).toBe("nosniff");
  expect(h["content-security-policy"]).toContain("frame-ancestors 'self'");
  expect(h["x-powered-by"]).toBeUndefined();
});

test("craft-data.json keeps the legacy shape", async ({ request }) => {
  const data = (await (await request.get("/craft-data.json")).json()) as { state: string; crafts: unknown[] }[];
  expect(data.length).toBe(34);
  expect(data.find((s) => s.state === "Odisha")?.crafts.length).toBeGreaterThan(100);
});
