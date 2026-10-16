import { notFound } from "next/navigation";
import { RenderSections } from "@/components/sections/RenderSections";
import { getPublishedPage } from "@/lib/queries/site";
import { buildMetadata, pageDescription } from "@/lib/seo";

export async function generateMetadata() {
  const page = await getPublishedPage("home");
  if (!page) return {};
  return buildMetadata({ metaTitle: page.metaTitle, title: page.title, description: pageDescription(page), path: "/", image: page.ogImage, noindex: page.noindex });
}

export default async function HomePage() {
  const page = await getPublishedPage("home");
  if (!page) notFound();
  return <RenderSections sections={page.sections} />;
}
