import "server-only";
import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";
import { assetUrl } from "@/lib/links";
import { toPlainText } from "@/lib/sanitize";

interface SeoInput {
  /** Full <title>; used verbatim when set (legacy titles already include the site name). */
  metaTitle?: string | null;
  /** Fallback title passed through the site title template. */
  title: string;
  description?: string | null;
  path: string;
  image?: string | null;
  noindex?: boolean;
  type?: "website" | "article";
}

export async function buildMetadata(input: SeoInput): Promise<Metadata> {
  const s = await getSettings();
  const description = toPlainText(input.description || s["seo.defaultDescription"]).slice(0, 300);
  const image = assetUrl(input.image || s["seo.defaultOgImage"]);
  const title = input.metaTitle?.trim() ? { absolute: input.metaTitle.trim() } : input.title;
  const ogTitle = input.metaTitle?.trim() || s["seo.titleTemplate"].replace("%s", input.title);
  return {
    title,
    description,
    alternates: { canonical: input.path },
    openGraph: { title: ogTitle, description, url: input.path, type: input.type ?? "website", images: image ? [image] : undefined },
    twitter: { card: "summary_large_image", title: ogTitle, description, images: image ? [image] : undefined },
    robots: input.noindex ? { index: false, follow: true } : undefined,
  };
}

/** Description fallback for CMS pages: the first sizeable text in their sections. */
export function pageDescription(page: { metaDescription: string | null; sections: { type: string; data: Record<string, unknown> }[] }) {
  if (page.metaDescription) return page.metaDescription;
  const hero = page.sections.find((s) => s.type === "pageHero" || s.type === "heroSlider");
  const d = hero?.data ?? {};
  return String(d.subtitle ?? d.description ?? "") || null;
}
