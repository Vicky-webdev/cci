"use client";

import { useCallback, useEffect, useState } from "react";

export interface LightboxItem {
  src: string;
  isVideo: boolean;
  alt?: string;
}

/**
 * Wraps server-rendered gallery markup. Any descendant with data-lightbox-index opens the
 * lightbox at that index. Prev/next, Esc/arrow keys and backdrop click behave as the
 * legacy initLightbox() did; videos play inside the lightbox.
 */
export function GalleryLightbox({ items, children }: { items: LightboxItem[]; children: React.ReactNode }) {
  const [index, setIndex] = useState<number | null>(null);
  const close = useCallback(() => setIndex(null), []);
  const step = useCallback((d: number) => setIndex((i) => (i === null ? i : (i + d + items.length) % items.length)), [items.length]);

  useEffect(() => {
    if (index === null) return;
    document.body.classList.add("lightbox-open");
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("lightbox-open");
      document.removeEventListener("keydown", onKey);
    };
  }, [index, close, step]);

  const current = index === null ? null : items[index];
  const mediaStyle: React.CSSProperties = { maxWidth: "95%", maxHeight: "90vh", borderRadius: 12 };

  return (
    <div
      onClick={(e) => {
        const el = (e.target as HTMLElement).closest<HTMLElement>("[data-lightbox-index]");
        if (el) setIndex(Number(el.dataset.lightboxIndex));
      }}
      onKeyDown={(e) => {
        const el = (e.target as HTMLElement).closest<HTMLElement>("[data-lightbox-index]");
        if (el && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          setIndex(Number(el.dataset.lightboxIndex));
        }
      }}
    >
      {children}
      <div
        className={`lightbox${current ? " active" : ""}`}
        id="lightbox"
        role="dialog"
        aria-modal="true"
        aria-label="Gallery"
        aria-hidden={!current}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
        style={current ? { display: "flex" } : undefined}
      >
        <button type="button" className="lightbox-close" id="lightboxClose" onClick={close} aria-label="Close">
          ✕
        </button>
        <button type="button" className="lightbox-nav prev" id="lightboxPrev" onClick={() => step(-1)} aria-label="Previous">
          ‹
        </button>
        {current &&
          (current.isVideo ? (
            <video key={current.src} id="lightboxImg" controls autoPlay playsInline style={mediaStyle}>
              <source src={current.src} type="video/mp4" />
            </video>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element -- full-size original in the lightbox
            <img key={current.src} id="lightboxImg" src={current.src} alt={current.alt || "Gallery image"} style={mediaStyle} />
          ))}
        <button type="button" className="lightbox-nav next" id="lightboxNext" onClick={() => step(1)} aria-label="Next">
          ›
        </button>
      </div>
    </div>
  );
}
