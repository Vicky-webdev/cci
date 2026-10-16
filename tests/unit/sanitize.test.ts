import { describe, expect, it } from "vitest";
import { sanitizeInline, sanitizeRichText, toPlainText, toYouTubeEmbed } from "@/lib/sanitize";

describe("sanitizeRichText", () => {
  it("removes scripts, event handlers and javascript: URLs", () => {
    const out = sanitizeRichText('<p onclick="x()">Hi<script>alert(1)</script><a href="javascript:alert(1)">l</a><img src=x onerror=alert(1)></p>');
    expect(out).not.toMatch(/script|onclick|onerror|javascript:/i);
    expect(out).toContain("<p>Hi");
  });
  it("keeps YouTube iframes and adds the attributes YouTube requires", () => {
    const out = sanitizeRichText('<iframe src="https://www.youtube.com/embed/abc" allowfullscreen></iframe>');
    expect(out).toContain('src="https://www.youtube.com/embed/abc"');
    expect(out).toContain('referrerpolicy="strict-origin-when-cross-origin"');
    expect(out).toContain("loading=\"lazy\"");
  });
  it("drops iframes from other hosts", () => {
    expect(sanitizeRichText('<iframe src="https://evil.test/x"></iframe>')).not.toContain("evil.test");
  });
  it("adds rel=noopener to target=_blank links", () => {
    expect(sanitizeRichText('<a href="https://x.test" target="_blank">x</a>')).toContain('rel="noopener noreferrer"');
  });
  it("keeps safe inline styles and drops dangerous ones", () => {
    const out = sanitizeRichText('<p style="margin-bottom:20px;background:url(javascript:x)">x</p>');
    expect(out).toContain("margin-bottom:20px");
    expect(out).not.toContain("javascript");
  });
});

describe("sanitizeInline / toPlainText / toYouTubeEmbed", () => {
  it("allows only inline formatting", () => {
    expect(sanitizeInline("<h1>T</h1><em>a</em><br>b")).toBe("T<em>a</em><br />b");
  });
  it("produces plain text", () => {
    expect(toPlainText("<p>A &amp; B</p>\n<p>C</p>")).toBe("A & B C");
  });
  it.each([
    ["https://youtu.be/qb6fqFsqeAc?si=x", "https://www.youtube.com/embed/qb6fqFsqeAc"],
    ["https://www.youtube.com/watch?v=abc123", "https://www.youtube.com/embed/abc123"],
    ["https://www.youtube.com/embed/xyz", "https://www.youtube.com/embed/xyz"],
    ["https://vimeo.com/1", null],
  ])("%s", (input, expected) => expect(toYouTubeEmbed(input)).toBe(expected));
});
