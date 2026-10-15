import { describe, expect, it } from "vitest";
import { assetUrl, cssUrl, legacyHrefToNew, rewriteHtmlLinks, slugifyId } from "@/lib/links";

describe("legacyHrefToNew", () => {
  it.each([
    ["about.html", "/about"],
    ["about.html#team", "/about#team"],
    ["index.html", "/"],
    ["/news-detail.html?id=economics-of-indian-craft-landmark-report", "/news/economics-of-indian-craft-landmark-report"],
    ["event-detail.html?id=Kamala-Awards-2025", "/events/kamala-awards-2025"],
    ["press-details.html?id=c4c-2025", "/press/c4c-2025"],
    ["https://www.craftscouncilofindia.in/awards.html#kamala-call", "/awards#kamala-call"],
    ["https://craftscouncilofindia.in", "/"],
    ["docs/CCI Newsletter June 2025.pdf", "/docs/CCI%20Newsletter%20June%202025.pdf"],
    ["https://kamalacrafts.com", "https://kamalacrafts.com"],
    ["#", "#"],
    ["mailto:info@craftscouncilofindia.in", "mailto:info@craftscouncilofindia.in"],
  ])("%s → %s", (input, expected) => expect(legacyHrefToNew(input)).toBe(expected));
});

describe("assetUrl", () => {
  it("encodes spaces and makes paths root-absolute", () => {
    expect(assetUrl("images/News letter images/a b.webp")).toBe("/images/News%20letter%20images/a%20b.webp");
  });
  it("does not double-encode", () => {
    expect(assetUrl("images/a%20b.jpg")).toBe("/images/a%20b.jpg");
  });
  it("leaves absolute URLs alone and handles empty values", () => {
    expect(assetUrl("https://x.test/a.jpg")).toBe("https://x.test/a.jpg");
    expect(assetUrl("")).toBe("");
    expect(cssUrl("")).toBe("");
  });
  it("escapes # and ? that are part of file names", () => {
    expect(assetUrl("images/a#1.jpg")).toBe("/images/a%231.jpg");
  });
});

describe("slugifyId / rewriteHtmlLinks", () => {
  it("slugifies legacy ids", () => {
    expect(slugifyId("A-Symposium-on-The-Future-of-Handmade")).toBe("a-symposium-on-the-future-of-handmade");
    expect(slugifyId("Café  Crafts!")).toBe("cafe-crafts");
  });
  it("rewrites hrefs and relative srcs in stored HTML", () => {
    expect(rewriteHtmlLinks('<a href="awards.html">x</a><img src="images/x y.jpg">')).toBe('<a href="/awards">x</a><img src="/images/x%20y.jpg">');
  });
});
