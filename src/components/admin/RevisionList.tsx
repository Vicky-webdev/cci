"use client";

import { useRouter } from "next/navigation";
import { useTransition, useState } from "react";
import { restoreRevision } from "@/lib/admin/resource-actions";

export function RevisionList({
  resourceKey,
  id,
  revisions,
  canRestore,
}: {
  resourceKey: string;
  id: string;
  revisions: { id: string; createdAt: string; note: string; author: string }[];
  canRestore: boolean;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState("");
  if (!revisions.length) return <p className="a-muted a-small">No revisions yet. One is saved every time this record changes.</p>;
  return (
    <div>
      {msg && <div className="a-alert info">{msg}</div>}
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {revisions.map((r, i) => (
          <li key={r.id} style={{ padding: "8px 0", borderBottom: "1px solid var(--a-line)" }}>
            <div className="a-small">
              <strong>{r.note || "Saved"}</strong> · {new Date(r.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
            </div>
            <div className="a-small a-muted">{r.author}</div>
            {canRestore && i > 0 && (
              <button
                type="button"
                className="a-btn secondary small"
                style={{ marginTop: 4 }}
                disabled={pending}
                onClick={() =>
                  window.confirm("Restore this version? The current content is kept as a revision too.") &&
                  start(async () => {
                    const res = await restoreRevision(resourceKey, id, r.id);
                    setMsg(res.ok ? "Restored." : res.error);
                    router.refresh();
                  })
                }
              >
                Restore this version
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
