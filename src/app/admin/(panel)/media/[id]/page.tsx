import Link from "next/link";
import { notFound } from "next/navigation";
import { requirePagePermission } from "@/lib/auth/guards";
import { hasPermission } from "@/lib/auth/permissions";
import { db } from "@/lib/db";
import { assetUrl } from "@/lib/links";
import { findMediaUsage } from "@/lib/media";
import { MediaDetailForm } from "./MediaDetailForm";

export default async function MediaDetail({ params }: { params: Promise<{ id: string }> }) {
  const user = await requirePagePermission("media.read");
  const m = await db.media.findUnique({ where: { id: (await params).id } });
  if (!m) notFound();
  const usage = await findMediaUsage(m.path);
  const url = assetUrl(m.path);
  return (
    <>
      <p className="a-small">
        <Link href="/admin/media">← Media library</Link>
      </p>
      <h1 style={{ wordBreak: "break-all" }}>{m.originalName}</h1>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 18 }} className="a-edit-grid">
        <div className="a-card">
          {m.mimeType.startsWith("image/") ? (
            // eslint-disable-next-line @next/next/no-img-element -- admin preview
            <img src={url} alt={m.alt} style={{ maxWidth: "100%", borderRadius: 6 }} />
          ) : m.mimeType.startsWith("video/") ? (
            <video src={url} controls style={{ maxWidth: "100%" }} />
          ) : (
            <a href={url} target="_blank" rel="noreferrer" className="a-btn secondary">Open file</a>
          )}
          <dl className="a-small" style={{ marginTop: 12 }}>
            <dt><strong>Path / URL</strong></dt>
            <dd><code>{m.path}</code> — <a href={url} target="_blank" rel="noreferrer">{url}</a></dd>
            <dt><strong>Type · size</strong></dt>
            <dd>{m.mimeType} · {(m.size / 1024).toFixed(0)} KB{m.width ? ` · ${m.width}×${m.height}px` : ""}</dd>
            <dt><strong>Source</strong></dt>
            <dd>{m.storage === "LEGACY" ? "Original file from the legacy site (protected)" : "Uploaded through the CMS"}</dd>
          </dl>
        </div>
        <div>
          <div className="a-card">
            <h2>Details</h2>
            <MediaDetailForm
              id={m.id}
              initial={{ alt: m.alt, caption: m.caption, title: m.title, folder: m.folder }}
              canUpdate={hasPermission(user, "media.update")}
              canDelete={hasPermission(user, "media.delete") && m.storage === "LOCAL" && usage.length === 0}
            />
          </div>
          <div className="a-card">
            <h2>Used in ({usage.length})</h2>
            {usage.length ? (
              <ul>
                {usage.map((u) => (
                  <li key={`${u.type}${u.id}`}>
                    {u.type}: <Link href={u.href}>{u.title}</Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="a-muted">Not referenced by any content or setting.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
