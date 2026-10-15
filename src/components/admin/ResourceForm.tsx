"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { Fieldset } from "@/lib/admin/fields";
import { deleteRecord, duplicateRecord, saveRecord, setRecordStatus } from "@/lib/admin/resource-actions";
import { FieldInput } from "./FieldInput";

export interface FormCapabilities {
  canSave: boolean;
  canDelete: boolean;
  canDuplicate: boolean;
  canPublish: boolean;
}

/** Generic create/edit form for any registered resource. */
export function ResourceForm({
  resourceKey,
  singular,
  id,
  initial,
  fieldsets,
  caps,
  viewUrl,
  previewUrl,
}: {
  resourceKey: string;
  singular: string;
  id: string | null;
  initial: Record<string, unknown>;
  fieldsets: Fieldset[];
  caps: FormCapabilities;
  viewUrl?: string | null;
  previewUrl?: string | null;
}) {
  const router = useRouter();
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [dirty, setDirty] = useState(false);
  const [pending, start] = useTransition();

  const set = (name: string, v: unknown) => {
    setValues((prev) => ({ ...prev, [name]: v }));
    setDirty(true);
  };

  const save = (overrides: Record<string, unknown> = {}) =>
    start(async () => {
      setMessage(null);
      const payload = { ...values, ...overrides };
      const res = await saveRecord(resourceKey, id, JSON.stringify(payload));
      if (!res.ok) {
        setErrors(res.fieldErrors ?? {});
        setMessage({ kind: "error", text: res.error });
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      setErrors({});
      setDirty(false);
      setValues(payload);
      setMessage({ kind: "ok", text: res.message ?? "Saved." });
      if (!id && res.id) router.replace(`/admin/content/${resourceKey}/${res.id}?created=1`);
      else router.refresh();
    });

  const hasStatus = fieldsets.some((fs) => fs.fields.some((f) => f.name === "status"));
  const status = String(values.status ?? "DRAFT");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        save();
      }}
    >
      {message && (
        <div className={`a-alert ${message.kind}`} role={message.kind === "error" ? "alert" : "status"}>
          {message.text}
        </div>
      )}
      {!caps.canSave && (
        <div className="a-alert info">
          You can view this {singular.toLowerCase()} but not change it.{caps.canPublish && hasStatus ? " You can approve or return it using the buttons below." : ""}
        </div>
      )}
      <fieldset disabled={!caps.canSave || pending} style={{ border: 0, padding: 0, margin: 0 }}>
        {fieldsets.map((fs) => (
          <fieldset className="a-fieldset" key={fs.legend}>
            <legend>{fs.legend}</legend>
            {fs.fields.map((f) =>
              f.name === "status" && !caps.canPublish ? (
                <div className="a-field" key={f.name}>
                  <label htmlFor="f-status">Status</label>
                  <select id="f-status" value={status} onChange={(e) => set("status", e.target.value)}>
                    {["DRAFT", "IN_REVIEW"].includes(status) ? null : <option value={status}>{status} (current)</option>}
                    <option value="DRAFT">Draft</option>
                    <option value="IN_REVIEW">In review (submit for approval)</option>
                  </select>
                  <div className="a-help">Publishing needs a reviewer or editor.</div>
                </div>
              ) : (
                <FieldInput key={f.name} field={f} value={values[f.name]} onChange={(v) => set(f.name, v)} error={errors[f.name]} />
              ),
            )}
          </fieldset>
        ))}
      </fieldset>
      <div className="a-sticky-actions">
        {caps.canSave && (
          <button type="submit" className="a-btn" disabled={pending}>
            {pending ? "Saving…" : id ? "Save changes" : `Create ${singular.toLowerCase()}`}
          </button>
        )}
        {caps.canSave && hasStatus && caps.canPublish && status !== "PUBLISHED" && (
          <button type="button" className="a-btn secondary" disabled={pending} onClick={() => save({ status: "PUBLISHED" })}>
            Save &amp; publish
          </button>
        )}
        {caps.canSave && hasStatus && !caps.canPublish && status === "DRAFT" && (
          <button type="button" className="a-btn secondary" disabled={pending} onClick={() => save({ status: "IN_REVIEW" })}>
            Submit for review
          </button>
        )}
        {!caps.canSave && caps.canPublish && hasStatus && id &&
          (["PUBLISHED", "DRAFT"] as const)
            .filter((st) => st !== status)
            .map((st) => (
              <button
                key={st}
                type="button"
                className={st === "PUBLISHED" ? "a-btn" : "a-btn secondary"}
                disabled={pending}
                onClick={() =>
                  start(async () => {
                    const res = await setRecordStatus(resourceKey, id, st);
                    if (res.ok) {
                      setValues((v) => ({ ...v, status: st }));
                      setMessage({ kind: "ok", text: res.message ?? "Done." });
                      router.refresh();
                    } else setMessage({ kind: "error", text: res.error });
                  })
                }
              >
                {st === "PUBLISHED" ? "Approve & publish" : "Return to draft"}
              </button>
            ))}
        {previewUrl && id && (
          <a className="a-btn secondary" href={previewUrl} target="_blank" rel="noreferrer">
            Preview
          </a>
        )}
        {viewUrl && id && status === "PUBLISHED" && (
          <a className="a-btn secondary" href={viewUrl} target="_blank" rel="noreferrer">
            View live ↗
          </a>
        )}
        {id && caps.canDuplicate && (
          <button
            type="button"
            className="a-btn secondary"
            disabled={pending}
            onClick={() =>
              start(async () => {
                const res = await duplicateRecord(resourceKey, id);
                if (res.ok && res.id) router.push(`/admin/content/${resourceKey}/${res.id}`);
                else if (!res.ok) setMessage({ kind: "error", text: res.error });
              })
            }
          >
            Duplicate
          </button>
        )}
        {id && caps.canDelete && (
          <button
            type="button"
            className="a-btn danger"
            disabled={pending}
            onClick={() => {
              if (!window.confirm(`Delete this ${singular.toLowerCase()}? A snapshot is kept in the revision history, but the record disappears from the site.`)) return;
              start(async () => {
                const res = await deleteRecord(resourceKey, id);
                if (res.ok) router.push(`/admin/content/${resourceKey}?deleted=1`);
                else setMessage({ kind: "error", text: res.error });
              });
            }}
          >
            Delete
          </button>
        )}
        {dirty && <span className="a-small a-muted" style={{ alignSelf: "center" }}>Unsaved changes</span>}
      </div>
    </form>
  );
}
