"use client";

import Script from "next/script";
import { useRef, useState } from "react";

declare global {
  interface Window {
    grecaptcha?: { reset: () => void; getResponse: () => string };
  }
}

/** Contact form (legacy contact.html): required fields, reCAPTCHA v2, loading state, success/error message. */
export function ContactForm({ siteKey, successMessage }: { siteKey: string; successMessage: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<{ kind: "success" | "error"; text: string } | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setMessage(null);
    try {
      const response = await fetch("/api/contact", { method: "POST", body: new FormData(e.currentTarget) });
      const data = (await response.json()) as { success: boolean; message?: string };
      if (data.success) {
        setMessage({ kind: "success", text: successMessage });
        formRef.current?.reset();
        window.grecaptcha?.reset();
      } else {
        setMessage({ kind: "error", text: data.message || "Something went wrong." });
      }
    } catch {
      setMessage({ kind: "error", text: "Server error. Please try again later." });
    }
    setPending(false);
  }

  return (
    <form id="contactForm" ref={formRef} method="POST" action="/api/contact" onSubmit={onSubmit} noValidate={false}>
      <div className="form-group">
        <label className="form-label" htmlFor="cf-name">Full Name *</label>
        <input id="cf-name" type="text" name="full_name" className="form-input" required maxLength={200} placeholder="Your name" autoComplete="name" />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="cf-email">Email Address *</label>
        <input id="cf-email" type="email" name="email" className="form-input" required maxLength={254} placeholder="your@email.com" autoComplete="email" />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="cf-phone">Phone Number</label>
        <input id="cf-phone" type="tel" name="phone" className="form-input" maxLength={40} placeholder="Your Phone Number" autoComplete="tel" />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="cf-subject">Subject *</label>
        <input id="cf-subject" type="text" name="subject" className="form-input" required maxLength={300} placeholder="What is this regarding?" />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="cf-message">Message *</label>
        <textarea id="cf-message" name="message" className="form-textarea" required maxLength={5000} placeholder="Tell us more..."></textarea>
      </div>
      {/* Honeypot: hidden from people, filled in by naive bots. */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}>
        <label htmlFor="cf-website">Website</label>
        <input id="cf-website" type="text" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      {siteKey && (
        <>
          <Script src="https://www.google.com/recaptcha/api.js" strategy="afterInteractive" />
          <div className="g-recaptcha" data-sitekey={siteKey}></div>
          <br />
        </>
      )}
      <button type="submit" className={`form-submit${pending ? " loading" : ""}`} id="submitBtn" disabled={pending}>
        {pending ? <span id="btnLoader">Sending...</span> : <span id="btnText">Send Message</span>}
      </button>
      <div id="formMessage" className={message?.kind} style={{ display: message ? "block" : "none" }} role="status" aria-live="polite">
        {message?.text}
      </div>
    </form>
  );
}
