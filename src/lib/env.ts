import { z } from "zod";

const schema = z.object({
  DATABASE_URL: z.string().min(1),
  SITE_URL: z.string().url().default("http://localhost:3000"),
  /** "production" enables indexing in robots.txt; anything else disallows all crawlers. */
  SITE_ENV: z.enum(["production", "staging", "development"]).default("development"),
  SESSION_COOKIE_SECURE: z.enum(["true", "false"]).optional(),
  SESSION_TTL_HOURS: z.coerce.number().int().positive().default(12),
  UPLOAD_DIR: z.string().default("./storage/uploads"),
  UPLOAD_MAX_BYTES: z.coerce.number().int().positive().default(25 * 1024 * 1024),
  RECAPTCHA_SECRET_KEY: z.string().optional(),
  NEXT_PUBLIC_RECAPTCHA_SITE_KEY: z.string().optional(),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().int().positive().default(587),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  MAIL_FROM: z.string().default("Crafts Council Of India <noreply@craftscouncilofindia.in>"),
  TRUST_PROXY: z.enum(["true", "false"]).default("false"),
});

export type Env = z.infer<typeof schema>;

let cached: Env | undefined;

/** Validated server environment. Throws with a readable message on misconfiguration. */
export function env(): Env {
  if (cached) return cached;
  // On Vercel, fall back to the deployment's own URL when SITE_URL is not configured.
  const vercelUrl = process.env.VERCEL_BRANCH_URL ?? process.env.VERCEL_URL;
  const parsed = schema.safeParse({
    ...process.env,
    SITE_URL: process.env.SITE_URL || (vercelUrl ? `https://${vercelUrl}` : undefined),
  });
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
    throw new Error(`Invalid environment configuration — ${issues}`);
  }
  cached = parsed.data;
  return cached;
}

export function siteUrl(path = "/"): string {
  const base = env().SITE_URL.replace(/\/$/, "");
  return path.startsWith("http") ? path : `${base}${path.startsWith("/") ? "" : "/"}${path}`;
}
