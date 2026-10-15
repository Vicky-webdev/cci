import Link from "next/link";
import { cssUrl } from "@/lib/links";

export interface CardEvent {
  slug: string;
  title: string;
  subtitle: string;
  dateText: string;
  city: string;
  image: string;
  heroGradient: string;
  heroEmoji: string;
  tagLabel: string;
  tagClass: string;
}

/** Card markup shared by the events, past-events and news listings (legacy event-card). */
export function EventCard({
  e,
  basePath,
  tag,
  tagClass,
  showDate = true,
  defaultGradient,
  linkLabel = "Learn more →",
}: {
  e: CardEvent;
  basePath: string;
  tag: string;
  tagClass?: string;
  showDate?: boolean;
  defaultGradient?: string;
  linkLabel?: string;
}) {
  const href = `${basePath}/${e.slug}`;
  const style: React.CSSProperties = e.image
    ? { backgroundImage: cssUrl(e.image), backgroundSize: "cover", backgroundPosition: "center" }
    : {
        background: e.heroGradient || defaultGradient,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 40,
      };
  return (
    <div className="event-card card-hover">
      <Link href={href} className="event-image-link" aria-label={e.title} tabIndex={-1}>
        <div className="event-image" style={style}>
          {e.image ? <div className="event-overlay"></div> : e.heroEmoji || "🎨"}
        </div>
      </Link>
      <div className="event-content">
        <span className={`event-tag ${tagClass ?? ""}`.trim()}>{tag}</span>
        <h3 className="event-title">{e.title}</h3>
        <div className="event-meta">
          {showDate && <span>📅 {e.dateText || "N/A"}</span>}
          <span>📍 {(e.city || "").split(",")[0]}</span>
        </div>
        <p className="event-desc">{e.subtitle}</p>
        <Link href={href} className="event-link">
          {linkLabel}
        </Link>
      </div>
    </div>
  );
}
