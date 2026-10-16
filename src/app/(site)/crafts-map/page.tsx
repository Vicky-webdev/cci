import { notFound } from "next/navigation";
import { RenderSections, findSection } from "@/components/sections/RenderSections";
import { CraftsMap, type MapState } from "@/components/crafts-map/CraftsMap";
import { cmsPageMetadata } from "@/components/site/CmsPage";
import { PageScope } from "@/components/site/PageScope";
import { s } from "@/components/sections/types";
import { listCraftStates } from "@/lib/queries/content";
import { getPublishedPage } from "@/lib/queries/site";
import { assetUrl } from "@/lib/links";

export const generateMetadata = () => cmsPageMetadata("crafts-map", "/crafts-map");

export default async function CraftsMapPage() {
  const [page, states] = await Promise.all([getPublishedPage("crafts-map"), listCraftStates()]);
  if (!page) notFound();
  const labels = findSection(page.sections, "listingFilters");
  // Same aggregation as legacy transformData(): unique crafts per state and per district, first-seen order.
  const byCode: Record<string, MapState> = {};
  for (const st of states) {
    const districts = new Map<string, Set<string>>();
    for (const loc of st.locations) {
      if (!districts.has(loc.district)) districts.set(loc.district, new Set());
      districts.get(loc.district)!.add(loc.craft);
    }
    byCode[st.code] = {
      code: st.code,
      name: st.name,
      crafts: [...new Set(st.locations.map((l) => l.craft))],
      districts: [...districts.entries()].map(([d, c]) => ({ d, c: [...c] })),
      mapImage: assetUrl(st.mapImage),
    };
  }
  return (
    <PageScope page="crafts-map">
      <RenderSections sections={page.sections} only={["pageHero"]} />
      <CraftsMap states={byCode} intro={s(labels, "intro")} />
      {/* Crawlable summary of the same data for search engines and no-JS visitors. */}
      <noscript>
        <div className="section">
          {states.map((st) => (
            <p key={st.id}>
              <strong>{st.name}:</strong> {[...new Set(st.locations.map((l) => l.craft))].join(", ")}
            </p>
          ))}
        </div>
      </noscript>
    </PageScope>
  );
}
