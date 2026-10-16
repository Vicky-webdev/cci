import { notFound, permanentRedirect, redirect } from "next/navigation";
import { RenderSections } from "@/components/sections/RenderSections";
import { PageScope } from "@/components/site/PageScope";
import { findRedirect, getPublishedPage } from "@/lib/queries/site";
import { buildMetadata, pageDescription } from "@/lib/seo";

type Props = { params: Promise<{ slug: string[] }> };

/** Any additional CMS page (e.g. /new-initiative), then admin-managed redirects, then 404. */
async function resolve(slugParts: string[]) {
  const slug = slugParts.map(decodeURIComponent).join("/");
  const page = slug === "home" ? null : await getPublishedPage(slug);
  return { slug, page };
}

export async function generateMetadata({ params }: Props) {
  const { page } = await resolve((await params).slug);
  if (!page) return {};
  return buildMetadata({
    metaTitle: page.metaTitle,
    title: page.title,
    description: pageDescription(page),
    path: page.canonicalUrl || `/${page.slug}`,
    image: page.ogImage,
    noindex: page.noindex,
  });
}

export default async function CatchAllPage({ params }: Props) {
  const { slug, page } = await resolve((await params).slug);
  if (page) {
    return (
      <PageScope page={page.slug.replace(/[^a-z0-9-]/gi, "-")}>
        <RenderSections sections={page.sections} />
      </PageScope>
    );
  }
  const r = await findRedirect(`/${slug}`);
  if (r) (r.permanent ? permanentRedirect : redirect)(r.destination);
  notFound();
}
