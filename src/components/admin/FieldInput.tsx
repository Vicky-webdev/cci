"use client";

import { useState } from "react";
import type { AdminField } from "@/lib/admin/fields";
import { RichTextEditor } from "./RichTextEditor";
import { MediaPicker, mediaUrl } from "./MediaPicker";
import { SectionsEditor } from "./SectionsEditor";

type Value = unknown;
type Obj = Record<string, unknown>;

const isVideoPath = (p: string) => /\.(mp4|webm|mov)$/i.test(p);
const isImagePath = (p: string) => /\.(jpe?g|png|gif|webp|avif|svg)$/i.test(p);

function MediaField({ id, value, onChange, accept }: { id: string; value: string; onChange: (v: string) => void; accept: "image" | "file" }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <div className="a-media-preview">
        {value && isImagePath(value) && (
          // eslint-disable-next-line @next/next/no-img-element -- admin preview
          <img src={mediaUrl(value)} alt="" />
        )}
        {value && isVideoPath(value) && <video src={mediaUrl(value)} muted />}
        <div style={{ flex: 1 }}>
          <input id={id} className="a-input" value={value} onChange={(e) => onChange(e.target.value)} placeholder="images/… or uploads/…" />
          <div className="a-row" style={{ marginTop: 6 }}>
            <button type="button" className="a-btn secondary small" onClick={() => setOpen(true)}>
              Choose…
            </button>
            {value && (
              <>
                <a className="a-small" href={mediaUrl(value)} target="_blank" rel="noreferrer">
                  Open
                </a>
                <button type="button" className="a-btn danger small" onClick={() => onChange("")}>
                  Remove
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      {open && (
        <MediaPicker
          accept={accept}
          onClose={() => setOpen(false)}
          onSelect={(p) => {
            onChange(p);
            setOpen(false);
          }}
        />
      )}
    </div>
  );
}

function StringsField({ id, value, onChange }: { id: string; value: string[]; onChange: (v: string[]) => void }) {
  return (
    <textarea
      id={id}
      value={value.join("\n")}
      onChange={(e) => onChange(e.target.value.split("\n"))}
      onBlur={(e) => onChange(e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))}
      rows={Math.min(Math.max(value.length + 1, 3), 14)}
      aria-describedby={`${id}-help`}
    />
  );
}

function ListField({ field, value, onChange, idPrefix }: { field: Extract<AdminField, { type: "list" }>; value: Obj[]; onChange: (v: Obj[]) => void; idPrefix: string }) {
  const [collapsed, setCollapsed] = useState(value.length > 6);
  const move = (i: number, d: number) => {
    const next = [...value];
    const [item] = next.splice(i, 1);
    next.splice(i + d, 0, item);
    onChange(next);
  };
  return (
    <div>
      {value.length > 6 && (
        <button type="button" className="a-btn secondary small" onClick={() => setCollapsed((c) => !c)} style={{ marginBottom: 8 }}>
          {collapsed ? `Show all ${value.length} ${field.itemLabel.toLowerCase()}s` : "Collapse"}
        </button>
      )}
      {!collapsed &&
        value.map((item, i) => (
          <div className="a-list-item" key={i}>
            <div className="a-list-head">
              <strong className="a-small">
                {field.itemLabel} {i + 1}
              </strong>
              <div className="a-row">
                <button type="button" className="a-btn secondary small" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up">
                  ↑
                </button>
                <button type="button" className="a-btn secondary small" onClick={() => move(i, 1)} disabled={i === value.length - 1} aria-label="Move down">
                  ↓
                </button>
                <button type="button" className="a-btn danger small" onClick={() => onChange(value.filter((_, j) => j !== i))}>
                  Remove
                </button>
              </div>
            </div>
            {field.fields.map((sub) => (
              <FieldInput
                key={sub.name}
                field={sub}
                idPrefix={`${idPrefix}-${i}`}
                value={item[sub.name]}
                onChange={(v) => onChange(value.map((it, j) => (j === i ? { ...it, [sub.name]: v } : it)))}
              />
            ))}
          </div>
        ))}
      <button type="button" className="a-btn secondary small" onClick={() => onChange([...value, {}])}>
        + Add {field.itemLabel.toLowerCase()}
      </button>
    </div>
  );
}

/** Renders one field of any admin field type. */
export function FieldInput({ field, value, onChange, error, idPrefix = "f" }: { field: AdminField; value: Value; onChange: (v: Value) => void; error?: string; idPrefix?: string }) {
  const id = `${idPrefix}-${field.name}`;
  const str = typeof value === "string" ? value : value == null ? "" : String(value);
  const describedBy = field.help ? `${id}-help` : undefined;

  let control: React.ReactNode;
  switch (field.type) {
    case "boolean":
      return (
        <div className="a-field">
          <label className="a-check">
            <input id={id} type="checkbox" checked={value === true} onChange={(e) => onChange(e.target.checked)} /> {field.label}
          </label>
          {field.help && <div className="a-help">{field.help}</div>}
        </div>
      );
    case "textarea":
      control = <textarea id={id} value={str} onChange={(e) => onChange(e.target.value)} aria-invalid={!!error} aria-describedby={describedBy} rows={4} />;
      break;
    case "html":
    case "inline-html":
      control = <RichTextEditor id={id} labelledBy={`${id}-label`} value={str} onChange={onChange} inline={field.type === "inline-html"} />;
      break;
    case "number":
      control = <input id={id} type="number" className="a-input" value={str} onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))} aria-invalid={!!error} />;
      break;
    case "select":
      control = (
        <select id={id} value={str} onChange={(e) => onChange(e.target.value)} aria-invalid={!!error}>
          {!field.options.some((o) => o.value === "") && <option value="">— Select —</option>}
          {field.options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      );
      break;
    case "date":
      control = <input id={id} type="date" className="a-input" value={str} onChange={(e) => onChange(e.target.value)} aria-invalid={!!error} />;
      break;
    case "datetime":
      control = <input id={id} type="datetime-local" className="a-input" value={str} onChange={(e) => onChange(e.target.value)} aria-invalid={!!error} />;
      break;
    case "color":
      control = (
        <div className="a-row">
          <input type="color" value={/^#[0-9a-f]{6}$/i.test(str) ? str : "#8b3a1e"} onChange={(e) => onChange(e.target.value)} aria-label={`${field.label} picker`} />
          <input id={id} className="a-input" style={{ maxWidth: 160 }} value={str} onChange={(e) => onChange(e.target.value)} />
        </div>
      );
      break;
    case "image":
      control = <MediaField id={id} value={str} onChange={onChange} accept="image" />;
      break;
    case "file":
      control = <MediaField id={id} value={str} onChange={onChange} accept="file" />;
      break;
    case "strings":
      control = <StringsField id={id} value={Array.isArray(value) ? (value as string[]) : []} onChange={onChange} />;
      break;
    case "list":
      control = <ListField field={field} idPrefix={id} value={Array.isArray(value) ? (value as Obj[]) : []} onChange={onChange} />;
      break;
    case "sections":
      control = <SectionsEditor value={Array.isArray(value) ? (value as never[]) : []} onChange={onChange} />;
      break;
    case "readonly":
      control = <div className="a-muted">{str || "—"}</div>;
      break;
    default:
      control = <input id={id} className="a-input" type={field.type === "url" ? "text" : "text"} value={str} onChange={(e) => onChange(e.target.value)} aria-invalid={!!error} aria-describedby={describedBy} />;
  }
  return (
    <div className="a-field">
      <label htmlFor={id} id={`${id}-label`}>
        {field.label}
        {"required" in field && field.required ? " *" : ""}
      </label>
      {control}
      {field.type === "strings" && <div className="a-help">One per line.</div>}
      {field.help && (
        <div className="a-help" id={describedBy}>
          {field.help}
        </div>
      )}
      {error && <div className="a-error-text">{error}</div>}
    </div>
  );
}
