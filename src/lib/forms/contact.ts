import { z } from "zod";

export const contactSchema = z.object({
  full_name: z.string().trim().min(1, "Required fields missing").max(200),
  email: z.string().trim().email("Please enter a valid email address").max(254),
  phone: z.string().trim().max(40).optional().default(""),
  subject: z.string().trim().min(1, "Required fields missing").max(300),
  message: z.string().trim().min(1, "Required fields missing").max(5000),
});

export type ContactInput = z.infer<typeof contactSchema>;

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

/** Same layout as the legacy PHPMailer body; every value is HTML-escaped. */
export function contactEmailHtml(c: ContactInput): string {
  return `<div style='font-family:Arial;padding:20px;'>
<h2>New Contact Form Submission</h2>
<p><strong>Name:</strong> ${escapeHtml(c.full_name)}</p>
<p><strong>Email:</strong> ${escapeHtml(c.email)}</p>
<p><strong>Phone:</strong> ${escapeHtml(c.phone)}</p>
<p><strong>Subject:</strong> ${escapeHtml(c.subject)}</p>
<p><strong>Message:</strong><br>${escapeHtml(c.message).replace(/\n/g, "<br>")}</p>
</div>`;
}
