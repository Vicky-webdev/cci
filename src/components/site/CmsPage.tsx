import { notFound } from "next/navigation";
import { RenderSections } from "@/components/sections/RenderSections";
import { getPublishedPage } from "@/lib/queries/site";
import { buildMetadata, pageDescription } from "@/lib/seo";
import { PageScope } from "./PageScope";

/** Shared implementation for routes whose whole body is CMS sections. */
export async function cmsPageMetadata(slug: string, path: string) {
  const page = await getPublishedPage(slug);
  if (!page) return {};
  return buildMetadata({
    metaTitle: page.metaTitle,
    title: page.title,
    description: pageDescription(page),
    path: page.canonicalUrl || path,
    image: page.ogImage,
    noindex: page.noindex,
  });
}

export async function CmsPage({ slug }: { slug: string }) {
  const page = await getPublishedPage(slug);
  if (!page) notFound();
  return (
    <PageScope page={slug}>
      <RenderSections sections={page.sections} />
    </PageScope>
  );
}
