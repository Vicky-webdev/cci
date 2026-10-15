import { notFound } from "next/navigation";
import { RenderSections, findSection } from "@/components/sections/RenderSections";
import { EventCard } from "@/components/listing/EventCard";
import { FilterableGrid } from "@/components/listing/FilterableGrid";
import { SmartLink } from "@/components/site/SmartLink";
import { cmsPageMetadata } from "@/components/site/CmsPage";
import { PageScope } from "@/components/site/PageScope";
import { s } from "@/components/sections/types";
import { listEvents } from "@/lib/queries/content";
import { getPublishedPage } from "@/lib/queries/site";
import { isUpcoming } from "@/lib/dates";

export const generateMetadata = () => cmsPageMetadata("events", "/events");

/** Legacy events.html: filters All / Upcoming / Workshops / Exhibitions; upcoming first, then newest. */
export default async function EventsPage() {
  const [page, events] = await Promise.all([getPublishedPage("events"), listEvents("CURRENT")]);
  if (!page) notFound();
  const labels = findSection(page.sections, "listingFilters");
  const withStatus = events.map((e) => ({ e, upcoming: isUpcoming(e.startDate) }));
  const time = (d: Date | null) => d?.getTime() ?? 0;
  withStatus.sort((a, b) => (a.upcoming === b.upcoming ? time(b.e.startDate) - time(a.e.startDate) : a.upcoming ? -1 : 1));
  return (
    <PageScope page="events">
      <RenderSections sections={page.sections} only={["pageHero"]} />
      <div className="section">
        <FilterableGrid
          filters={[
            { key: "all", label: "All Events" },
            { key: "upcoming", label: "Upcoming" },
            { key: "workshop", label: "Workshops" },
            { key: "exhibition", label: "Exhibitions" },
          ]}
          emptyText={s(labels, "emptyText", "No events found")}
          emptyHint={s(labels, "emptyHint")}
          cards={withStatus.map(({ e, upcoming }) => ({
            key: e.id,
            matches: [upcoming ? "upcoming" : "", e.type].filter(Boolean),
            node: (
              <EventCard
                e={e}
                basePath="/events"
                tag={upcoming ? e.tagLabel || "Upcoming Event" : "Events & Highlights"}
                tagClass={e.tagClass}
              />
            ),
          }))}
        />
      </div>
      {s(labels, "footerLabel") && (
        <div style={{ textAlign: "center", padding: "24px 0 0", borderTop: "1px solid var(--border)" }}>
          <p style={{ fontSize: 13, color: "var(--mud)", fontWeight: 300 }}>
            <SmartLink href={s(labels, "footerHref")} style={{ color: "var(--cr)", textDecoration: "none", fontWeight: 400 }}>
              {s(labels, "footerLabel")}
            </SmartLink>
          </p>
          <p>
            <br />
          </p>
        </div>
      )}
    </PageScope>
  );
}
