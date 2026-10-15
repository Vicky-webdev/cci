"use client";

import { useState } from "react";
import { SECTION_DEFS, sectionDef, type Section } from "@/lib/content/sections";
import { FieldInput } from "./FieldInput";

const newId = () => Math.random().toString(16).slice(2, 14);

/** Ordered page sections: add, reorder, hide, remove, and edit each section's fields. */
export function SectionsEditor({ value, onChange }: { value: Section[]; onChange: (v: Section[]) => void }) {
  const [addType, setAddType] = useState(SECTION_DEFS[0].type);
  const [open, setOpen] = useState<string | null>(null);
  const update = (i: number, s: Section) => onChange(value.map((x, j) => (j === i ? s : x)));
  const move = (i: number, d: number) => {
    const next = [...value];
    const [s] = next.splice(i, 1);
    next.splice(i + d, 0, s);
    onChange(next);
  };
  return (
    <div>
      {value.map((s, i) => {
        const def = sectionDef(s.type);
        const isOpen = open === s.id;
        return (
          <div className="a-section-card" key={s.id}>
            <header>
              <div>
                <strong>{def?.label ?? s.type}</strong>
                {s.hidden && <span className="a-badge" style={{ marginLeft: 8 }}>Hidden</span>}
                <div className="a-small a-muted">{String(s.data.title ?? s.data.tag ?? def?.description ?? "")}</div>
              </div>
              <div className="a-row">
                <button type="button" className="a-btn secondary small" onClick={() => setOpen(isOpen ? null : s.id)} aria-expanded={isOpen}>
                  {isOpen ? "Close" : "Edit"}
                </button>
                <button type="button" className="a-btn secondary small" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up">
                  ↑
                </button>
                <button type="button" className="a-btn secondary small" onClick={() => move(i, 1)} disabled={i === value.length - 1} aria-label="Move down">
                  ↓
                </button>
                <button type="button" className="a-btn secondary small" onClick={() => update(i, { ...s, hidden: !s.hidden })}>
                  {s.hidden ? "Show" : "Hide"}
                </button>
                <button
                  type="button"
                  className="a-btn danger small"
                  onClick={() => window.confirm(`Remove the "${def?.label ?? s.type}" section?`) && onChange(value.filter((_, j) => j !== i))}
                >
                  Remove
                </button>
              </div>
            </header>
            {isOpen && def && (
              <div>
                <p className="a-help" style={{ marginTop: 0 }}>
                  {def.description}
                </p>
                {def.fields.map((f) => (
                  <FieldInput key={f.name} field={f} idPrefix={`sec-${s.id}`} value={s.data[f.name]} onChange={(v) => update(i, { ...s, data: { ...s.data, [f.name]: v } })} />
                ))}
              </div>
            )}
          </div>
        );
      })}
      <div className="a-row">
        <select value={addType} onChange={(e) => setAddType(e.target.value)} style={{ maxWidth: 320 }} aria-label="Section type to add">
          {SECTION_DEFS.map((d) => (
            <option key={d.type} value={d.type}>
              {d.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="a-btn secondary small"
          onClick={() => {
            const s: Section = { id: newId(), type: addType, data: {} };
            onChange([...value, s]);
            setOpen(s.id);
          }}
        >
          + Add section
        </button>
      </div>
    </div>
  );
}
