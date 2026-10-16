import "server-only";
import { headers } from "next/headers";

/**
 * Best-effort client IP. Only trusts X-Forwarded-For's first hop when TRUST_PROXY=true
 * (i.e. the app runs behind a reverse proxy that overwrites the header).
 */
export function clientIpFrom(h: Headers): string {
  const xff = h.get("x-forwarded-for");
  if (xff) {
    const parts = xff.split(",").map((s) => s.trim()).filter(Boolean);
    if (parts.length) return process.env.TRUST_PROXY === "true" ? parts[0] : parts[parts.length - 1];
  }
  return h.get("x-real-ip") ?? "unknown";
}

export async function requestMeta(): Promise<{ ip: string; userAgent: string }> {
  const h = await headers();
  return { ip: clientIpFrom(h), userAgent: (h.get("user-agent") ?? "").slice(0, 300) };
}

/**
 * CSRF defence for Route Handlers that mutate state: the Origin (or Referer) must match
 * the Host. Server Actions get the equivalent check from Next.js itself.
 */
export function isSameOrigin(request: Request): boolean {
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const origin = request.headers.get("origin") ?? request.headers.get("referer");
  if (!host || !origin) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
