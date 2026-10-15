import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { GalleryLightbox, type LightboxItem } from "@/components/detail/GalleryLightbox";
import { RichHtml } from "@/components/ui/Html";
import { JsonLd } from "@/components/site/JsonLd";
import { PageScope } from "@/components/site/PageScope";
import { findNewsSlugByLegacyId, getNews } from "@/lib/queries/content";
import { assetUrl, cssUrl } from "@/lib/links";
import { buildMetadata } from "@/lib/seo";
import { toPlainText, toYouTubeEmbed } from "@/lib/sanitize";
import { siteUrl } from "@/lib/env";

type Props = { params: Promise<{ slug: string }> };
type GalleryEntry = { type: "image"; src: string } | { type: "youtube"; url: string };

async function load(slug: string) {
  const n = await getNews(slug);
  if (n) return n;
  const canonical = await findNewsSlugByLegacyId(slug);
  if (canonical && canonical !== slug) permanentRedirect(`/news/${canonical}`);
  notFound();
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const n = await getNews(slug);
  if (!n) return {};
  return buildMetadata({
    metaTitle: n.metaTitle || `${n.title} — Crafts Council of India`,
    title: n.title,
    description: n.metaDescription || n.subtitle || toPlainText(n.bodyHtml),
    path: `/news/${n.slug}`,
    image: n.image,
    noindex: n.noindex,
    type: "article",
  });
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;
  const n = await load(slug);
  const gallery = (n.gallery as GalleryEntry[]) ?? [];
  const images = gallery.filter((g): g is { type: "image"; src: string } => g.type === "image");
  const lightboxItems: LightboxItem[] = images.map((g) => ({ src: assetUrl(g.src), isVideo: false }));
  let imageIndex = 0;
  return (
    <PageScope page="news-detail">
      <GalleryLightbox items={lightboxItems}>
        <div id="eventPage">
          <div className="ed-hero">
            <div className="ed-hero-bg" style={n.image ? { backgroundImage: cssUrl(n.image), backgroundSize: "cover", backgroundPosition: "center" } : { background: n.heroGradient }}></div>
            <div className="ed-hero-overlay"></div>
            <div className="ed-hero-content">
              <div className="ed-breadcrumb" role="navigation" aria-label="Breadcrumb">
                <Link href="/">Home</Link>
                <span>›</span>
                <Link href="/news">News</Link>
                <span>›</span>
                <span aria-current="page">{n.title}</span>
              </div>
              <h1 className="ed-title">{n.title}</h1>
              <p className="ed-subtitle">{n.subtitle}</p>
            </div>
          </div>
          <div className="ed-body">
            <div className="ed-main">
              <RichHtml className="ed-description" html={n.bodyHtml} />
              {gallery.length > 0 && (
                <div className="ed-gallery">
                  {gallery.map((g, i) => {
                    if (g.type === "youtube") {
                      const embed = toYouTubeEmbed(g.url);
                      return embed ? (
                        <div className="ed-gallery-item video-item" key={i}>
                          <iframe
                            width="100%"
                            height="315"
                            src={embed}
                            title={`${n.title} — video`}
                            allowFullScreen
                            referrerPolicy="strict-origin-when-cross-origin"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            loading="lazy"
                          />
                        </div>
                      ) : null;
                    }
                    const idx = imageIndex++;
                    return (
                      <div className="ed-gallery-item" data-index={idx} data-lightbox-index={idx} key={i} role="button" tabIndex={0} aria-label={`Open image ${idx + 1}`}>
                        {/* eslint-disable-next-line @next/next/no-img-element -- legacy gallery grid */}
                        <img src={assetUrl(g.src)} alt={`${n.title} — image ${idx + 1}`} loading="lazy" />
                      </div>
                    );
                  })}
                </div>
              )}
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
            { "@type": "ListItem", position: 2, name: "News", item: siteUrl("/news") },
            { "@type": "ListItem", position: 3, name: n.title, item: siteUrl(`/news/${n.slug}`) },
          ],
        }}
      />
    </PageScope>
  );
}
