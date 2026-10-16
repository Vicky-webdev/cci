import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "@/styles/fonts.css";
import "@/styles/legacy/cci.css";
// Per-page legacy styles, scoped with :where(.pg-<page>) so they apply only inside that page.
import "@/styles/pages/about.css";
import "@/styles/pages/awards.css";
import "@/styles/pages/books.css";
import "@/styles/pages/contact.css";
import "@/styles/pages/craft-processes.css";
import "@/styles/pages/crafts-map.css";
import "@/styles/pages/custom.css";
import "@/styles/pages/disclaimer.css";
import "@/styles/pages/event-detail.css";
import "@/styles/pages/events.css";
import "@/styles/pages/happenings-in-handmade.css";
import "@/styles/pages/news.css";
import "@/styles/pages/news-detail.css";
import "@/styles/pages/past-awards.css";
import "@/styles/pages/past-events.css";
import "@/styles/pages/past-happenings-in-handmade.css";
import "@/styles/pages/past-newsletters.css";
import "@/styles/pages/press.css";
import "@/styles/pages/press-details.css";
import "@/styles/pages/privacy-policy.css";
import "@/styles/pages/what-we-do.css";
import "@/styles/site.css";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { JsonLd } from "@/components/site/JsonLd";
import { getSettings } from "@/lib/settings";
import { assetUrl } from "@/lib/links";
import { env } from "@/lib/env";

// CMS content changes at any time, so public pages render per request (see ADR-005).
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  const base = env().SITE_URL;
  return {
    metadataBase: new URL(base),
    title: { default: s["seo.defaultTitle"], template: s["seo.titleTemplate"] },
    description: s["seo.defaultDescription"],
    icons: { icon: assetUrl(s["site.favicon"]), apple: assetUrl(s["site.favicon"]) },
    openGraph: { siteName: s["site.name"], type: "website", locale: "en_IN", images: [assetUrl(s["seo.defaultOgImage"])] },
    twitter: { card: "summary_large_image" },
    robots: env().SITE_ENV === "production" ? undefined : { index: false, follow: false },
  };
}

export async function generateViewport(): Promise<Viewport> {
  const s = await getSettings();
  return { themeColor: s["site.themeColor"], width: "device-width", initialScale: 1 };
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const s = await getSettings();
  const base = env().SITE_URL.replace(/\/$/, "");
  const gaId = s["analytics.gaMeasurementId"].trim();
  return (
    <html lang="en">
      <body>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main-content">{children}</main>
        <SiteFooter />
        {s["seo.organizationJsonLd"] && (
          <JsonLd
            data={{
              "@context": "https://schema.org",
              "@type": "Organization",
              name: s["site.name"],
              alternateName: s["site.shortName"],
              url: base,
              logo: base + assetUrl(s["site.logo"]),
              contactPoint: {
                "@type": "ContactPoint",
                telephone: s["contact.footerPhone"],
                contactType: "customer service",
                areaServed: "IN",
                availableLanguage: ["en", "hi", "ta"],
              },
              sameAs: s["social.links"].map((l) => l.url),
            }}
          />
        )}
        {/^G-[A-Z0-9]+$/.test(gaId) && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
            <Script id="ga-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
