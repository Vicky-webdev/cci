import "server-only";

/** Server-side reCAPTCHA verification (replaces the cURL call in send_enquiry.php). */
export async function verifyRecaptcha(token: string, ip?: string): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) return false;
  try {
    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token, ...(ip && ip !== "unknown" ? { remoteip: ip } : {}) }),
      signal: AbortSignal.timeout(8000),
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch (err) {
    console.error("[recaptcha] verification request failed", err);
    return false;
  }
}

/** reCAPTCHA is enforced whenever a site key is configured, and always in production. */
export function recaptchaRequired(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) || process.env.SITE_ENV === "production";
}
