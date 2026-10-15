"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteMediaAction, updateMediaAction } from "../actions";

export function MediaDetailForm({ id, initial, canUpdate, canDelete }: { id: string; initial: { alt: string; caption: string; title: string; folder: string }; canUpdate: boolean; canDelete: boolean }) {
  const [v, setV] = useState(initial);
  const [msg, setMsg] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [pending, start] = useTransition();
  const router = useRouter();
  const field = (name: keyof typeof v, label: string, help?: string) => (
    <div className="a-field">
      <label htmlFor={`m-${name}`}>{label}</label>
      <input id={`m-${name}`} className="a-input" value={v[name]} onChange={(e) => setV({ ...v, [name]: e.target.value })} disabled={!canUpdate} />
      {help && <div className="a-help">{help}</div>}
    </div>
  );
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        start(async () => {
          const r = await updateMediaAction(id, v);
          setMsg(r.ok ? { kind: "ok", text: r.message } : { kind: "error", text: r.error });
        });
      }}
    >
      {msg && <div className={`a-alert ${msg.kind}`}>{msg.text}</div>}
      {field("alt", "Alt text", "Describe the image for people who cannot see it. Leave empty only for decorative images.")}
      {field("title", "Title")}
      {field("caption", "Caption")}
      {field("folder", "Folder / collection")}
      <div className="a-row">
        {canUpdate && <button className="a-btn" disabled={pending}>Save details</button>}
        {canDelete && (
          <button
            type="button"
            className="a-btn danger"
            disabled={pending}
            onClick={() =>
              window.confirm("Delete this file permanently?") &&
              start(async () => {
                const r = await deleteMediaAction(id);
                if (r.ok) router.push("/admin/media");
                else setMsg({ kind: "error", text: r.error });
              })
            }
          >
            Delete file
          </button>
        )}
      </div>
    </form>
  );
}
