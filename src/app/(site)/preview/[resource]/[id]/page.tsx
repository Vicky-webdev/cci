import { notFound, redirect } from "next/navigation";
import { RenderSections } from "@/components/sections/RenderSections";
import { PageScope } from "@/components/site/PageScope";
import { EventDetailView } from "@/components/detail/event-detail";
import { NewsDetailView } from "@/components/detail/news-detail";
import { PressDetailView } from "@/components/detail/press-detail";
import { getSessionUser } from "@/lib/auth/session";
import { hasPermission } from "@/lib/auth/permissions";
import { readSections } from "@/lib/content/sections";
import { db } from "@/lib/db";

export const metadata = { robots: { index: false, follow: false }, title: "Preview" };

type Props = { params: Promise<{ resource: string; id: string }> };

/** Renders any record — including drafts — with the public templates, for signed-in users with read access. */
export default async function PreviewPage({ params }: Props) {
  const { resource, id } = await params;
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");
  if (!["pages", "events", "news", "press"].includes(resource) || !hasPermission(user, `${resource}.read`)) notFound();

  const banner = (status: string) => (
    <div style={{ position: "sticky", top: 0, zIndex: 2000, background: "#1f1a17", color: "#fff", padding: "8px 16px", fontSize: 13, textAlign: "center" }}>
      Preview — status: <strong>{status}</strong>. This page is not public.
    </div>
  );

  if (resource === "pages") {
    const page = await db.page.findUnique({ where: { id } });
    if (!page) notFound();
    return (
      <>
        {banner(page.status)}
        <PageScope page={page.slug}>
          <RenderSections sections={readSections(page.sections).filter((s) => !s.hidden)} />
        </PageScope>
      </>
    );
  }
  if (resource === "events") {
    const e = await db.event.findUnique({ where: { id } });
    if (!e) notFound();
    return (
      <>
        {banner(e.status)}
        <EventDetailView e={e} />
      </>
    );
  }
  if (resource === "news") {
    const n = await db.newsArticle.findUnique({ where: { id } });
    if (!n) notFound();
    return (
      <>
        {banner(n.status)}
        <NewsDetailView n={n} />
      </>
    );
  }
  const p = await db.pressItem.findUnique({ where: { id }, include: { groups: { orderBy: { sortOrder: "asc" } } } });
  if (!p) notFound();
  return (
    <>
      {banner(p.status)}
      <PressDetailView p={p} />
    </>
  );
}
