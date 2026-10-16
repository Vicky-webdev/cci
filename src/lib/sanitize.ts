import sanitizeHtml from "sanitize-html";

const YOUTUBE_HOSTS = ["www.youtube.com", "youtube.com", "www.youtube-nocookie.com", "m.youtube.com"];

const STYLE_VALUE = [/^[-#(),.%\w\s]+$/];
const allowedStyles = Object.fromEntries(
  [
    "margin", "margin-top", "margin-bottom", "margin-left", "margin-right",
    "padding", "padding-top", "padding-bottom", "text-align", "color", "font-weight",
    "font-size", "font-style", "line-height", "letter-spacing", "text-decoration", "width", "max-width", "display", "gap",
  ].map((p) => [p, STYLE_VALUE]),
);

const OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    "p", "br", "strong", "b", "em", "i", "u", "s", "sup", "sub", "small", "mark",
    "a", "ul", "ol", "li", "h1", "h2", "h3", "h4", "h5", "h6", "blockquote", "hr",
    "div", "span", "img", "figure", "figcaption", "iframe", "video", "source",
    "table", "thead", "tbody", "tr", "th", "td", "code", "pre",
  ],
  allowedAttributes: {
    "*": ["class", "style", "id", "title"],
    a: ["href", "target", "rel", "class", "style", "title"],
    img: ["src", "alt", "width", "height", "loading", "class", "style"],
    iframe: ["src", "title", "width", "height", "allowfullscreen", "frameborder", "allow", "referrerpolicy", "loading"],
    video: ["src", "controls", "muted", "playsinline", "preload", "poster", "class"],
    source: ["src", "type"],
    td: ["colspan", "rowspan", "class", "style"],
    th: ["colspan", "rowspan", "class", "style"],
  },
  allowedStyles: { "*": allowedStyles },
  allowedSchemes: ["http", "https", "mailto", "tel"],
  allowedSchemesAppliedToAttributes: ["href", "src"],
  allowProtocolRelative: false,
  allowedIframeHostnames: YOUTUBE_HOSTS,
  transformTags: {
    a: (tagName, attribs) => {
      // External links opened in a new tab must not leak window.opener.
      if (attribs.target === "_blank") attribs.rel = "noopener noreferrer";
      return { tagName, attribs };
    },
    // YouTube refuses embeds without a Referer ("Error 153"); mirror legacy withEmbedAttributes().
    iframe: (tagName, attribs) => ({
      tagName,
      attribs: {
        ...attribs,
        referrerpolicy: attribs.referrerpolicy ?? "strict-origin-when-cross-origin",
        allow:
          attribs.allow ??
          "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
        loading: attribs.loading ?? "lazy",
      },
    }),
  },
};

/** Allow-list sanitizer for all CMS rich text. Run at save time and again at render. */
export function sanitizeRichText(html: string): string {
  return sanitizeHtml(html ?? "", OPTIONS);
}

/** Inline-only sanitizer for short fields that legacy content formats with <br>/<em>/<strong>/<a>. */
export function sanitizeInline(html: string): string {
  return sanitizeHtml(html ?? "", {
    allowedTags: ["br", "em", "i", "strong", "b", "a", "span"],
    allowedAttributes: { a: ["href", "target", "rel"], span: ["class"] },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    transformTags: OPTIONS.transformTags,
  });
}

/** Strips all markup — used for meta descriptions, alt text and plain-text fallbacks. */
export function toPlainText(html: string): string {
  return sanitizeHtml(html ?? "", { allowedTags: [], allowedAttributes: {} })
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export function isYouTubeUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return [...YOUTUBE_HOSTS, "youtu.be"].includes(u.hostname);
  } catch {
    return false;
  }
}

/** Converts youtu.be / watch?v= URLs to an embed URL (legacy news.js did the youtu.be case). */
export function toYouTubeEmbed(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname === "youtu.be") return `https://www.youtube.com/embed/${u.pathname.slice(1).split("/")[0]}`;
    if (!YOUTUBE_HOSTS.includes(u.hostname)) return null;
    if (u.pathname.startsWith("/embed/")) return `https://www.youtube.com${u.pathname}`;
    const v = u.searchParams.get("v");
    if (v) return `https://www.youtube.com/embed/${v}`;
    if (u.pathname.startsWith("/shorts/")) return `https://www.youtube.com/embed/${u.pathname.split("/")[2]}`;
    return null;
  } catch {
    return null;
  }
}
