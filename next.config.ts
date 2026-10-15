import type { NextConfig } from "next";
import { LEGACY_PAGE_MAP } from "./src/lib/links";

// Security headers carried over from the legacy .htaccess (X-XSS-Protection dropped: obsolete and
// ignored by modern browsers). The CSP allows only the third parties the site actually uses.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""} https://www.googletagmanager.com https://www.google.com https://www.gstatic.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "media-src 'self' blob:",
  "font-src 'self' data:",
  "connect-src 'self' https://feeds.behold.so https://www.google-analytics.com https://*.google-analytics.com https://www.googletagmanager.com",
  "frame-src https://www.youtube.com https://www.youtube-nocookie.com https://www.google.com",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const securityHeaders = [
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "geolocation=(), camera=(), microphone=()" },
  { key: "Content-Security-Policy", value: csp },
  ...(process.env.SITE_ENV === "production"
    ? [{ key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" }]
    : []),
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  serverExternalPackages: ["@node-rs/argon2", "sharp"],
  images: { unoptimized: false },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // Legacy .htaccess cached images for a year; filenames are not content-hashed, so a month is safer.
      {
        source: "/:dir(images|docs)/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=2592000" }],
      },
    ];
  },
  async redirects() {
    return Object.entries(LEGACY_PAGE_MAP).map(([file, to]) => ({
      source: `/${file}`,
      destination: to,
      permanent: true,
    }));
  },
};

export default nextConfig;
