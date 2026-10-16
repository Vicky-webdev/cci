import Link from "next/link";
import { MediaUploader } from "@/components/admin/MediaUploader";
import { requirePagePermission } from "@/lib/auth/guards";
import { hasPermission } from "@/lib/auth/permissions";
import { db } from "@/lib/db";
import { assetUrl } from "@/lib/links";
import type { Prisma } from "@/generated/prisma/client";

export const metadata = { title: "Media library" };
const PAGE = 60;

export default async function MediaPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const user = await requirePagePermission("media.read");
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page ?? 1));
  const where: Prisma.MediaWhereInput = {
    ...(sp.q ? { OR: [{ path: { contains: sp.q, mode: "insensitive" } }, { title: { contains: sp.q, mode: "insensitive" } }, { alt: { contains: sp.q, mode: "insensitive" } }] } : {}),
    ...(sp.type === "image" ? { mimeType: { startsWith: "image/" } } : sp.type === "video" ? { mimeType: { startsWith: "video/" } } : sp.type === "document" ? { mimeType: { in: ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"] } } : {}),
    ...(sp.storage === "LEGACY" || sp.storage === "LOCAL" ? { storage: sp.storage } : {}),
  };
  const [total, items] = await Promise.all([
    db.media.count({ where }),
    db.media.findMany({ where, orderBy: [{ createdAt: "desc" }, { path: "asc" }], skip: (page - 1) * PAGE, take: PAGE }),
  ]);
  const pages = Math.max(1, Math.ceil(total / PAGE));
  const qs = (p: number) => new URLSearchParams({ ...Object.fromEntries(Object.entries(sp).filter(([k, v]) => v && k !== "page")) as Record<string, string>, page: String(p) }).toString();
  return (
    <>
      <div className="a-spread">
        <div>
          <h1>Media library</h1>
          <p className="a-muted">{total} files. Originals from the legacy site are protected; new uploads go to the upload store.</p>
        </div>
        {hasPermission(user, "media.upload") && <MediaUploader />}
      </div>
      <form className="a-filters" method="get">
        <input className="a-input" type="search" name="q" defaultValue={sp.q ?? ""} placeholder="Search file name, folder, alt text…" aria-label="Search media" />
        <select name="type" defaultValue={sp.type ?? ""} aria-label="File type">
          <option value="">All types</option>
          <option value="image">Images</option>
          <option value="video">Videos</option>
          <option value="document">Documents</option>
        </select>
        <select name="storage" defaultValue={sp.storage ?? ""} aria-label="Source">
          <option value="">All sources</option>
          <option value="LEGACY">Legacy site files</option>
          <option value="LOCAL">CMS uploads</option>
        </select>
        <button className="a-btn secondary">Filter</button>
      </form>
      <div className="a-media-grid">
        {items.map((m) => (
          <Link key={m.id} href={`/admin/media/${m.id}`} className="a-media-tile" style={{ textDecoration: "none" }}>
            <div className="a-media-img" style={m.mimeType.startsWith("image/") ? { backgroundImage: `url("${assetUrl(m.path)}")` } : undefined}>
              {m.mimeType.startsWith("video/") ? "🎬" : !m.mimeType.startsWith("image/") ? "📄" : null}
            </div>
            <div className="a-media-name">
              {m.path}
              {!m.alt && m.mimeType.startsWith("image/") && <span style={{ color: "var(--a-warn)" }}> · no alt</span>}
            </div>
          </Link>
        ))}
      </div>
      {pages > 1 && (
        <nav className="a-pagination" aria-label="Pagination">
          {page > 1 && <Link className="a-btn secondary small" href={`?${qs(page - 1)}`}>← Previous</Link>}
          <span className="a-small a-muted">Page {page} of {pages}</span>
          {page < pages && <Link className="a-btn secondary small" href={`?${qs(page + 1)}`}>Next →</Link>}
        </nav>
      )}
    </>
  );
}
