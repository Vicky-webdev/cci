import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { publishedWhere } from "@/lib/content/publishing";
import { siteUrl } from "@/lib/env";

export const dynamic = "force-dynamic";

const FIXED_ROUTES: Record<string, string> = { home: "/" };

/** Published, indexable, canonical URLs only (drafts, noindex and admin routes excluded). */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const live = publishedWhere();
  const [pages, events, news, press] = await Promise.all([
    db.page.findMany({ where: { ...live, noindex: false }, select: { slug: true, updatedAt: true, canonicalUrl: true } }),
    db.event.findMany({ where: { ...live, noindex: false }, select: { slug: true, updatedAt: true } }),
    db.newsArticle.findMany({ where: { ...live, noindex: false }, select: { slug: true, updatedAt: true } }),
    db.pressItem.findMany({ where: { ...live, noindex: false }, select: { slug: true, updatedAt: true } }),
  ]);
  return [
    ...pages
      .filter((p) => !p.canonicalUrl)
      .map((p) => ({ url: siteUrl(FIXED_ROUTES[p.slug] ?? `/${p.slug}`), lastModified: p.updatedAt, priority: p.slug === "home" ? 1 : 0.7 })),
    ...events.map((e) => ({ url: siteUrl(`/events/${e.slug}`), lastModified: e.updatedAt, priority: 0.6 })),
    ...news.map((n) => ({ url: siteUrl(`/news/${n.slug}`), lastModified: n.updatedAt, priority: 0.6 })),
    ...press.map((p) => ({ url: siteUrl(`/press/${p.slug}`), lastModified: p.updatedAt, priority: 0.5 })),
  ];
}
