import { notFound } from "next/navigation";
import { RenderSections, findSection } from "@/components/sections/RenderSections";
import { EventCard } from "@/components/listing/EventCard";
import { FilterableGrid } from "@/components/listing/FilterableGrid";
import { cmsPageMetadata } from "@/components/site/CmsPage";
import { PageScope } from "@/components/site/PageScope";
import { s } from "@/components/sections/types";
import { listNews } from "@/lib/queries/content";
import { getPublishedPage } from "@/lib/queries/site";
import { isUpcoming, parseDateRange } from "@/lib/dates";

export const generateMetadata = () => cmsPageMetadata("news", "/news");

/** Legacy news.html: no filter buttons; dated "upcoming" items first, then the editorial order. */
export default async function NewsPage() {
  const [page, news] = await Promise.all([getPublishedPage("news"), listNews()]);
  if (!page) notFound();
  const labels = findSection(page.sections, "listingFilters");
  const items = news.map((n) => ({ n, upcoming: isUpcoming(parseDateRange(n.dateText)?.start) }));
  items.sort((a, b) => (a.upcoming === b.upcoming ? 0 : a.upcoming ? -1 : 1));
  return (
    <PageScope page="news">
      <RenderSections sections={page.sections} only={["pageHero"]} />
      <div className="section">
        <FilterableGrid
          filters={[]}
          emptyText={s(labels, "emptyText", "No news found")}
          emptyHint={s(labels, "emptyHint")}
          cards={items.map(({ n, upcoming }) => ({
            key: n.id,
            matches: [],
            node: <EventCard e={n} basePath="/news" showDate={false} tag={upcoming ? "Upcoming" : "News & Highlights"} />,
          }))}
        />
      </div>
    </PageScope>
  );
}
