import Link from "next/link";
import { InlineHtml } from "@/components/ui/Html";
import { SmartLink } from "@/components/site/SmartLink";
import { assetUrl, cssUrl } from "@/lib/links";
import { listArtisans, listFeaturedAwardees, upcomingEvents } from "@/lib/queries/content";
import { HeroSlider, RetailSlider } from "./Sliders";
import { b, list, n, s, type SectionData } from "./types";

type Slide = { image?: string; alt?: string };

export function HeroSection({ data }: { data: SectionData }) {
  const slides = list<Slide>(data, "slides").map((sl) => ({ image: assetUrl(sl.image), alt: sl.alt ?? "" }));
  return (
    <div className="hero">
      <div className="hero-left">
        {s(data, "eyebrow") && <InlineHtml as="p" className="eyebrow" html={s(data, "eyebrow")} />}
        <InlineHtml as="h1" className="hero-title" html={s(data, "titleHtml")} />
        {s(data, "description") && <p className="hero-desc">{s(data, "description")}</p>}
        <div className="hero-actions">
          {s(data, "primaryLabel") && (
            <SmartLink href={s(data, "primaryHref")} className="btn-primary">
              {s(data, "primaryLabel")}
            </SmartLink>
          )}
          {s(data, "secondaryLabel") && (
            <SmartLink href={s(data, "secondaryHref")} className="btn-ghost">
              {s(data, "secondaryLabel")}
            </SmartLink>
          )}
        </div>
      </div>
      <div className="hero-right">
        <HeroSlider slides={slides} intervalMs={n(data, "intervalMs", 5000)} />
      </div>
    </div>
  );
}

export function MarqueeSection({ data }: { data: SectionData }) {
  const items = list<{ html?: string }>(data, "items");
  if (!items.length) return null;
  return (
    <div className="marquee-strip">
      <div className="marquee-inner">
        {items.map((it, i) => (
          <InlineHtml key={i} className="m-item" html={it.html ?? ""} />
        ))}
      </div>
    </div>
  );
}

export function QuoteSection({ data }: { data: SectionData }) {
  return (
    <div className="quote-band">
      <div className="quote-band-inner">
        <div className="quote-marks open" aria-hidden="true">
          &#8220;
        </div>
        <blockquote className="quote-band-text">{s(data, "text")}</blockquote>
        <div className="quote-marks close" aria-hidden="true">
          &#8221;
        </div>
        {s(data, "attribution") && <div className="quote-attribution">{s(data, "attribution")}</div>}
      </div>
    </div>
  );
}

export function MissionSection({ data }: { data: SectionData }) {
  const pillars = list<{ title?: string; text?: string }>(data, "pillars");
  const href = s(data, "cardHref") || "#";
  return (
    <div className="section alt">
      <div className="mission-grid">
        <div>
          <h2 className="s-title">{s(data, "title")}</h2>
          <p className="s-sub">{s(data, "subtitle")}</p>
          <br />
          <div className="pillars">
            {pillars.map((p, i) => (
              <div className="pillar" key={i}>
                <div className="p-dot"></div>
                <div>
                  <div className="p-title">{p.title}</div>
                  <div className="p-desc">{p.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          {b(data, "cardEnabled") && (
            <div className="kc-card">
              <SmartLink href={href} className="kc-cover" aria-label={`${s(data, "cardHeading")} — ${s(data, "cardCoverCta")}`}>
                <div className="kc-logo">
                  {/* eslint-disable-next-line @next/next/no-img-element -- decorative logo */}
                  <img src="/images/cci-logo.png" alt="" width={64} />
                </div>
                <div className="kc-org">{s(data, "cardCoverOrg")}</div>
                <div className="kc-title">
                  <span className="kc-script">{s(data, "cardCoverTitle")}</span>
                  <span>{s(data, "cardCoverYear")}</span>
                </div>
                <div className="kc-cta">{s(data, "cardCoverCta")}</div>
              </SmartLink>
              <div className="kc-card-body">
                <h3>{s(data, "cardHeading")}</h3>
                <div className="kc-card-sub">{s(data, "cardSubheading")}</div>
                <p className="kc-card-date">
                  {s(data, "cardDateLabel")}: <strong>{s(data, "cardDate")}</strong>
                </p>
                <SmartLink href={href} className="kc-card-link">
                  {s(data, "cardLinkLabel")} &rarr;
                </SmartLink>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/** Scrollers loop via CSS animation, which needs each record twice (legacy duplicated cards by hand). */
export async function ArtisansSection({ data }: { data: SectionData }) {
  const artisans = await listArtisans();
  const loop = [...artisans, ...artisans];
  return (
    <div className="section">
      <div className="s-header-row">
        <div>
          <p className="s-tag">{s(data, "tag")}</p>
          <h2 className="s-title">{s(data, "title")}</h2>
        </div>
        {s(data, "buttonLabel") && s(data, "buttonHref") && (
          <SmartLink href={s(data, "buttonHref")} className="btn-ghost meet-artisian-btn">
            {s(data, "buttonLabel")}
          </SmartLink>
        )}
      </div>
      <div className="artisan-scroll-wrapper">
        <div className="artisan-grid awards-scroll">
          {loop.map((a, i) => (
            <div className="a-card" key={`${a.id}-${i}`} aria-hidden={i >= artisans.length || undefined}>
              <div className="a-img" style={{ background: cssUrl(a.photo) }} role="img" aria-label={a.name}>
                <div className="a-grad-overlay"></div>
                <div className="a-craft-tag"></div>
              </div>
              <div className="a-name">{a.name}</div>
              <div className="a-region">{a.craft}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function RetailSection({ data }: { data: SectionData }) {
  const slides = list<Slide>(data, "slides").map((sl) => ({ image: assetUrl(sl.image), alt: sl.alt ?? "" }));
  return (
    <div className="retail-section">
      <div>
        <p className="s-tag">{s(data, "tag")}</p>
        <h2 className="s-title">{s(data, "title")}</h2>
        {list<{ text?: string }>(data, "paragraphs").map((p, i) => (
          <p className="retail-desc" key={i} style={i === 0 ? { marginTop: 12 } : undefined}>
            {p.text}
          </p>
        ))}
        {s(data, "primaryLabel") && (
          <a href={s(data, "primaryHref")} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ marginTop: 24 }}>
            {s(data, "primaryLabel")}
          </a>
        )}
        {s(data, "secondaryLabel") && (
          <>
            {" "}
            <a href={s(data, "secondaryHref")} target="_blank" rel="noopener noreferrer" className="btn-ghost">
              {s(data, "secondaryLabel")}
            </a>
          </>
        )}
      </div>
      <RetailSlider slides={slides} intervalMs={n(data, "intervalMs", 4000)} />
    </div>
  );
}

export async function HomeEventsSection({ data }: { data: SectionData }) {
  const events = await upcomingEvents(n(data, "limit", 3));
  return (
    <div className="section alt">
      <div className="s-header-row">
        <div>
          <p className="s-tag">{s(data, "tag")}</p>
          <h2 className="s-title">{s(data, "title")}</h2>
        </div>
        {s(data, "linkLabel") && (
          <SmartLink href={s(data, "linkHref")} className="btn-ghost">
            {s(data, "linkLabel")}
          </SmartLink>
        )}
      </div>
      <div className="home-events-grid" id="home-events-container">
        {!events.length && (
          <div className="no-events">
            <p>{s(data, "emptyText", "No upcoming events at the moment.")}</p>
          </div>
        )}
        {events.map((e, i) => {
          const bg = e.image ? { backgroundImage: cssUrl(e.image) } : { background: e.heroGradient || "var(--cr-deep)" };
          const tagLabel = e.tagLabel || "Upcoming Event";
          const tagClass = e.tagClass || "upcoming";
          if (i === 0) {
            return (
              <Link key={e.id} href={`/events/${e.slug}`} className="ev-feat">
                <div className="ev-feat-bg" style={{ ...bg, backgroundSize: "cover", backgroundPosition: "center" }}></div>
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.8))", zIndex: 1 }}></div>
                <span className={`ev-tag ${tagClass}`} style={{ zIndex: 2 }}>
                  {tagLabel}
                </span>
                <h3 className="ev-title" style={{ zIndex: 2 }}>
                  {e.title}
                </h3>
                <p className="ev-meta" style={{ zIndex: 2 }}>
                  📅 {e.dateText} &nbsp; 📍 {e.city}
                </p>
              </Link>
            );
          }
          return (
            <Link key={e.id} href={`/events/${e.slug}`} className="ev-card">
              <div className="ev-card-img" style={{ ...bg, backgroundSize: "cover", backgroundPosition: "center" }}>
                {!e.image && (
                  <div className="ev-card-emoji" style={{ fontSize: 40, opacity: 0.5 }}>
                    {e.heroEmoji || "🎨"}
                  </div>
                )}
              </div>
              <div className="ev-card-body">
                <div className={`ev-card-tag ${tagClass}`}>{tagLabel}</div>
                <div className="ev-card-title">{e.title}</div>
                <div className="ev-card-date">{e.dateText}</div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export async function HomeAwardsSection({ data }: { data: SectionData }) {
  const awardees = await listFeaturedAwardees();
  const loop = [...awardees, ...awardees];
  return (
    <div className="section alt">
      <div className="s-header-row">
        <div>
          <p className="s-tag">{s(data, "tag")}</p>
          <h2 className="s-title">{s(data, "title")}</h2>
        </div>
        {s(data, "linkLabel") && (
          <SmartLink href={s(data, "linkHref")} className="btn-ghost">
            {s(data, "linkLabel")}
          </SmartLink>
        )}
      </div>
      <div className="awards-scroll-wrapper">
        <div className="awards-scroll">
          {loop.map((a, i) => (
            <div className="aw-card" key={`${a.id}-${i}`} aria-hidden={i >= awardees.length || undefined}>
              <div className="aw-photo">
                {/* eslint-disable-next-line @next/next/no-img-element -- legacy card sizing */}
                <img src={assetUrl(a.photo)} alt={a.photoAlt || a.name} />
              </div>
              <div className="aw-body">
                <div className="aw-year">{a.award}</div>
                <div className="aw-name">{a.name}</div>
                <div className="aw-person">{a.craft}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
