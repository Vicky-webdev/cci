import type { Section } from "@/lib/content/sections";
import { PageHero } from "./PageHero";
import {
  ArtisansSection,
  HeroSection,
  HomeAwardsSection,
  HomeEventsSection,
  MarqueeSection,
  MissionSection,
  QuoteSection,
  RetailSection,
} from "./HomeSections";
import {
  AnchorBarSection,
  AwardCategoriesSection,
  AwardeeCardsSection,
  AwardTablesSection,
  CouncilsSection,
  FeatureBlockSection,
  HistorySection,
  KamalaCallSection,
  PublicationsSection,
  RichTextSection,
  TeamSection,
  VisionMissionSection,
} from "./InnerSections";
import { ContactSection } from "./ContactSection";
import type { SectionData } from "./types";

type Renderer = (props: { data: SectionData }) => React.ReactNode | Promise<React.ReactNode>;

const RENDERERS: Record<string, Renderer> = {
  pageHero: PageHero,
  heroSlider: HeroSection,
  marquee: MarqueeSection,
  quote: QuoteSection,
  mission: MissionSection,
  artisans: ArtisansSection,
  retail: RetailSection,
  homeEvents: HomeEventsSection,
  homeAwards: HomeAwardsSection,
  history: HistorySection,
  visionMission: VisionMissionSection,
  team: TeamSection,
  anchorBar: AnchorBarSection,
  featureBlock: FeatureBlockSection,
  kamalaCall: KamalaCallSection,
  awardCategories: AwardCategoriesSection,
  awardeeCards: AwardeeCardsSection,
  awardTables: AwardTablesSection,
  contact: ContactSection,
  councils: CouncilsSection,
  richText: RichTextSection,
  publications: PublicationsSection,
  // Rendered by the listing page itself (labels only).
  listingFilters: () => null,
};

export function RenderSections({ sections, only }: { sections: Section[]; only?: string[] }) {
  return (
    <>
      {sections
        .filter((s) => !only || only.includes(s.type))
        .map((section) => {
          const Component = RENDERERS[section.type];
          return Component ? <Component key={section.id} data={section.data} /> : null;
        })}
    </>
  );
}

export function findSection(sections: Section[], type: string): SectionData {
  return (sections.find((s) => s.type === type)?.data ?? {}) as SectionData;
}
