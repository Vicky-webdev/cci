import Link from "next/link";

export const metadata = { title: "Not allowed" };

export default function Forbidden() {
  return (
    <div className="a-card">
      <h1>You don&apos;t have access to this area</h1>
      <p className="a-muted">Your role does not include the permission needed here. Ask a Super Admin if you need it.</p>
      <Link className="a-btn secondary" href="/admin">
        Back to dashboard
      </Link>
    </div>
  );
}
