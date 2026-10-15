import Link from "next/link";

export default function NotFound() {
  return (
    <div className="pg-event-detail">
      <div className="page-hero">
        <div className="page-hero-content">
          <h1 className="page-title">Page not found</h1>
          <p className="page-subtitle">The page you are looking for doesn&apos;t exist or may have moved.</p>
        </div>
      </div>
      <div className="section" style={{ textAlign: "center" }}>
        <p style={{ marginBottom: 24 }}>Try one of these instead:</p>
        <p style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/" className="btn-primary">
            Home
          </Link>
          <Link href="/events" className="btn-ghost">
            Events
          </Link>
          <Link href="/news" className="btn-ghost">
            News
          </Link>
          <Link href="/contact" className="btn-ghost">
            Contact us
          </Link>
        </p>
      </div>
    </div>
  );
}
