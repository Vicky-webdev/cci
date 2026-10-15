import { NextResponse, type NextRequest } from "next/server";
import { LEGACY_DETAIL_MAP, slugifyId } from "@/lib/links";

/**
 * Request-time routing that static redirects cannot express:
 *  - legacy detail URLs keyed by query string (event-detail.html?id=…)
 *  - the previous WordPress site's /event/<slug>/ URLs
 *  - the legacy contact endpoint (/send_enquiry.php → /api/contact)
 *  - an optimistic sign-in check for /admin (real authorization happens on the server)
 * Static .html → clean URL redirects live in next.config.ts.
 */
export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  const detailBase = LEGACY_DETAIL_MAP[pathname.replace(/^\//, "")];
  if (detailBase) {
    const id = searchParams.get("id");
    const url = request.nextUrl.clone();
    url.pathname = id ? `${detailBase}/${slugifyId(id)}` : detailBase;
    url.search = "";
    return NextResponse.redirect(url, 308);
  }

  const wp = pathname.match(/^\/event\/([^/]+)\/?$/);
  if (wp) {
    const url = request.nextUrl.clone();
    url.pathname = `/events/${slugifyId(decodeURIComponent(wp[1]))}`;
    url.search = "";
    return NextResponse.redirect(url, 308);
  }

  if (pathname === "/send_enquiry.php") {
    const url = request.nextUrl.clone();
    url.pathname = "/api/contact";
    return NextResponse.rewrite(url);
  }

  if (pathname.startsWith("/admin") && pathname !== "/admin/login" && !request.cookies.has("cci_session")) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = "";
    return NextResponse.redirect(url);
  }

  const res = NextResponse.next();
  if (pathname.startsWith("/admin")) {
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
    res.headers.set("Cache-Control", "no-store");
  }
  return res;
}

export const config = {
  matcher: ["/event-detail.html", "/news-detail.html", "/press-details.html", "/event/:slug*", "/send_enquiry.php", "/admin/:path*"],
};
