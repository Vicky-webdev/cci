import Link from "next/link";
import { isExternal } from "@/lib/links";

/** Internal links use next/link; external ones open as plain anchors. "#" or empty renders a non-navigating anchor. */
export function SmartLink({
  href,
  newTab,
  children,
  ...rest
}: { href: string; newTab?: boolean; children: React.ReactNode } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  if (!href || href === "#") {
    return (
      <a href="#" {...rest} onClick={undefined}>
        {children}
      </a>
    );
  }
  if (isExternal(href) || newTab || /^(mailto|tel):/.test(href) || /\.(pdf|docx?)$/i.test(href)) {
    return (
      <a href={href} {...(newTab || isExternal(href) ? { target: "_blank", rel: "noopener noreferrer" } : {})} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} {...rest}>
      {children}
    </Link>
  );
}
