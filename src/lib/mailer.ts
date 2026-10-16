import "server-only";
import nodemailer from "nodemailer";

export function mailerConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD);
}

/** SMTP via ZeptoMail (or any provider) — replaces PHPMailer. STARTTLS on 587 as before. */
export async function sendMail(opts: { to: string; subject: string; html: string; replyTo?: string }) {
  const port = Number(process.env.SMTP_PORT ?? 587);
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    requireTLS: port !== 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
    connectionTimeout: 10_000,
  });
  await transport.sendMail({
    from: process.env.MAIL_FROM ?? "Crafts Council Of India <noreply@craftscouncilofindia.in>",
    to: opts.to,
    subject: opts.subject,
    html: opts.html,
    replyTo: opts.replyTo,
  });
}
