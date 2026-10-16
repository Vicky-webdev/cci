import { Fragment } from "react";
import { getMenu, type MenuNode } from "@/lib/queries/site";
import { getSettings } from "@/lib/settings";
import { SmartLink } from "./SmartLink";
import { InstagramFeed } from "./InstagramFeed";
import { SocialIcon } from "./SocialIcon";
import { assetUrl } from "@/lib/links";

const Column = ({ title, items }: { title: string; items: MenuNode[] }) => (
  <div className="f-col">
    <div className="f-col-title">{title}</div>
    {items.map((l) => (
      <SmartLink key={l.id} href={l.href} newTab={l.openInNewTab}>
        {l.label}
      </SmartLink>
    ))}
  </div>
);

/** Server-rendered equivalent of legacy footer.js (Instagram band + footer). */
export async function SiteFooter() {
  const [s, quick, resources, connect, legal] = await Promise.all([
    getSettings(),
    getMenu("footer-quick"),
    getMenu("footer-resources"),
    getMenu("footer-connect"),
    getMenu("legal"),
  ]);
  return (
    <div id="site-footer">
      {s["instagram.enabled"] && (
        <div className="insta-section">
          <div className="insta-header">
            <div>
              <p className="eyebrow">Follow our journey</p>
              <h2 className="s-title" style={{ color: "#FAF6EF", fontFamily: "'Cormorant Garamond',serif" }}>
                On Instagram
              </h2>
            </div>
            <a href={s["instagram.profileUrl"]} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
              <div className="insta-handle">
                <SocialIcon platform="instagram" size={16} stroke="rgba(250,246,239,0.5)" />
                <span className="ig-handle-text">{s["instagram.handle"]}</span>
              </div>
            </a>
          </div>
          <InstagramFeed
            feedUrl={s["instagram.beholdFeedUrl"]}
            profileUrl={s["instagram.profileUrl"]}
            handle={s["instagram.handle"]}
            fallbackImages={s["instagram.fallbackImages"].map((p) => assetUrl(p))}
          />
        </div>
      )}
      <footer>
        <div className="footer-top">
          <div>
            <div className="f-brand">{s["site.name"]}</div>
            <div className="f-addr">
              {s["contact.addressLines"].map((line, i) => (
                <span key={i}>
                  {line}
                  <br />
                </span>
              ))}
              <br />
              <a href={`mailto:${s["contact.email"]}`} style={{ color: "inherit", textDecoration: "none" }}>
                {s["contact.email"]}
              </a>
              <br />
              {s["contact.footerPhone"]}
            </div>
          </div>
          <Column title={s["footer.quickLinksTitle"]} items={quick} />
          <Column title={s["footer.resourcesTitle"]} items={resources} />
          <Column title={s["footer.connectTitle"]} items={connect} />
        </div>
        <div className="footer-bottom">
          <div className="f-copy">
            <span>{s["site.copyright"]}</span>
            <span className="f-legal-links">
              {legal.map((l) => (
                <Fragment key={l.id}>
                  {" "}
                  <SmartLink href={l.href}>{l.label}</SmartLink>{" "}
                </Fragment>
              ))}
            </span>
          </div>
          <div className="f-socials">
            {s["social.links"].map((link) => (
              <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer" className="f-social" title={link.label} aria-label={link.label}>
                <SocialIcon platform={link.platform} size={link.platform === "youtube" ? 14 : 13} />
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
