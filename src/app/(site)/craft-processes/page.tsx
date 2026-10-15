import { notFound } from "next/navigation";
import { RenderSections, findSection } from "@/components/sections/RenderSections";
import { ProcessExplorer } from "@/components/crafts-map/ProcessExplorer";
import { cmsPageMetadata } from "@/components/site/CmsPage";
import { PageScope } from "@/components/site/PageScope";
import { s } from "@/components/sections/types";
import { listProcesses } from "@/lib/queries/content";
import { getPublishedPage } from "@/lib/queries/site";
import { assetUrl } from "@/lib/links";

export const generateMetadata = () => cmsPageMetadata("craft-processes", "/craft-processes");

export default async function CraftProcessesPage() {
  const [page, processes] = await Promise.all([getPublishedPage("craft-processes"), listProcesses()]);
  if (!page) notFound();
  const labels = findSection(page.sections, "listingFilters");
  return (
    <PageScope page="craft-processes">
      <RenderSections sections={page.sections} only={["pageHero"]} />
      <section className="process-section">
        <div className="process-inner">
          <div style={{ textAlign: "center", maxWidth: 700, margin: "0 auto" }}>
            <p className="s-text" style={{ marginTop: 12 }}>
              {s(labels, "intro")}
            </p>
          </div>
          <ProcessExplorer
            processes={processes.map((p) => ({
              slug: p.slug,
              category: p.category,
              icon: assetUrl(p.icon),
              color: p.color,
              title: p.title,
              subtitle: p.subtitle,
              intro: p.intro,
              materials: p.materials,
              steps: (p.steps as { title: string; text: string }[]) ?? [],
              states: p.states,
            }))}
          />
        </div>
      </section>
    </PageScope>
  );
}
