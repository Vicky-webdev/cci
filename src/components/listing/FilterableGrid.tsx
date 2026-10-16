"use client";

import { useState } from "react";

export interface FilterOption {
  key: string;
  label: string;
}

/**
 * Client-side filter buttons over cards that were fully rendered on the server
 * (crawlers and no-JS visitors get the whole list). Each card declares which
 * filter keys it matches. Optional "Load more" paging mirrors past-events.html.
 */
export function FilterableGrid({
  filters,
  cards,
  pageSize,
  emptyText,
  emptyHint,
  gridId = "eventsGrid",
  loadMoreLabel = "Load More Events",
}: {
  filters: FilterOption[];
  cards: { key: string; matches: string[]; node: React.ReactNode }[];
  pageSize?: number;
  emptyText: string;
  emptyHint?: string;
  gridId?: string;
  loadMoreLabel?: string;
}) {
  const [active, setActive] = useState(filters[0]?.key ?? "all");
  const [visible, setVisible] = useState(pageSize ?? Infinity);
  const shown = cards.filter((c) => active === "all" || c.matches.includes(active));
  return (
    <>
      {filters.length > 1 && (
        <div className="filters" role="toolbar" aria-label="Filter">
          {filters.map((f) => (
            <button
              key={f.key}
              type="button"
              className={`filter-btn${active === f.key ? " active" : ""}`}
              aria-pressed={active === f.key}
              onClick={() => {
                setActive(f.key);
                setVisible(pageSize ?? Infinity);
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}
      <div className="events-grid" id={gridId}>
        {shown.length ? (
          shown.slice(0, visible).map((c) => <div key={c.key} style={{ display: "contents" }}>{c.node}</div>)
        ) : (
          <div style={{ padding: 60, textAlign: "center" }}>
            <h3>{emptyText}</h3>
            {emptyHint && <p>{emptyHint}</p>}
          </div>
        )}
      </div>
      {pageSize && shown.length > visible && (
        <div className="load-more">
          <button type="button" className="btn-primary" onClick={() => setVisible((v) => v + pageSize)}>
            {loadMoreLabel}
          </button>
        </div>
      )}
    </>
  );
}
