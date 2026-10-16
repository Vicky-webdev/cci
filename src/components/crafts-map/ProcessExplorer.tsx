"use client";

import { useEffect, useState } from "react";

export interface ProcessView {
  slug: string;
  category: string;
  icon: string;
  color: string;
  title: string;
  subtitle: string;
  intro: string;
  materials: string[];
  steps: { title: string; text: string }[];
  states: string[];
}

/** Craft process grid + slide-in detail panel (legacy craft-processes.html). */
export function ProcessExplorer({ processes }: { processes: ProcessView[] }) {
  const [open, setOpen] = useState<ProcessView | null>(null);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <div className="process-grid" id="processGrid">
        {processes.map((p) => (
          <div
            className="process-card"
            key={p.slug}
            role="button"
            tabIndex={0}
            onClick={() => setOpen(p)}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), setOpen(p))}
          >
            <div className="process-card-img" style={{ background: p.color }}>
              <div className="process-card-icon">
                {/* eslint-disable-next-line @next/next/no-img-element -- legacy process icon */}
                <img src={p.icon} alt={p.title} />
              </div>
            </div>
            <div className="process-card-body">
              <div className="process-card-category">{p.category}</div>
              <h3 className="process-card-title">{p.title}</h3>
              <p className="process-card-desc">{p.subtitle}</p>
              <span className="process-card-link">
                Explore process{" "}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className={`detail-overlay${open ? " open" : ""}`} id="detailOverlay" onClick={() => setOpen(null)}></div>
      <div className={`detail-panel${open ? " open" : ""}`} id="detailPanel" role="dialog" aria-modal="true" aria-hidden={!open} aria-label={open?.title ?? "Process detail"}>
        <div className="detail-close">
          <span className="detail-close-breadcrumb">Craft Processes</span>
          <button className="detail-close-btn" onClick={() => setOpen(null)} aria-label="Close" type="button">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div id="detailBody">
          {open && (
            <>
              <div className="detail-hero" style={{ background: open.color }}>
                {/* eslint-disable-next-line @next/next/no-img-element -- legacy process icon */}
                <img src={open.icon} alt={open.title} />
              </div>
              <div className="detail-content">
                <span className="detail-category">{open.category}</span>
                <h2 className="detail-title">{open.title}</h2>
                <p className="detail-subtitle">{open.subtitle}</p>
                <div className="detail-divider"></div>
                <div className="detail-body">
                  <p>{open.intro}</p>
                </div>
                <div className="detail-section-label">Materials used</div>
                <div className="detail-materials">
                  {open.materials.map((m, i) => (
                    <span className="material-tag" key={i}>
                      {m}
                    </span>
                  ))}
                </div>
                <div className="detail-section-label">The Process — Step by Step</div>
                <ol className="detail-steps">
                  {open.steps.map((st, i) => (
                    <li className="detail-step" key={i}>
                      <span className="detail-step-num">{String(i + 1).padStart(2, "0")}</span>
                      <span className="detail-step-text">
                        <span className="detail-step-title">{st.title}</span>
                        {st.text}
                      </span>
                    </li>
                  ))}
                </ol>
                <div className="detail-section-label">Practised in</div>
                <div className="detail-states">
                  {open.states.map((st, i) => (
                    <span className="state-chip" key={i}>
                      {st}
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
