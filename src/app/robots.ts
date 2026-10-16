import type { MetadataRoute } from "next";
import { env, siteUrl } from "@/lib/env";

export const dynamic = "force-dynamic";

/** Production allows crawling (except admin/API); every other environment blocks everything. */
export default function robots(): MetadataRoute.Robots {
  if (env().SITE_ENV !== "production") {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api/", "/preview/"] }],
    sitemap: siteUrl("/sitemap.xml"),
    host: env().SITE_URL,
  };
}
