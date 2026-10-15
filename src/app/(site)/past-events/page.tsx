import { notFound } from "next/navigation";
import { RenderSections, findSection } from "@/components/sections/RenderSections";
import { EventCard } from "@/components/listing/EventCard";
import { FilterableGrid } from "@/components/listing/FilterableGrid";
import { cmsPageMetadata } from "@/components/site/CmsPage";
import { PageScope } from "@/components/site/PageScope";
import { s } from "@/components/sections/types";
import { listEvents } from "@/lib/queries/content";
import { getPublishedPage } from "@/lib/queries/site";
import { toPlainText } from "@/lib/sanitize";

export const generateMetadata = () => cmsPageMetadata("past-events", "/past-events");

/** Legacy past-events.html: archive, filters All / Workshops / Exhibitions, newest first, 6 per "Load more". */
export default async function PastEventsPage() {
  const [page, events] = await Promise.all([getPublishedPage("past-events"), listEvents("ARCHIVE")]);
  if (!page) notFound();
  const labels = findSection(page.sections, "listingFilters");
  return (
    <PageScope page="past-events">
      <RenderSections sections={page.sections} only={["pageHero"]} />
      <div className="section">
        <FilterableGrid
          pageSize={6}
          filters={[
            { key: "all", label: "All" },
            { key: "workshop", label: "Workshops" },
            { key: "exhibition", label: "Exhibitions" },
          ]}
          emptyText={s(labels, "emptyText", "No past events found")}
          cards={events.map((e) => {
            const firstPara = toPlainText(e.descriptionHtml.split("</p>")[0] ?? "");
            const subtitle = e.subtitle || (firstPara ? `${firstPara.substring(0, 120)}...` : "");
            return {
              key: e.id,
              matches: [e.type.toLowerCase()],
              node: (
                <EventCard
                  e={{ ...e, subtitle, city: e.city || "Chennai" }}
                  basePath="/events"
                  tag={e.tagLabel || "Past Event"}
                  defaultGradient="linear-gradient(160deg,#7A8B60,#4A5830)"
                />
              ),
            };
          })}
        />
      </div>
    </PageScope>
  );
}
