/**
 * URL helpers shared by the importer and the renderer.
 *
 * Legacy content uses page-relative links ("about.html", "docs/x.pdf"). Those break on
 * nested routes such as /events/foo, so every stored link is rewritten to a root-absolute
 * clean URL and every stored asset path is turned into an encoded root-absolute URL.
 */

const LEGACY_PAGES: Record<string, string> = {
  "index.html": "/",
  "about.html": "/about",
  "what-we-do.html": "/what-we-do",
  "crafts-map.html": "/crafts-map",
  "craft-processes.html": "/craft-processes",
  "awards.html": "/awards",
  "past-awards.html": "/past-awards",
  "events.html": "/events",
  "past-events.html": "/past-events",
  "news.html": "/news",
  "press.html": "/press",
  "books.html": "/books",
  "newsletters.html": "/newsletters",
  "past-newsletters.html": "/past-newsletters",
  "happenings-in-handmade.html": "/happenings-in-handmade",
  "past-happenings-in-handmade.html": "/past-happenings-in-handmade",
  "reports.html": "/reports",
  "contact.html": "/contact",
  "privacy-policy.html": "/privacy-policy",
  "disclaimer.html": "/disclaimer",
};

const DETAIL_PAGES: Record<string, string> = {
  "event-detail.html": "/events",
  "news-detail.html": "/news",
  "press-details.html": "/press",
};

export const LEGACY_PAGE_MAP = LEGACY_PAGES;
export const LEGACY_DETAIL_MAP = DETAIL_PAGES;

export function slugifyId(id: string): string {
  return id
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const SITE_HOSTS = ["www.craftscouncilofindia.in", "craftscouncilofindia.in"];

/** Maps a legacy href (relative, root-relative or absolute to the CCI domain) to the new URL. Other URLs pass through. */
export function legacyHrefToNew(href: string): string {
  const raw = (href ?? "").trim();
  if (!raw || raw === "#" || raw.startsWith("#") || /^(mailto|tel|javascript):/i.test(raw)) return raw;
  let path = raw;
  if (/^https?:\/\//i.test(raw)) {
    try {
      const u = new URL(raw);
      if (!SITE_HOSTS.includes(u.hostname)) return raw;
      path = u.pathname.replace(/^\//, "") + u.search + u.hash;
      if (!path) return "/";
    } catch {
      return raw;
    }
  }
  path = path.replace(/^\.?\//, "");
  const [beforeHash, hash = ""] = path.split("#");
  const [file, query = ""] = beforeHash.split("?");
  const anchor = hash ? `#${hash}` : "";
  if (file === "" ) return `/${query ? `?${query}` : ""}${anchor}`;
  if (LEGACY_PAGES[file]) return LEGACY_PAGES[file] + anchor;
  if (DETAIL_PAGES[file]) {
    const id = new URLSearchParams(query).get("id");
    return id ? `${DETAIL_PAGES[file]}/${slugifyId(id)}${anchor}` : DETAIL_PAGES[file];
  }
  if (/^(images|docs|uploads)\//.test(file)) return assetUrl(file) + (query ? `?${query}` : "") + anchor;
  return raw;
}

/** Root-absolute, URI-encoded URL for a stored asset path ("images/a b.jpg" → "/images/a%20b.jpg"). */
export function assetUrl(path: string | null | undefined): string {
  const p = (path ?? "").trim();
  if (!p) return "";
  if (/^(https?:)?\/\//i.test(p) || p.startsWith("data:")) return p;
  let decoded = p.replace(/^\.?\//, "");
  try {
    decoded = decodeURI(decoded);
  } catch {
    /* already decoded or malformed: encode as-is */
  }
  return "/" + encodeURI(decoded).replace(/#/g, "%23").replace(/\?/g, "%3F");
}

/** CSS url() value for background images. */
export function cssUrl(path: string | null | undefined): string {
  const u = assetUrl(path);
  return u ? `url("${u.replace(/"/g, "%22")}")` : "";
}

/** Rewrites href/src attributes in stored HTML to root-absolute new URLs. */
export function rewriteHtmlLinks(html: string): string {
  return (html ?? "")
    .replace(/\bhref\s*=\s*"([^"]*)"/gi, (_, h: string) => `href="${legacyHrefToNew(h)}"`)
    .replace(/\bsrc\s*=\s*"((?:\.?\/)?(?:images|docs)\/[^"]*)"/gi, (_, s: string) => `src="${assetUrl(s)}"`);
}

export function isExternal(href: string): boolean {
  return /^https?:\/\//i.test(href);
}
