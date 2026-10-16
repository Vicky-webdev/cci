"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createUserAction, resetPasswordAction, revokeSessionsAction, updateUserAction } from "./actions";

interface RoleOption {
  id: string;
  name: string;
  description: string;
}

export function UserForm({
  user,
  roles,
  canManage,
}: {
  user: { id: string; name: string; email: string; isActive: boolean; roleIds: string[] } | null;
  roles: RoleOption[];
  canManage: boolean;
}) {
  const router = useRouter();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [roleIds, setRoleIds] = useState<string[]>(user?.roleIds ?? []);
  const [isActive, setActive] = useState(user?.isActive ?? true);
  const [msg, setMsg] = useState<{ ok: boolean; text: string; pw?: string } | null>(null);
  const [pending, start] = useTransition();

  const toggle = (id: string) => setRoleIds((r) => (r.includes(id) ? r.filter((x) => x !== id) : [...r, id]));
  const run = (fn: () => Promise<{ ok: boolean; message?: string; error?: string; tempPassword?: string; id?: string }>) =>
    start(async () => {
      const r = await fn();
      setMsg({ ok: r.ok, text: (r.ok ? r.message : r.error) ?? "", pw: r.tempPassword });
      if (r.ok && !user && r.id) router.replace(`/admin/users/${r.id}?created=1`);
      else router.refresh();
    });

  return (
    <div>
      {msg && (
        <div className={`a-alert ${msg.ok ? "ok" : "error"}`} role="status">
          {msg.text}
          {msg.pw && (
            <div style={{ marginTop: 8 }}>
              Temporary password (shown once — share it securely): <code style={{ userSelect: "all" }}>{msg.pw}</code>
              <div className="a-small">The user must choose a new password at first sign-in.</div>
            </div>
          )}
        </div>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          run(() => (user ? updateUserAction(user.id, { name, roleIds, isActive }) : createUserAction({ name, email, roleIds })));
        }}
      >
        <fieldset disabled={!canManage || pending} className="a-fieldset">
          <legend>Account</legend>
          <div className="a-field">
            <label htmlFor="u-name">Name</label>
            <input id="u-name" className="a-input" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="a-field">
            <label htmlFor="u-email">Email</label>
            <input id="u-email" className="a-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={!!user} />
          </div>
          {user && (
            <label className="a-check">
              <input type="checkbox" checked={isActive} onChange={(e) => setActive(e.target.checked)} /> Account active
            </label>
          )}
          <div className="a-field" style={{ marginTop: 12 }}>
            <span className="a-label">Roles</span>
            {roles.map((r) => (
              <label key={r.id} className="a-check" style={{ marginBottom: 6 }}>
                <input type="checkbox" checked={roleIds.includes(r.id)} onChange={() => toggle(r.id)} />
                <span>
                  {r.name} <span className="a-small a-muted">— {r.description}</span>
                </span>
              </label>
            ))}
          </div>
          {canManage && <button className="a-btn" disabled={pending}>{user ? "Save" : "Create user"}</button>}
        </fieldset>
      </form>
      {user && canManage && (
        <div className="a-row">
          <button className="a-btn secondary" disabled={pending} onClick={() => window.confirm("Generate a new temporary password and sign this user out?") && run(() => resetPasswordAction(user.id))}>
            Reset password
          </button>
          <button className="a-btn secondary" disabled={pending} onClick={() => run(() => revokeSessionsAction(user.id))}>
            Sign out everywhere
          </button>
        </div>
      )}
    </div>
  );
}
