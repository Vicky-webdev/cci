import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { GalleryLightbox, type LightboxItem } from "@/components/detail/GalleryLightbox";
import { JsonLd } from "@/components/site/JsonLd";
import { PageScope } from "@/components/site/PageScope";
import { findPressSlugByLegacyId, getPress } from "@/lib/queries/content";
import { assetUrl, cssUrl } from "@/lib/links";
import { buildMetadata } from "@/lib/seo";
import { siteUrl } from "@/lib/env";

type Props = { params: Promise<{ slug: string }> };
const isPdf = (p: string) => /\.pdf$/i.test(p);

async function load(slug: string) {
  const p = await getPress(slug);
  if (p) return p;
  const canonical = await findPressSlugByLegacyId(slug);
  if (canonical && canonical !== slug) permanentRedirect(`/press/${canonical}`);
  notFound();
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const p = await getPress(slug);
  if (!p) return {};
  return buildMetadata({
    metaTitle: p.metaTitle || `${p.title} — Press — Crafts Council of India`,
    title: p.title,
    description: p.metaDescription || p.subtitle,
    path: `/press/${p.slug}`,
    image: p.image && !isPdf(p.image) ? p.image : null,
    noindex: p.noindex,
  });
}

export default async function PressDetailPage({ params }: Props) {
  const { slug } = await params;
  const p = await load(slug);
  // Page-wide index across media groups (PDFs excluded) so thumbnails map to the right lightbox slot.
  const lightboxItems: LightboxItem[] = p.groups.flatMap((g) => g.items.filter((i) => !isPdf(i)).map((src) => ({ src: assetUrl(src), isVideo: false, alt: g.media })));
  let imgIndex = 0;
  return (
    <PageScope page="press-details">
      <GalleryLightbox items={lightboxItems}>
        <div id="eventPage">
          <div className="ed-hero">
            <div
              className="ed-hero-bg"
              style={p.image && !isPdf(p.image) ? { backgroundImage: cssUrl(p.image), backgroundSize: "cover", backgroundPosition: "center top" } : { background: p.heroGradient || "linear-gradient(160deg,#5B7053,#2E2418)" }}
            ></div>
            <div className="ed-hero-overlay"></div>
            <div className="ed-hero-content">
              <div className="ed-breadcrumb" role="navigation" aria-label="Breadcrumb">
                <Link href="/">Home</Link>
                <span>›</span>
                <Link href="/press">Press</Link>
                <span>›</span>
                <span style={{ color: "rgba(250,246,239,.85)" }} aria-current="page">
                  {p.title}
                </span>
              </div>
              <span className="ed-tag past">{p.year}</span>
              <h1 className="ed-title">{p.title}</h1>
              <div className="ed-meta-row">
                <div className="ed-meta-item">📰 Press Coverage</div>
                <div className="ed-meta-item">📅 {p.year}</div>
              </div>
            </div>
          </div>
          <div className="ed-body">
            <div className="ed-main">
              <span className="ed-section-label">About this coverage</span>
              <div className="ed-divider"></div>
              <div className="ed-description">
                <p>{p.subtitle}</p>
              </div>
              {p.groups.map((g) => (
                <div className="press-media-block" key={g.id}>
                  <span className="ed-section-label">{g.media}</span>
                  <div className="press-meta-row">
                    {g.dateText && <div className="press-date">📅 {g.dateText}</div>}
                    {g.readOnlineUrl && (
                      <a href={g.readOnlineUrl} target="_blank" rel="noopener noreferrer" className="read-online-btn">
                        Read Online ↗
                      </a>
                    )}
                  </div>
                  <div className="ed-divider"></div>
                  <div className="ed-gallery">
                    {g.items.map((item, i) => {
                      if (isPdf(item)) {
                        return (
                          <a
                            key={i}
                            href={assetUrl(item)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ed-gallery-item pdf-item"
                            style={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", padding: 20, textDecoration: "none", background: "#f5f1e8", borderRadius: 14, minHeight: 240 }}
                          >
                            <div style={{ fontSize: 60 }} aria-hidden="true">
                              📄
                            </div>
                            <div style={{ marginTop: 12, fontSize: 14, fontWeight: 600, color: "#2E2418", wordBreak: "break-word", textAlign: "center" }}></div>
                            <div style={{ marginTop: 10, fontSize: 13, color: "#8B6914" }}>Open PDF</div>
                          </a>
                        );
                      }
                      const idx = imgIndex++;
                      return (
                        <div className="ed-gallery-item" data-index={idx} data-lightbox-index={idx} key={i} role="button" tabIndex={0} aria-label={`Open ${g.media} clipping ${i + 1}`}>
                          {/* eslint-disable-next-line @next/next/no-img-element -- press clippings shown at full resolution */}
                          <img src={assetUrl(item)} alt={g.media} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} loading="lazy" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </GalleryLightbox>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: siteUrl("/") },
            { "@type": "ListItem", position: 2, name: "Press", item: siteUrl("/press") },
            { "@type": "ListItem", position: 3, name: p.title, item: siteUrl(`/press/${p.slug}`) },
          ],
        }}
      />
    </PageScope>
  );
}
