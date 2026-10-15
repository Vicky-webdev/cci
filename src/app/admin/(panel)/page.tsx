import Link from "next/link";
import { requireUser } from "@/lib/auth/guards";
import { hasPermission } from "@/lib/auth/permissions";
import { db } from "@/lib/db";
import { publishedWhere } from "@/lib/content/publishing";

export const metadata = { title: "Dashboard" };

export default async function Dashboard() {
  const user = await requireUser();
  const live = publishedWhere();
  const [pages, events, news, press, pubs, media, review, newSubs, failedMail] = await Promise.all([
    db.page.count({ where: live }),
    db.event.count({ where: live }),
    db.newsArticle.count({ where: live }),
    db.pressItem.count({ where: live }),
    db.publication.count({ where: live }),
    db.media.count(),
    Promise.all([
      db.page.findMany({ where: { status: "IN_REVIEW" }, select: { id: true, title: true } }),
      db.event.findMany({ where: { status: "IN_REVIEW" }, select: { id: true, title: true } }),
      db.newsArticle.findMany({ where: { status: "IN_REVIEW" }, select: { id: true, title: true } }),
      db.pressItem.findMany({ where: { status: "IN_REVIEW" }, select: { id: true, title: true } }),
      db.publication.findMany({ where: { status: "IN_REVIEW" }, select: { id: true, title: true } }),
    ]),
    hasPermission(user, "submissions.read") ? db.formSubmission.count({ where: { status: "NEW" } }) : Promise.resolve(null),
    hasPermission(user, "submissions.read") ? db.formSubmission.count({ where: { emailStatus: "FAILED" } }) : Promise.resolve(null),
  ]);
  const keys = ["pages", "events", "news", "press", "publications"];
  const inReview = review.flatMap((list, i) => list.map((r) => ({ ...r, key: keys[i] })));
  const recent = hasPermission(user, "audit.read")
    ? await db.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 8, include: { actor: { select: { name: true } } } })
    : [];
  const stats = [
    ["Published pages", pages, "/admin/content/pages"],
    ["Published events", events, "/admin/content/events"],
    ["Published news", news, "/admin/content/news"],
    ["Press items", press, "/admin/content/press"],
    ["Publications", pubs, "/admin/content/publications"],
    ["Media files", media, "/admin/media"],
  ] as const;
  return (
    <>
      <h1>Welcome, {user.name}</h1>
      <p className="a-muted" style={{ marginBottom: 18 }}>
        Manage the Crafts Council of India website.
      </p>
      <div className="a-grid" style={{ marginBottom: 18 }}>
        {stats.map(([label, n, href]) => (
          <Link key={label} href={href} className="a-card" style={{ textDecoration: "none", color: "inherit", marginBottom: 0 }}>
            <div className="a-stat">{n}</div>
            <div className="a-muted">{label}</div>
          </Link>
        ))}
        {newSubs !== null && (
          <Link href="/admin/submissions" className="a-card" style={{ textDecoration: "none", color: "inherit", marginBottom: 0 }}>
            <div className="a-stat">{newSubs}</div>
            <div className="a-muted">New enquiries{failedMail ? ` · ${failedMail} email failures` : ""}</div>
          </Link>
        )}
      </div>
      <div className="a-card">
        <h2>Waiting for review</h2>
        {inReview.length ? (
          <ul>
            {inReview.map((r) => (
              <li key={r.id}>
                <Link href={`/admin/content/${r.key}/${r.id}`}>{r.title}</Link> <span className="a-muted a-small">({r.key})</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="a-muted">Nothing is waiting for review.</p>
        )}
      </div>
      {recent.length > 0 && (
        <div className="a-card">
          <h2>Recent activity</h2>
          <ul style={{ paddingLeft: 18 }}>
            {recent.map((a) => (
              <li key={a.id} className="a-small">
                {a.createdAt.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} — <strong>{a.actor?.name ?? "System"}</strong>: {a.summary || a.action}
              </li>
            ))}
          </ul>
          <Link href="/admin/audit">Full audit log →</Link>
        </div>
      )}
    </>
  );
}
