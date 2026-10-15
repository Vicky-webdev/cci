import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { GalleryLightbox, type LightboxItem } from "@/components/detail/GalleryLightbox";
import { ShareButtons } from "@/components/detail/ShareButtons";
import { ArrowIcon, CalendarIcon, ClockIcon, PinIcon } from "@/components/detail/Icons";
import { RichHtml } from "@/components/ui/Html";
import { JsonLd } from "@/components/site/JsonLd";
import { PageScope } from "@/components/site/PageScope";
import { findEventSlugByLegacyId, getEvent, getEventsBySlugs } from "@/lib/queries/content";
import { assetUrl, cssUrl } from "@/lib/links";
import { buildMetadata } from "@/lib/seo";
import { toIsoDate } from "@/lib/dates";
import { toPlainText } from "@/lib/sanitize";
import { siteUrl } from "@/lib/env";

type Props = { params: Promise<{ slug: string }> };
type Highlight = { icon: string; title: string; text: string };
type ScheduleItem = { time: string; title: string; desc: string };
type Person = { initials: string; name: string; role: string; color: string };

const isVideo = (p: string) => /\.(mp4|webm|ogg|mov)$/i.test(p);

async function load(slug: string) {
  const event = await getEvent(slug);
  if (event) return event;
  const canonical = await findEventSlugByLegacyId(slug);
  if (canonical && canonical !== slug) permanentRedirect(`/events/${canonical}`);
  notFound();
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const e = await getEvent(slug);
  if (!e) return {};
  return buildMetadata({
    metaTitle: e.metaTitle || `${e.title} — Crafts Council of India`,
    title: e.title,
    description: e.metaDescription || e.subtitle || toPlainText(e.descriptionHtml),
    path: `/events/${e.slug}`,
    image: e.image,
    noindex: e.noindex,
    type: "article",
  });
}

export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params;
  const e = await load(slug);
  const highlights = (e.highlights as Highlight[]) ?? [];
  const schedule = (e.schedule as ScheduleItem[]) ?? [];
  const people = (e.people as Person[]) ?? [];
  const related = await getEventsBySlugs(e.relatedSlugs);
  const lightboxItems: LightboxItem[] = e.gallery.map((g) => ({ src: assetUrl(g), isVideo: isVideo(g) }));
  const peopleLabel = e.type === "workshop" ? "Facilitators" : e.type === "award" ? "Awardees" : "Featured Artisans";
  const fee = e.entryFee === "Free" || e.entryFee === "By invitation" ? e.entryFee.toLowerCase() : `entry ${e.entryFee}`;

  return (
    <PageScope page="event-detail">
      <GalleryLightbox items={lightboxItems}>
        <div id="eventPage">
          <div className="ed-hero">
            <div className="ed-hero-bg" style={e.image ? { backgroundImage: cssUrl(e.image), backgroundSize: "cover", backgroundPosition: "center" } : { background: e.heroGradient }}>
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 120, opacity: 0.12 }} aria-hidden="true">
                {e.heroEmoji}
              </div>
            </div>
            <div className="ed-hero-overlay"></div>
            <div className="ed-hero-content">
              <div className="ed-breadcrumb" role="navigation" aria-label="Breadcrumb">
                <Link href="/">Home</Link>
                <span>›</span>
                <Link href="/events">Events</Link>
                <span>›</span>
                <span style={{ color: "rgba(250,246,239,.85)" }} aria-current="page">
                  {e.title}
                </span>
              </div>
              <span className={`ed-tag ${e.tagClass}`}>{e.tagLabel}</span>
              <h1 className="ed-title">{e.title}</h1>
              <div className="ed-meta-row">
                <div className="ed-meta-item">
                  <CalendarIcon />
                  {e.dateText}
                </div>
                <div className="ed-meta-item">
                  <PinIcon />
                  {e.city}
                </div>
              </div>
            </div>
          </div>

          <div className="ed-body">
            <div className="ed-main">
              <span className="ed-section-label">About this event</span>
              <div className="ed-divider"></div>
              <RichHtml className="ed-description" html={e.descriptionHtml} />
              {e.writeupHtml && (
                <>
                  <span className="ed-section-label" style={{ marginTop: 40 }}>
                    Exhibition Overview
                  </span>
                  <div className="ed-divider"></div>
                  <RichHtml className="ed-description" html={e.writeupHtml} />
                </>
              )}
              {e.pdfUrl && (
                <>
                  <span className="ed-section-label" style={{ marginTop: 40 }}>
                    Downloads
                  </span>
                  <div style={{ marginTop: 18 }}>
                    <a href={assetUrl(e.pdfUrl)} target="_blank" rel="noopener noreferrer" className="ed-register-btn">
                      View / Download Event PDF
                    </a>
                  </div>
                </>
              )}
              {highlights.length > 0 && (
                <>
                  <span className="ed-section-label" style={{ marginTop: 40 }}>
                    Highlights
                  </span>
                  <div className="ed-highlights">
                    {highlights.map((h, i) => (
                      <div className="ed-highlight-item" key={i}>
                        <div className="ed-highlight-icon">{h.icon}</div>
                        <div className="ed-highlight-text">
                          <strong>{h.title}</strong>
                          {h.text}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
              {schedule.length > 0 && (
                <>
                  <span className="ed-section-label" style={{ marginTop: 40 }}>
                    Programme / Schedule
                  </span>
                  <div className="ed-schedule">
                    {schedule.map((sc, i) => (
                      <div className="ed-schedule-item" key={i}>
                        <div className="ed-schedule-time">{sc.time}</div>
                        <div className="ed-schedule-desc">
                          <strong>{sc.title}</strong>
                          {sc.desc}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
              {people.length > 0 && (
                <>
                  <span className="ed-section-label" style={{ marginTop: 40 }}>
                    {peopleLabel}
                  </span>
                  <div className="ed-people-grid">
                    {people.map((p, i) => (
                      <div className="ed-person" key={i}>
                        <div className="ed-person-avatar" style={{ background: p.color }} aria-hidden="true">
                          {p.initials}
                        </div>
                        <div className="ed-person-name">{p.name}</div>
                        <div className="ed-person-role">{p.role}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}
              {e.gallery.length > 0 && (
                <>
                  <span className="ed-section-label" style={{ marginTop: 40 }}>
                    Gallery
                  </span>
                  <div className="ed-gallery">
                    {e.gallery.map((g, i) => (
                      <div className="ed-gallery-item" data-index={i} data-lightbox-index={i} key={i} role="button" tabIndex={0} aria-label={`Open gallery item ${i + 1}`}>
                        {isVideo(g) ? (
                          <video className="ed-gallery-media" muted playsInline preload="metadata">
                            <source src={assetUrl(g)} type="video/mp4" />
                          </video>
                        ) : (
                          // eslint-disable-next-line @next/next/no-img-element -- legacy gallery grid
                          <img src={assetUrl(g)} alt={`${e.title} — gallery image ${i + 1}`} className="ed-gallery-media" loading="lazy" />
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="ed-sidebar">
              {e.legacyStatus === "upcoming" && e.registrationUrl && (
                <div className="ed-register-card">
                  <div className="ed-register-title">Join this event</div>
                  <div className="ed-register-desc">Secure your spot — {fee}</div>
                  <a href={e.registrationUrl} target="_blank" rel="noopener noreferrer" className="ed-register-btn">
                    Register Now
                  </a>
                  <Link href="/contact" className="ed-register-btn ghost">
                    Ask a question
                  </Link>
                </div>
              )}
              {e.legacyStatus === "past" && (
                <div className="ed-register-card">
                  <div className="ed-register-title">This event has ended</div>
                  <div className="ed-register-desc">Follow CCI on Instagram or subscribe to our newsletter for upcoming events.</div>
                  <Link href="/newsletters" className="ed-register-btn">
                    Subscribe to Newsletter
                  </Link>
                  <Link href="/events" className="ed-register-btn ghost">
                    Browse all events
                  </Link>
                </div>
              )}
              <div className="ed-info-card">
                <div className="ed-info-card-head">Event Details</div>
                <div className="ed-info-rows">
                  <InfoRow icon={<CalendarIcon />} label="Date" value={e.dateText} />
                  <InfoRow icon={<ClockIcon />} label="Time" value={e.timeText} />
                  <div className="ed-info-row">
                    <div className="ed-info-icon">
                      <PinIcon />
                    </div>
                    <div>
                      <span className="ed-info-label">Venue</span>
                      <span className="ed-info-value">
                        {e.venue}
                        <br />
                        <span style={{ fontSize: 11, color: "var(--mud)" }}>{e.city}</span>
                      </span>
                    </div>
                  </div>
                  {e.ticketPrice && <InfoRow icon="🎟️" label="Fee" value={e.ticketPrice} />}
                  {e.ageGroup && <InfoRow icon="👶" label="Age Group" value={e.ageGroup} />}
                  {e.contact.length > 0 && <InfoRow icon="📞" label="Contact" value={e.contact.join(" / ")} />}
                  {e.address && <InfoRow icon="📍" label="Address" value={e.address} />}
                  {e.parking && <InfoRow icon="🚗" label="Parking" value={e.parking} />}
                  {e.mapLink && (
                    <div className="ed-info-row">
                      <div className="ed-info-icon">🗺️</div>
                      <div>
                        <span className="ed-info-label">Location</span>
                        <span className="ed-info-value">
                          <a href={e.mapLink} target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)" }}>
                            View on Google Maps
                          </a>
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <ShareButtons title={e.title} />
            </div>
          </div>

          {related.length > 0 && (
            <div className="ed-related">
              <div className="ed-related-inner">
                <p className="s-tag">More Events</p>
                <h2 className="s-title">You might also like</h2>
                <div className="ed-related-grid">
                  {related.map((r) => (
                    <div className="event-card card-hover" key={r.id}>
                      <div className="event-image" style={{ background: r.heroGradient }}>
                        {r.heroEmoji}
                      </div>
                      <div className="event-content">
                        <span className="event-tag">{r.tagLabel}</span>
                        <h3 className="event-title">{r.title}</h3>
                        <div className="event-meta">
                          <span>{r.dateText}</span>
                          <span>{r.city}</span>
                        </div>
                        <p className="event-desc">{r.subtitle}</p>
                        <Link href={`/events/${r.slug}`} className="event-link">
                          Learn more <ArrowIcon />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </GalleryLightbox>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: siteUrl("/") },
              { "@type": "ListItem", position: 2, name: "Events", item: siteUrl("/events") },
              { "@type": "ListItem", position: 3, name: e.title, item: siteUrl(`/events/${e.slug}`) },
            ],
          },
          ...(e.startDate
            ? [
                {
                  "@context": "https://schema.org",
                  "@type": "Event",
                  name: e.title,
                  startDate: toIsoDate(e.startDate),
                  endDate: toIsoDate(e.endDate ?? e.startDate),
                  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
                  ...(e.venue || e.city
                    ? { location: { "@type": "Place", name: e.venue || e.city, address: e.address || e.city } }
                    : {}),
                  ...(e.image ? { image: [siteUrl(assetUrl(e.image))] } : {}),
                  description: e.subtitle || toPlainText(e.descriptionHtml).slice(0, 300),
                  organizer: { "@type": "Organization", name: "Crafts Council of India", url: siteUrl("/") },
                },
              ]
            : []),
        ]}
      />
    </PageScope>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="ed-info-row">
      <div className="ed-info-icon">{icon}</div>
      <div>
        <span className="ed-info-label">{label}</span>
        <span className="ed-info-value">{value}</span>
      </div>
    </div>
  );
}
