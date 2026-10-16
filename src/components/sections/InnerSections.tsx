import { InlineHtml, RichHtml } from "@/components/ui/Html";
import { SmartLink } from "@/components/site/SmartLink";
import { assetUrl } from "@/lib/links";
import {
  listAwardCategories,
  listAwardTables,
  listCouncils,
  listFeaturedAwardees,
  listPublications,
  listTeam,
} from "@/lib/queries/content";
import type { PublicationKind } from "@/generated/prisma/enums";
import { AnchorBar, SectionSlider } from "./Sliders";
import { b, list, n, s, type SectionData } from "./types";

// ── About ─────────────────────────────────────────────

export function HistorySection({ data }: { data: SectionData }) {
  return (
    <section className="history-section" id={s(data, "anchor") || undefined}>
      <div className="history-inner">
        <div className="history-header">
          <p className="s-tag">{s(data, "tag")}</p>
          <h2 className="s-title large">{s(data, "title")}</h2>
        </div>
        <div className="history-grid">
          <div className="history-image-col">
            <div className="history-portrait">
              <div className="portrait-inner">
                {s(data, "portraitImage") && (
                  // eslint-disable-next-line @next/next/no-img-element -- legacy portrait sizing
                  <img src={assetUrl(s(data, "portraitImage"))} alt={s(data, "portraitAlt")} className="portrait-image" loading="lazy" />
                )}
                <div className="portrait-name">{s(data, "portraitName")}</div>
                <div className="portrait-years">{s(data, "portraitYears")}</div>
                <InlineHtml as="p" className="portrait-desc" html={s(data, "portraitDescHtml")} />
              </div>
              <div className="portrait-bottom"></div>
            </div>
          </div>
          <div>
            {s(data, "pill") && <span className="history-pill">{s(data, "pill")}</span>}
            {s(data, "quote") && <blockquote className="history-quote">{s(data, "quote")}</blockquote>}
            <RichHtml className="history-body" html={s(data, "bodyHtml")} />
          </div>
        </div>
      </div>
    </section>
  );
}

export function VisionMissionSection({ data }: { data: SectionData }) {
  const cards = list<{ anchor?: string; title?: string; html?: string; accent?: string }>(data, "cards");
  return (
    <section id={s(data, "anchor") || undefined} className="vm-section">
      <div className="vm-inner">
        <p className="s-tag">{s(data, "tag")}</p>
        <h2 className="s-title large">{s(data, "title")}</h2>
        <div className="vm-cards">
          {cards.map((c, i) => (
            <div className="vm-card" id={c.anchor || undefined} key={i}>
              <div className="vm-accent" style={c.accent ? { background: c.accent } : undefined}></div>
              <h3 className="vm-title">{c.title}</h3>
              <InlineHtml as="p" className="vm-text" html={c.html ?? ""} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export async function TeamSection({ data }: { data: SectionData }) {
  const team = await listTeam();
  const members = team.filter((t) => t.group === "EC_MEMBER");
  const bearers = team.filter((t) => t.group === "OFFICE_BEARER");
  return (
    <section id={s(data, "anchor") || undefined} className="team-section">
      <div className="team-inner">
        <div className="team-header">
          <p className="s-tag">{s(data, "tag")}</p>
          <h2 className="s-title large">{s(data, "title")}</h2>
          {s(data, "note") && <p className="team-note">{s(data, "note")}</p>}
        </div>
        <div className="team-cols">
          <div>
            <div className="tc-title">{s(data, "membersTitle")}</div>
            <ul className="tc-list">
              {members.map((m) => (
                <li key={m.id}>{m.name}</li>
              ))}
            </ul>
          </div>
          <div>
            <div className="tc-title">{s(data, "bearersTitle")}</div>
            <ul className="tc-list">
              {bearers.map((m) => (
                <li key={m.id}>
                  {m.name}
                  {m.role && <span className="tc-role">{m.role}</span>}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── What we do ────────────────────────────────────────

export function AnchorBarSection({ data }: { data: SectionData }) {
  return <AnchorBar links={list<{ label: string; anchor: string }>(data, "links")} />;
}

export function FeatureBlockSection({ data }: { data: SectionData }) {
  const layout = s(data, "layout", "img-right");
  const slides = list<{ image?: string; alt?: string; caption?: string }>(data, "slides").map((sl) => ({
    image: assetUrl(sl.image),
    alt: sl.alt ?? "",
    caption: sl.caption,
  }));
  const text = (
    <div className="wwd-text">
      <h2 className="wwd-title">{s(data, "title")}</h2>
      <div className="wwd-divider" style={s(data, "dividerColor") ? { background: s(data, "dividerColor") } : undefined}></div>
      <RichHtml className="wwd-body" html={s(data, "bodyHtml")} />
    </div>
  );
  const slider = <SectionSlider name={s(data, "anchor")} slides={slides} intervalMs={n(data, "intervalMs", 4000)} />;
  return (
    <section id={s(data, "anchor") || undefined} className={`wwd-block ${layout}`}>
      <div className="wwd-inner">
        {layout === "img-left" ? (
          <>
            {slider}
            {text}
          </>
        ) : (
          <>
            {text}
            {slider}
          </>
        )}
      </div>
    </section>
  );
}

// ── Awards ────────────────────────────────────────────

const ExternalIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

export function KamalaCallSection({ data }: { data: SectionData }) {
  return (
    <div className="section alt kc-section" id={s(data, "anchor") || undefined}>
      <div className="kc-grid">
        <div className="kc-cover" role="img" aria-label={`${s(data, "coverOrg")} — ${s(data, "title")} — ${s(data, "coverCta")}`}>
          <div className="kc-logo">
            {/* eslint-disable-next-line @next/next/no-img-element -- decorative logo */}
            <img src="/images/cci-logo.png" alt="" width={64} />
          </div>
          <div className="kc-org">{s(data, "coverOrg")}</div>
          <div className="kc-title">
            <span className="kc-script">{s(data, "coverTitle")}</span>
            <span>{s(data, "coverYear")}</span>
          </div>
          <div className="kc-cta">{s(data, "coverCta")}</div>
        </div>
        <div className="kc-info">
          {s(data, "badge") && <span className="kc-badge">{s(data, "badge")}</span>}
          <h2>{s(data, "title")}</h2>
          <div className="kc-info-sub">{s(data, "subtitle")}</div>
          <RichHtml html={s(data, "introHtml")} />
          <div className="kc-deadline">
            <div>
              <div className="kc-deadline-label">{s(data, "deadlineLabel")}</div>
              <div className="kc-deadline-date">{s(data, "deadline")}</div>
            </div>
          </div>
          <div className="kc-actions">
            {s(data, "primaryLabel") && s(data, "primaryHref") && (
              <a href={s(data, "primaryHref")} target="_blank" rel="noopener noreferrer" className="btn-primary">
                {s(data, "primaryLabel")} <ExternalIcon />
              </a>
            )}
            {s(data, "secondaryLabel") && s(data, "secondaryHref") && (
              <a href={s(data, "secondaryHref")} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                {s(data, "secondaryLabel")} <ExternalIcon />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export async function AwardCategoriesSection({ data }: { data: SectionData }) {
  const categories = await listAwardCategories();
  return (
    <div className="section">
      <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
        <h2 className="s-title large">{s(data, "title")}</h2>
        <InlineHtml as="p" className="s-text" style={{ marginTop: 16 }} html={s(data, "introHtml")} />
      </div>
      <div className="award-categories">
        {categories.map((c) => (
          <div className="category-card" key={c.id}>
            <h3 className="category-title">{c.name}</h3>
            <InlineHtml as="p" className="category-desc" html={c.description} />
          </div>
        ))}
      </div>
    </div>
  );
}

export async function AwardeeCardsSection({ data }: { data: SectionData }) {
  const awardees = await listFeaturedAwardees();
  const listing = s(data, "tablesListing", "none");
  return (
    <div className="section alt">
      {/* The legacy page left this centring wrapper unclosed, so cards (and tables) inherited it. */}
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <p className="s-tag">{s(data, "tag")}</p>
        <h2 className="s-title large">{s(data, "title")}</h2>
      </div>
      <div style={{ textAlign: "center" }}>
        <div className="awardees-grid">
          {awardees.map((a) => (
            <div className="awardee-card card-hover" key={a.id}>
              <div className="awardee-photo" style={{ background: "linear-gradient(135deg,#B08840,#7A5C10)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element -- legacy card sizing */}
                <img src={assetUrl(a.photo)} alt={a.photoAlt || a.name} />
              </div>
              <div className="awardee-content">
                <div className="awardee-year">{a.award}</div>
                <h4 className="awardee-name">{a.name}</h4>
                <p className="awardee-craft">{a.craft}</p>
              </div>
            </div>
          ))}
        </div>
        {listing !== "none" && <AwardTables listing={listing} />}
      </div>
    </div>
  );
}

async function AwardTables({ listing }: { listing: string }) {
  const groups = await listAwardTables(listing);
  return (
    <>
      {groups.map(({ year, rows }) => {
        const withState = rows.some((r) => r.state);
        return (
          <div className="awards-table-section" key={year}>
            <div className="awards-table-year">{year}</div>
            <table className="awards-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>AWARD &amp; CRAFT</th>
                  {withState && <th>State</th>}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td>{r.name}</td>
                    <td>{[r.award, r.craft].filter(Boolean).join(" — ")}</td>
                    {withState && <td>{r.state}</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </>
  );
}

export async function AwardTablesSection({ data }: { data: SectionData }) {
  const listing = s(data, "listing", "awards");
  return (
    <div className="section">
      {(s(data, "title") || s(data, "tag")) && (
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <p className="s-tag">{s(data, "tag")}</p>
          <h2 className="s-title large">{s(data, "title")}</h2>
        </div>
      )}
      <AwardTables listing={listing} />
    </div>
  );
}

// ── Contact network ───────────────────────────────────

export async function CouncilsSection({ data }: { data: SectionData }) {
  const councils = await listCouncils();
  const multiline = (v: string) =>
    v.split("\n").map((line, i, arr) => (
      <span key={i}>
        {line}
        {i < arr.length - 1 && <br />}
      </span>
    ));
  return (
    <section className="affiliates-section">
      <div className="affiliates-inner">
        <div className="affiliates-header">
          <p className="s-tag">{s(data, "tag")}</p>
          <h2 className="s-title large">{s(data, "title")}</h2>
          {s(data, "intro") && <p className="s-text affiliates-intro">{s(data, "intro")}</p>}
        </div>
        <div className="affiliate-grid">
          {councils.map((c) => (
            <div className="affiliate-card" key={c.id}>
              <div className="affiliate-top">
                <div className="affiliate-logo">
                  {/* eslint-disable-next-line @next/next/no-img-element -- council logos keep legacy sizing */}
                  {c.logo && <img src={assetUrl(c.logo)} alt={c.name} />}
                </div>
                <div className="affiliate-quick">
                  <span className="affiliate-state-tag">{c.abbreviation}</span>
                  {c.established && (
                    <div className="affiliate-quick-row">
                      <span className="affiliate-quick-label">Est.</span>
                      <span>{c.established}</span>
                    </div>
                  )}
                  {c.state && (
                    <div className="affiliate-quick-row">
                      <span className="affiliate-quick-label">State</span>
                      <span>{c.state}</span>
                    </div>
                  )}
                  {c.focus && (
                    <div className="affiliate-quick-row">
                      <span className="affiliate-quick-label">{c.focusLabel}</span>
                      <span>{c.focus}</span>
                    </div>
                  )}
                </div>
              </div>
              <h3 className="affiliate-name">{c.name}</h3>
              <p className="affiliate-desc">{c.description}</p>
              <div className="affiliate-contact">
                {c.address && (
                  <div className="affiliate-contact-row">
                    <span className="affiliate-contact-label">Address</span>
                    <span>{multiline(c.address)}</span>
                  </div>
                )}
                {c.phone && (
                  <div className="affiliate-contact-row">
                    <span className="affiliate-contact-label">Phone</span>
                    <span>{multiline(c.phone)}</span>
                  </div>
                )}
                {c.email && (
                  <div className="affiliate-contact-row">
                    <span className="affiliate-contact-label">Email</span>
                    <span>{c.email}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        {s(data, "networkTitle") && (
          <div style={{ marginTop: 24, paddingTop: 16, borderTop: "1px solid var(--border)" }}>
            <div className="network-grid">
              <div>
                <p className="s-tag">{s(data, "networkTag")}</p>
                <h3 className="s-title" style={{ marginBottom: 20 }}>
                  {s(data, "networkTitle")}
                </h3>
                <RichHtml className="network-text" html={s(data, "networkHtml")} />
              </div>
              <div>
                {/* eslint-disable-next-line @next/next/no-img-element -- legacy network map */}
                {s(data, "networkImage") && <img src={assetUrl(s(data, "networkImage"))} alt={s(data, "networkImageAlt")} />}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ── Rich text ─────────────────────────────────────────

export function RichTextSection({ data }: { data: SectionData }) {
  const wrapper = s(data, "wrapper", "section");
  if (wrapper === "privacy")
    return (
      <section className="privacy-section">
        <div className="privacy-inner">
          <RichHtml className="privacy-content" html={s(data, "html")} />
        </div>
      </section>
    );
  if (wrapper === "terms")
    return (
      <section className="terms-section">
        <RichHtml className="terms-inner" html={s(data, "html")} />
      </section>
    );
  return (
    <div className="section">
      <RichHtml html={s(data, "html")} />
    </div>
  );
}

// ── Publications ──────────────────────────────────────

const DownloadIcon = ({ size = 12 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

export async function PublicationsSection({ data }: { data: SectionData }) {
  const items = await listPublications(s(data, "kind", "NEWSLETTER") as PublicationKind, b(data, "archived"));
  const featured = items.find((p) => p.isFeatured);
  const cards = items.filter((p) => !p.isFeatured);
  const groups: { label: string; items: typeof cards }[] = [];
  for (const c of cards) {
    const last = groups[groups.length - 1];
    if (last && last.label === c.groupLabel) last.items.push(c);
    else groups.push({ label: c.groupLabel, items: [c] });
  }
  const gridClass = s(data, "gridClass", "nl-grid-newsletter");
  const showActions = data.showCardActions !== false;
  return (
    <>
      {featured && (
        <div className="nl-latest">
          <div className="nl-latest-cover">
            <div className="nl-cover-card">
              {/* eslint-disable-next-line @next/next/no-img-element -- legacy cover sizing */}
              {featured.coverImage && <img src={assetUrl(featured.coverImage)} className="nl-card-img" alt={featured.coverAlt || featured.title} />}
              <div className="nl-cover-card-top">
                <InlineHtml as="div" className="nl-cover-logo" html={featured.coverLogoHtml} />
                <InlineHtml as="div" className="nl-cover-title" html={featured.cardTitleHtml} />
                {featured.cardSubtitle && <div className="nl-latest-date">{featured.cardSubtitle}</div>}
              </div>
            </div>
          </div>
          <div className="nl-latest-info">
            <div className="nl-latest-badge">
              <span></span>
              {s(data, "featuredBadge", "Latest Issue")}
            </div>
            <h2 className="nl-latest-title">{featured.title}</h2>
            {featured.dateLabel && <div className="nl-latest-date">{featured.dateLabel}</div>}
            <InlineHtml as="p" className="nl-latest-desc" html={featured.descriptionHtml} />
            {featured.fileUrl && (
              <div className="nl-latest-actions">
                <a href={assetUrl(featured.fileUrl)} className="btn-download btn-ghost" target="_blank" rel="noopener noreferrer">
                  <DownloadIcon size={14} />
                  {featured.actionLabel || "Download"}
                </a>
              </div>
            )}
          </div>
        </div>
      )}
      <section className="nl-archive">
        {groups.map((g, gi) => (
          <div className="nl-year-group" key={gi}>
            {g.label && (
              <div className="newsletter-year">
                <h2>{g.label}</h2>
              </div>
            )}
            <div className="nl-year-label"></div>
            <div className={`nl-grid ${gridClass}`}>
              {g.items.map((p) => (
                <div className="nl-card" key={p.id}>
                  <div className="nl-card-cover" style={p.coverBackground ? { background: p.coverBackground } : undefined}>
                    {/* eslint-disable-next-line @next/next/no-img-element -- legacy cover sizing */}
                    {p.coverImage && <img src={assetUrl(p.coverImage)} className="nl-card-img" alt={p.coverAlt || p.title} loading="lazy" />}
                    <div className="nl-card-cover-top">
                      <InlineHtml as="div" className="nl-card-cover-logo" html={p.coverLogoHtml} />
                      {p.coverHeadline && <InlineHtml as="div" className="nl-card-cover-headline" html={p.coverHeadline} />}
                    </div>
                    <div className="nl-card-cover-strip"></div>
                  </div>
                  <div className="nl-card-body">
                    <div className="nl-card-vol"></div>
                    <InlineHtml as="div" className="nl-card-title" html={p.cardTitleHtml} />
                    {p.cardSubtitle && <div className="nl-card-date">{p.cardSubtitle}</div>}
                  </div>
                  {showActions && p.fileUrl && (p.showRead || p.showDownload) && (
                    <div className="nl-card-footer">
                      {p.showRead && (
                        <a href={assetUrl(p.fileUrl)} className="nl-card-read" target="_blank" rel="noopener noreferrer">
                          {p.actionLabel || "Read online →"}
                        </a>
                      )}
                      {p.showDownload && (
                        <a href={assetUrl(p.fileUrl)} className="nl-card-dl" title="Download PDF" aria-label={`Download ${p.title}`} download>
                          <DownloadIcon />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
        {s(data, "footerLabel") && s(data, "footerHref") && (
          <div style={{ textAlign: "center", padding: "24px 0 0", borderTop: "1px solid var(--border)" }}>
            <p style={{ fontSize: 13, color: "var(--mud)", fontWeight: 300 }}>
              <SmartLink href={s(data, "footerHref")} style={{ color: "var(--cr)", textDecoration: "none", fontWeight: 400 }}>
                {s(data, "footerLabel")}
              </SmartLink>
            </p>
          </div>
        )}
      </section>
    </>
  );
}
