"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { PERMISSION_GROUPS } from "@/lib/auth/permissions";
import { deleteRoleAction, saveRoleAction } from "./actions";

export function RoleForm({ role }: { role: { id: string; key: string; name: string; description: string; permissions: string[]; isSystem: boolean; locked: boolean } | null }) {
  const router = useRouter();
  const [name, setName] = useState(role?.name ?? "");
  const [key, setKey] = useState(role?.key ?? "");
  const [description, setDescription] = useState(role?.description ?? "");
  const [perms, setPerms] = useState<string[]>(role?.permissions ?? []);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, start] = useTransition();
  const locked = role?.locked ?? false;
  const toggle = (p: string) => setPerms((cur) => (cur.includes(p) ? cur.filter((x) => x !== p) : [...cur, p]));
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        start(async () => {
          const r = await saveRoleAction(role?.id ?? null, { name, key, description, permissions: perms });
          setMsg({ ok: r.ok, text: r.ok ? r.message : r.error });
          if (r.ok && !role && r.id) router.replace(`/admin/roles/${r.id}`);
          else router.refresh();
        });
      }}
    >
      {msg && <div className={`a-alert ${msg.ok ? "ok" : "error"}`} role="status">{msg.text}</div>}
      {locked && <div className="a-alert info">Super Admin has full access to everything and cannot be edited.</div>}
      <fieldset disabled={locked || pending} className="a-fieldset">
        <legend>Role</legend>
        <div className="a-field">
          <label htmlFor="r-name">Name</label>
          <input id="r-name" className="a-input" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="a-field">
          <label htmlFor="r-key">Key</label>
          <input id="r-key" className="a-input" value={key} onChange={(e) => setKey(e.target.value)} disabled={!!role} required />
        </div>
        <div className="a-field">
          <label htmlFor="r-desc">Description</label>
          <input id="r-desc" className="a-input" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
      </fieldset>
      <fieldset disabled={locked || pending} className="a-fieldset">
        <legend>Permissions</legend>
        <div className="a-perm-grid">
          {PERMISSION_GROUPS.map((g) => (
            <div key={g.label}>
              <strong className="a-small">{g.label}</strong>
              {g.permissions.map((p) => (
                <label key={p} className="a-check a-small" style={{ fontWeight: 400 }}>
                  <input type="checkbox" checked={perms.includes("*") || perms.includes(p)} onChange={() => toggle(p)} /> <code>{p}</code>
                </label>
              ))}
            </div>
          ))}
        </div>
      </fieldset>
      {!locked && (
        <div className="a-row">
          <button className="a-btn" disabled={pending}>{role ? "Save role" : "Create role"}</button>
          {role && !role.isSystem && (
            <button
              type="button"
              className="a-btn danger"
              disabled={pending}
              onClick={() =>
                window.confirm("Delete this role?") &&
                start(async () => {
                  const r = await deleteRoleAction(role.id);
                  if (r.ok) router.push("/admin/roles");
                  else setMsg({ ok: false, text: r.error });
                })
              }
            >
              Delete role
            </button>
          )}
        </div>
      )}
    </form>
  );
}
