import { getSettings } from "@/lib/settings";
import { ContactForm } from "./ContactForm";
import { s, type SectionData } from "./types";

export async function ContactSection({ data }: { data: SectionData }) {
  const settings = await getSettings();
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? "";
  return (
    <div className="section">
      <div className="contact-grid">
        <div>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 36, marginBottom: 16 }}>{s(data, "formTitle")}</h2>
          <p style={{ fontSize: 15, color: "var(--mud)", marginBottom: 32, lineHeight: 1.7, fontWeight: 300 }}>{s(data, "formIntro")}</p>
          {settings["forms.contact.enabled"] ? (
            <ContactForm siteKey={siteKey} successMessage={s(data, "successMessage") || settings["forms.contact.successMessage"]} />
          ) : (
            <p>The enquiry form is temporarily unavailable. Please email {settings["contact.email"]}.</p>
          )}
        </div>
        <div>
          <div className="contact-info">
            <h3 className="info-title">{s(data, "infoTitle", "Contact Information")}</h3>
            <div className="info-item">
              <div className="info-icon" aria-hidden="true">&#128205;</div>
              <div className="info-content">
                <h4>Head Office</h4>
                <p>
                  {settings["contact.addressLines"].map((l, i, a) => (
                    <span key={i}>
                      {l}
                      {i < a.length - 1 && <br />}
                    </span>
                  ))}
                </p>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon" aria-hidden="true">&#128231;</div>
              <div className="info-content">
                <h4>Email</h4>
                <p>
                  <a href={`mailto:${settings["contact.email"]}`} style={{ color: "inherit", textDecoration: "none" }}>
                    {settings["contact.email"]}
                  </a>
                </p>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon" aria-hidden="true">&#128222;</div>
              <div className="info-content">
                <h4>Phone</h4>
                <p>
                  {settings["contact.phones"].map((p, i, a) => (
                    <span key={i}>
                      {p}
                      {i < a.length - 1 && <br />}
                    </span>
                  ))}
                </p>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon" aria-hidden="true">&#128336;</div>
              <div className="info-content">
                <h4>Office Hours</h4>
                <p>
                  {settings["contact.officeHours"].map((h, i, a) => (
                    <span key={i}>
                      {h}
                      {i < a.length - 1 && <br />}
                    </span>
                  ))}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
