"use client";

import { useActionState } from "react";
import { loginAction } from "./actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, undefined);
  return (
    <form action={action}>
      {state?.error && (
        <div className="a-alert error" role="alert">
          {state.error}
        </div>
      )}
      <div className="a-field">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" className="a-input" autoComplete="username" required autoFocus defaultValue={state?.email ?? ""} key={state?.email ?? ""} />
      </div>
      <div className="a-field">
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" className="a-input" autoComplete="current-password" required />
      </div>
      <button className="a-btn" type="submit" disabled={pending} style={{ width: "100%", justifyContent: "center" }}>
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
