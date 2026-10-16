import { sanitizeInline, sanitizeRichText } from "@/lib/sanitize";

/**
 * The only place CMS HTML reaches the DOM. Content is sanitized again at render time
 * (defence in depth on top of save-time sanitization).
 */
export function RichHtml({ html, as: Tag = "div", className, style }: { html: string; as?: "div" | "section"; className?: string; style?: React.CSSProperties }) {
  return <Tag className={className} style={style} dangerouslySetInnerHTML={{ __html: sanitizeRichText(html) }} />;
}

export function InlineHtml({
  html,
  as: Tag = "span",
  className,
  style,
}: {
  html: string;
  as?: "span" | "p" | "h1" | "h2" | "h3" | "div" | "strong";
  className?: string;
  style?: React.CSSProperties;
}) {
  return <Tag className={className} style={style} dangerouslySetInnerHTML={{ __html: sanitizeInline(html) }} />;
}
