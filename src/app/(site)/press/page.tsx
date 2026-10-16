import Link from "next/link";
import { notFound } from "next/navigation";
import { RenderSections, findSection } from "@/components/sections/RenderSections";
import { FilterableGrid } from "@/components/listing/FilterableGrid";
import { cmsPageMetadata } from "@/components/site/CmsPage";
import { PageScope } from "@/components/site/PageScope";
import { s } from "@/components/sections/types";
import { listPress } from "@/lib/queries/content";
import { getPublishedPage } from "@/lib/queries/site";
import { cssUrl } from "@/lib/links";

export const generateMetadata = () => cmsPageMetadata("press", "/press");

const yearLabel = (y: string) => y.replace(/^(\d{4})-(\d{4})$/, "$1 - $2");

/** Legacy press.html: year filters, newest year first, PDF covers fall back to the gradient + 📰. */
export default async function PressPage() {
  const [page, press] = await Promise.all([getPublishedPage("press"), listPress()]);
  if (!page) notFound();
  const labels = findSection(page.sections, "listingFilters");
  const sorted = [...press].sort((a, b) => parseInt(b.year) - parseInt(a.year));
  const years = [...new Set(sorted.map((p) => p.year))];
  return (
    <PageScope page="press">
      <RenderSections sections={page.sections} only={["pageHero"]} />
      <div className="section">
        <FilterableGrid
          gridId="pressGrid"
          filters={[{ key: "all", label: "All" }, ...years.map((y) => ({ key: y, label: yearLabel(y) }))]}
          emptyText={s(labels, "emptyText", "No press coverage found")}
          cards={sorted.map((p) => {
            const isImage = p.image && !/\.pdf$/i.test(p.image);
            return {
              key: p.id,
              matches: [p.year],
              node: (
                <div className="event-card card-hover">
                  <Link href={`/press/${p.slug}`} className="event-image-link" aria-label={p.title} tabIndex={-1}>
                    {isImage ? (
                      <div className="event-image" style={{ backgroundImage: cssUrl(p.image), backgroundSize: "cover", backgroundPosition: "center top" }}>
                        <div className="event-overlay"></div>
                      </div>
                    ) : (
                      <div className="event-image" style={{ background: p.heroGradient || "linear-gradient(160deg,#5B7053,#2E2418)" }}>
                        📰
                      </div>
                    )}
                  </Link>
                  <div className="event-content">
                    <div className="event-meta">
                      <span className="event-tag">{p.year}</span>
                    </div>
                    <h3 className="event-title">{p.title}</h3>
                    <p className="event-desc">{p.subtitle}</p>
                    <Link href={`/press/${p.slug}`} className="event-link">
                      Read Coverage →
                    </Link>
                  </div>
                </div>
              ),
            };
          })}
        />
      </div>
    </PageScope>
  );
}
