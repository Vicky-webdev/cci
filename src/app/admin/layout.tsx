import type { Metadata } from "next";
import "@fontsource/dm-sans/400.css";
import "@fontsource/dm-sans/500.css";
import "@/styles/admin.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { default: "CCI Admin", template: "%s · CCI Admin" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="admin">{children}</body>
    </html>
  );
}
