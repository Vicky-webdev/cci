"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { attemptLogin } from "@/lib/auth/login";
import { requestMeta } from "@/lib/request";

const schema = z.object({ email: z.string().trim().email().max(254), password: z.string().min(1).max(256) });

export async function loginAction(_prev: { error?: string; email?: string } | undefined, formData: FormData) {
  // The email is echoed back so the field survives React's post-action form reset.
  const email = String(formData.get("email") ?? "").slice(0, 254);
  const parsed = schema.safeParse({ email, password: formData.get("password") });
  if (!parsed.success) return { error: "Enter your email address and password.", email };
  const result = await attemptLogin(parsed.data.email, parsed.data.password, await requestMeta());
  if (!result.ok) return { error: result.error, email };
  redirect("/admin");
}
