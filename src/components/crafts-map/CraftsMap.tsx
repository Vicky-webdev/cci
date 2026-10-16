"use client";

import { useState } from "react";
import mapData from "./india-map.json";

export interface MapState {
  code: string;
  name: string;
  crafts: string[];
  districts: { d: string; c: string[] }[];
  mapImage: string;
}

/** Interactive crafts map (legacy crafts-map.html): hover tooltip, click → sidebar with state map and district table. */
export function CraftsMap({ states, intro }: { states: Record<string, MapState>; intro: string }) {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; state: MapState } | null>(null);
  const [selected, setSelected] = useState<MapState | null>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [mapImageFailed, setMapImageFailed] = useState(false);

  const select = (code: string | null | undefined) => {
    const data = code ? states[code] : undefined;
    if (!data) return;
    setMapImageFailed(false);
    setSelected(data);
  };
  const hover = (code: string | null | undefined, e: React.MouseEvent) => {
    const data = code ? states[code] : undefined;
    if (data) setTooltip({ x: e.clientX + 10, y: e.clientY + 10, state: data });
  };

  return (
    <>
      <div className="map-layout">
        <div className="map-container">
          <div className="map-svg-wrap">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox={mapData.viewBox} id="india-map" role="group" aria-label="Map of India — select a state to see its crafts">
              {mapData.paths.map((p, i) => (
                <path
                  key={i}
                  className={p.interactive ? `state-path has-council${selected?.code === p.state ? " active" : ""}` : undefined}
                  data-state={p.state ?? undefined}
                  data-name={p.name}
                  d={p.d}
                  fill="#dadada"
                  stroke="#fff"
                  strokeWidth="0.5"
                  tabIndex={p.interactive && p.state && states[p.state] ? 0 : undefined}
                  aria-label={p.interactive && p.state && states[p.state] ? p.name : undefined}
                  role={p.interactive && p.state && states[p.state] ? "button" : undefined}
                  onMouseEnter={(e) => hover(p.state, e)}
                  onMouseLeave={() => setTooltip(null)}
                  onClick={() => p.interactive && select(p.state)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      select(p.state);
                    }
                  }}
                />
              ))}
            </svg>
            <span style={{ fontSize: "0.7rem" }}>UT: </span>
            {mapData.utLinks.map((u, i) => (
              <span key={u.state}>
                <span
                  style={{ fontSize: "0.7rem", cursor: states[u.state ?? ""] ? "pointer" : undefined }}
                  className="state-path has-council"
                  data-state={u.state}
                  role={states[u.state ?? ""] ? "button" : undefined}
                  tabIndex={states[u.state ?? ""] ? 0 : undefined}
                  onMouseEnter={(e) => hover(u.state, e)}
                  onMouseLeave={() => setTooltip(null)}
                  onClick={() => select(u.state)}
                  onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && select(u.state)}
                >
                  {u.label}
                </span>
                {i < mapData.utLinks.length - 1 ? " | " : " "}
              </span>
            ))}
          </div>
        </div>

        <div className="map-sidebar" id="mapSidebar" aria-live="polite">
          {!selected && (
            <div className="sidebar-placeholder" id="sidebarPlaceholder">
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="var(--cr)" strokeWidth="1.5" aria-hidden="true">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                <circle cx="12" cy="9" r="2.5" />
              </svg>
              <p>{intro}</p>
            </div>
          )}
          {selected && (
            <div id="sidebarContent">
              <h2 className="sidebar-state-name">{selected.name}</h2>
              {selected.mapImage && !mapImageFailed ? (
                // eslint-disable-next-line @next/next/no-img-element -- legacy state map image
                <img
                  src={selected.mapImage}
                  className="state-map-img"
                  alt={`Crafts map of ${selected.name}`}
                  onClick={() => setLightbox(selected.mapImage)}
                  onError={() => setMapImageFailed(true)}
                  style={{ cursor: "zoom-in" }}
                />
              ) : (
                <p style={{ color: "#999" }}>No map image</p>
              )}
              <table className="craft-table">
                <thead>
                  <tr>
                    <th>District</th>
                    <th>Crafts</th>
                  </tr>
                </thead>
                <tbody>
                  {selected.districts.map((d) => (
                    <tr key={d.d}>
                      <td>{d.d}</td>
                      <td>
                        {d.c.map((c) => (
                          <span className="craft-tag" key={c}>
                            {c}
                          </span>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div
        className={`map-tooltip${tooltip ? " visible" : ""}`}
        id="mapTooltip"
        style={tooltip ? { left: tooltip.x, top: tooltip.y } : undefined}
        aria-hidden="true"
      >
        {tooltip && (
          <>
            <strong>{tooltip.state.name}</strong>
            <ul>
              {tooltip.state.crafts.slice(0, 4).map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </>
        )}
      </div>

      {lightbox && (
        <div id="mapLightbox" style={{ display: "flex" }} onClick={() => setLightbox(null)} role="dialog" aria-modal="true" aria-label="State map">
          <div className="map-lightbox-overlay">
            <button type="button" className="map-lightbox-close nav-reset" aria-label="Close" onClick={() => setLightbox(null)}>
              &times;
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element -- full-size state map */}
            <img className="map-lightbox-image" src={lightbox} alt="State crafts map" onClick={(e) => e.stopPropagation()} />
          </div>
        </div>
      )}
    </>
  );
}
