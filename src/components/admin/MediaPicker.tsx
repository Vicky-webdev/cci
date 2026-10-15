"use client";

import { useCallback, useEffect, useState } from "react";

export interface MediaItem {
  id: string;
  path: string;
  url: string;
  originalName: string;
  mimeType: string;
  size: number;
  alt: string;
}

const isImage = (m: string) => m.startsWith("image/");
const isVideo = (m: string) => m.startsWith("video/");

export function mediaUrl(path: string) {
  if (!path) return "";
  if (/^https?:\/\//.test(path)) return path;
  return "/" + encodeURI(path.replace(/^\//, ""));
}

/** Modal to search the media library and pick (or upload) a file. */
export function MediaPicker({ accept, onSelect, onClose }: { accept: "image" | "file"; onSelect: (path: string) => void; onClose: () => void }) {
  const [q, setQ] = useState("");
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/media?q=${encodeURIComponent(q)}&type=${accept === "image" ? "visual" : "all"}&take=60`);
      if (!res.ok) throw new Error((await res.json()).error ?? "Could not load media");
      setItems((await res.json()).items);
    } catch (e) {
      setError((e as Error).message);
    }
    setLoading(false);
  }, [q, accept]);

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [load]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function upload(file: File) {
    setUploading(true);
    setError("");
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/media", { method: "POST", body: fd });
    const data = await res.json();
    setUploading(false);
    if (!res.ok) return setError(data.error ?? "Upload failed");
    onSelect(data.item.path);
  }

  return (
    <div className="a-modal-backdrop" role="dialog" aria-modal="true" aria-label="Choose a file" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="a-modal">
        <div className="a-spread">
          <h2>Choose {accept === "image" ? "an image or video" : "a file"}</h2>
          <button type="button" className="a-btn secondary small" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="a-filters">
          <input className="a-input" placeholder="Search by file name or folder…" value={q} onChange={(e) => setQ(e.target.value)} autoFocus aria-label="Search media" />
          <label className="a-btn secondary">
            {uploading ? "Uploading…" : "Upload new"}
            <input type="file" hidden onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} disabled={uploading} />
          </label>
        </div>
        {error && <div className="a-alert error">{error}</div>}
        {loading && <p className="a-muted">Loading…</p>}
        <div className="a-media-grid">
          {items.map((m) => (
            <button type="button" key={m.id} className="a-media-tile" onClick={() => onSelect(m.path)} title={m.path}>
              <div className="a-media-img" style={isImage(m.mimeType) ? { backgroundImage: `url("${m.url}")` } : undefined}>
                {isVideo(m.mimeType) ? "🎬" : !isImage(m.mimeType) ? "📄" : null}
              </div>
              <div className="a-media-name">{m.path}</div>
            </button>
          ))}
        </div>
        {!loading && !items.length && <p className="a-muted">No files match.</p>}
      </div>
    </div>
  );
}
