"use client";

import { useActionState } from "react";
import { changePasswordAction } from "./actions";

export function PasswordForm() {
  const [state, action, pending] = useActionState(changePasswordAction, undefined);
  return (
    <form action={action} style={{ maxWidth: 420 }}>
      {state?.error && <div className="a-alert error" role="alert">{state.error}</div>}
      {state?.ok && <div className="a-alert ok" role="status">{state.ok}</div>}
      <div className="a-field">
        <label htmlFor="current">Current password</label>
        <input id="current" name="current" type="password" className="a-input" autoComplete="current-password" required />
      </div>
      <div className="a-field">
        <label htmlFor="next">New password</label>
        <input id="next" name="next" type="password" className="a-input" autoComplete="new-password" minLength={12} required />
        <div className="a-help">At least 12 characters, using three of: lowercase, uppercase, digits, symbols.</div>
      </div>
      <div className="a-field">
        <label htmlFor="confirm">Confirm new password</label>
        <input id="confirm" name="confirm" type="password" className="a-input" autoComplete="new-password" required />
      </div>
      <button className="a-btn" disabled={pending}>
        {pending ? "Saving…" : "Change password"}
      </button>
    </form>
  );
}
