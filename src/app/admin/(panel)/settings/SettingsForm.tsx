"use client";

import { useState, useTransition } from "react";
import { FieldInput } from "@/components/admin/FieldInput";
import { SETTINGS_FIELDSETS } from "@/lib/admin/settings-form";
import { saveSettingsAction } from "./actions";

export function SettingsForm({ initial, canEdit }: { initial: Record<string, unknown>; canEdit: boolean }) {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, start] = useTransition();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        start(async () => {
          const r = await saveSettingsAction(JSON.stringify(values));
          setMsg({ ok: r.ok, text: r.message });
          setErrors(r.fieldErrors ?? {});
        });
      }}
    >
      {msg && <div className={`a-alert ${msg.ok ? "ok" : "error"}`} role="status">{msg.text}</div>}
      <fieldset disabled={!canEdit || pending} style={{ border: 0, padding: 0, margin: 0 }}>
        {SETTINGS_FIELDSETS.map((fs) => (
          <fieldset className="a-fieldset" key={fs.legend}>
            <legend>{fs.legend}</legend>
            {fs.fields.map((f) => (
              <FieldInput key={f.name} field={f} idPrefix="s" value={values[f.name]} error={errors[f.name]} onChange={(v) => setValues((p) => ({ ...p, [f.name]: v }))} />
            ))}
          </fieldset>
        ))}
      </fieldset>
      {canEdit && (
        <div className="a-sticky-actions">
          <button className="a-btn" disabled={pending}>{pending ? "Saving…" : "Save settings"}</button>
        </div>
      )}
    </form>
  );
}
