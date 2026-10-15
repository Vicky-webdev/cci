import Link from "next/link";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { requireUser } from "@/lib/auth/guards";
import { hasPermission } from "@/lib/auth/permissions";
import { ADMIN_NAV } from "@/lib/admin/nav";
import { logoutAction } from "./actions";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const groups = ADMIN_NAV.map((g) => ({
    group: g.group,
    items: g.items.filter((it) => it.anyOf.includes("*any") || it.anyOf.some((p) => hasPermission(user, p))).map(({ href, label }) => ({ href, label })),
  })).filter((g) => g.items.length);
  return (
    <div className="a-shell">
      <AdminSidebar groups={groups} />
      <div className="a-main">
        <header className="a-top">
          <div className="a-row">
            <Link href="/" target="_blank" className="a-small">
              View website ↗
            </Link>
          </div>
          <div className="a-row">
            <span className="a-small a-muted">
              {user.name} · {user.roleKeys.join(", ") || "no role"}
            </span>
            <form action={logoutAction}>
              <button className="a-btn secondary small" type="submit">
                Sign out
              </button>
            </form>
          </div>
        </header>
        {user.mustChangePassword && (
          <div className="a-content" style={{ paddingBottom: 0 }}>
            <div className="a-alert info">
              Please <Link href="/admin/account">set a new password</Link> before continuing.
            </div>
          </div>
        )}
        <div className="a-content">{children}</div>
      </div>
    </div>
  );
}

