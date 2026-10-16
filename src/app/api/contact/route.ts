import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { contactEmailHtml, contactSchema } from "@/lib/forms/contact";
import { recaptchaRequired, verifyRecaptcha } from "@/lib/forms/recaptcha";
import { mailerConfigured, sendMail } from "@/lib/mailer";
import { consumeRateLimit } from "@/lib/rate-limit";
import { clientIpFrom, isSameOrigin } from "@/lib/request";
import { getSettings } from "@/lib/settings";

const reply = (success: boolean, message: string, status = 200) => NextResponse.json({ success, message }, { status });

/**
 * Contact enquiry endpoint (replaces send_enquiry.php). Same request fields and JSON
 * response shape. Submissions are stored before emailing, so nothing is lost if SMTP fails.
 */
export async function POST(request: Request) {
  if (!isSameOrigin(request)) return reply(false, "Invalid request", 403);
  const settings = await getSettings();
  if (!settings["forms.contact.enabled"]) return reply(false, "The enquiry form is currently unavailable.", 503);

  const ip = clientIpFrom(request.headers);
  if (!(await consumeRateLimit(`contact:${ip}`, 5, 10 * 60 * 1000))) {
    return reply(false, "Too many messages. Please try again later.", 429);
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return reply(false, "Invalid request", 400);
  }

  // Honeypot: real visitors never fill this hidden field. Pretend success to the bot.
  if (String(form.get("website") ?? "").trim()) return reply(true, "Message sent successfully");

  if (recaptchaRequired()) {
    const token = String(form.get("g-recaptcha-response") ?? "");
    if (!token) return reply(false, "Captcha missing");
    if (!(await verifyRecaptcha(token, ip))) return reply(false, "Captcha verification failed");
  }

  const parsed = contactSchema.safeParse(Object.fromEntries(form.entries()));
  if (!parsed.success) return reply(false, parsed.error.issues[0]?.message ?? "Required fields missing", 422);
  const c = parsed.data;

  const submission = await db.formSubmission.create({
    data: {
      form: "contact",
      name: c.full_name,
      email: c.email,
      phone: c.phone,
      subject: c.subject,
      message: c.message,
      ip,
      userAgent: (request.headers.get("user-agent") ?? "").slice(0, 300),
      emailStatus: mailerConfigured() ? "PENDING" : "SKIPPED",
    },
  });

  if (mailerConfigured()) {
    try {
      await sendMail({
        to: settings["forms.contact.notifyTo"],
        subject: settings["forms.contact.subject"],
        html: contactEmailHtml(c),
        replyTo: `${c.full_name.replace(/[<>"]/g, "")} <${c.email}>`,
      });
      await db.formSubmission.update({ where: { id: submission.id }, data: { emailStatus: "SENT" } });
    } catch (err) {
      // Logged server-side only; the legacy endpoint leaked SMTP error text to the browser.
      console.error("[contact] email notification failed", err);
      await db.formSubmission.update({
        where: { id: submission.id },
        data: { emailStatus: "FAILED", emailError: String((err as Error).message ?? err).slice(0, 500) },
      });
    }
  }
  return reply(true, "Message sent successfully");
}

export function GET() {
  return reply(false, "Invalid request", 405);
}
