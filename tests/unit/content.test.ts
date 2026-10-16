import { describe, expect, it } from "vitest";
import { sectionsSchema, readSections, SECTION_DEFS } from "@/lib/content/sections";
import { sanitizeSections } from "@/lib/content/sections-sanitize";
import { recordSchema } from "@/lib/admin/fields";
import { resourceByKey, RESOURCES } from "@/lib/admin/resources";
import { contactEmailHtml, contactSchema } from "@/lib/forms/contact";

describe("page sections", () => {
  it("validates known section types and required fields", () => {
    expect(sectionsSchema.safeParse([{ id: "a", type: "pageHero", data: { title: "Hi" } }]).success).toBe(true);
    expect(sectionsSchema.safeParse([{ id: "a", type: "pageHero", data: {} }]).success).toBe(false);
    expect(sectionsSchema.safeParse([{ id: "a", type: "nope", data: {} }]).success).toBe(false);
  });
  it("sanitizes HTML fields and drops unknown keys", () => {
    const [s] = sanitizeSections([{ id: "a", type: "richText", data: { html: "<p>x<script>1</script></p>", junk: "y" } }]);
    expect(s.data).toEqual({ html: "<p>x</p>" });
  });
  it("skips corrupt sections when reading instead of crashing a page", () => {
    expect(readSections([{ type: "pageHero", id: "1", data: {} }, { bad: true }, null])).toHaveLength(1);
    expect(readSections("not an array")).toEqual([]);
  });
  it("every section field name is unique within its section", () => {
    for (const d of SECTION_DEFS) expect(new Set(d.fields.map((f) => f.name)).size, d.type).toBe(d.fields.length);
  });
});

describe("resource schemas", () => {
  it("builds a validator for every registered resource", () => {
    for (const r of RESOURCES) expect(() => recordSchema(r.fieldsets)).not.toThrow();
  });
  it("rejects invalid slugs and accepts good ones", () => {
    const schema = recordSchema(resourceByKey("events")!.fieldsets);
    expect(schema.safeParse({ title: "T", slug: "Bad Slug" }).success).toBe(false);
    expect(schema.safeParse({ title: "T", slug: "good-slug-2026" }).success).toBe(true);
  });
  it("requires a title", () => {
    expect(recordSchema(resourceByKey("news")!.fieldsets).safeParse({ slug: "x" }).success).toBe(false);
  });
});

describe("contact form", () => {
  it("validates required fields like send_enquiry.php did", () => {
    expect(contactSchema.safeParse({ full_name: "", email: "a@b.co", subject: "s", message: "m" }).success).toBe(false);
    expect(contactSchema.safeParse({ full_name: "A", email: "nope", subject: "s", message: "m" }).success).toBe(false);
    expect(contactSchema.safeParse({ full_name: "A", email: "a@b.co", subject: "s", message: "m" }).success).toBe(true);
  });
  it("escapes HTML in the notification email", () => {
    const html = contactEmailHtml({ full_name: "<b>x</b>", email: "a@b.co", phone: "", subject: "s", message: "<script>1</script>\nline" });
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;b&gt;x&lt;/b&gt;");
    expect(html).toContain("line");
  });
});
