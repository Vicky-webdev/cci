"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function MediaUploader() {
  const router = useRouter();
  const [status, setStatus] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  async function upload(files: FileList) {
    setBusy(true);
    setStatus(null);
    const results: string[] = [];
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/media", { method: "POST", body: fd });
      const data = await res.json();
      results.push(res.ok ? `${file.name}: ${data.reused ? "already in library" : "uploaded"}` : `${file.name}: ${data.error}`);
    }
    setBusy(false);
    setStatus({ kind: results.some((r) => !/uploaded|already/.test(r)) ? "error" : "ok", text: results.join(" · ") });
    router.refresh();
  }
  return (
    <div>
      <label className="a-btn">
        {busy ? "Uploading…" : "Upload files"}
        <input type="file" multiple hidden disabled={busy} onChange={(e) => e.target.files?.length && upload(e.target.files)} />
      </label>
      {status && (
        <div className={`a-alert ${status.kind}`} style={{ marginTop: 10 }} role="status">
          {status.text}
        </div>
      )}
    </div>
  );
}
