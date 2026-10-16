import { requireUser } from "@/lib/auth/guards";
import { db } from "@/lib/db";
import { PasswordForm } from "./PasswordForm";
import { signOutEverywhereAction } from "./actions";

export const metadata = { title: "My account" };

export default async function AccountPage() {
  const user = await requireUser();
  const sessions = await db.session.findMany({
    where: { userId: user.id, revokedAt: null, expiresAt: { gt: new Date() } },
    orderBy: { lastSeenAt: "desc" },
  });
  return (
    <>
      <h1>My account</h1>
      <p className="a-muted" style={{ marginBottom: 18 }}>
        {user.email} · roles: {user.roleKeys.join(", ") || "none"}
      </p>
      {user.mustChangePassword && <div className="a-alert info">You are using a temporary password. Choose a new one to continue.</div>}
      <div className="a-card">
        <h2>Change password</h2>
        <PasswordForm />
      </div>
      <div className="a-card">
        <h2>Active sessions</h2>
        <table className="a-table">
          <thead>
            <tr>
              <th>Last seen</th>
              <th>IP</th>
              <th>Browser</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((s) => (
              <tr key={s.id}>
                <td>
                  {s.lastSeenAt.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
                  {s.id === user.sessionId && <span className="a-badge yes" style={{ marginLeft: 6 }}>This device</span>}
                </td>
                <td>{s.ip}</td>
                <td className="a-small">{s.userAgent}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <form action={signOutEverywhereAction} style={{ marginTop: 12 }}>
          <button className="a-btn secondary">Sign out all other sessions</button>
        </form>
      </div>
    </>
  );
}
