import Link from "next/link";
import { getMenu } from "@/lib/queries/site";
import { getSettings } from "@/lib/settings";
import { assetUrl } from "@/lib/links";
import { SmartLink } from "./SmartLink";
import { MobileMenu } from "./MobileMenu";

/** Server-rendered equivalent of legacy nav.js (desktop) + the mobile menu. */
export async function SiteHeader() {
  const [menu, s] = await Promise.all([getMenu("main"), getSettings()]);
  return (
    <>
      <nav id="main-nav" aria-label="Main">
        <Link className="nav-logo" href="/">
          {/* eslint-disable-next-line @next/next/no-img-element -- legacy markup/size preserved */}
          <img src={assetUrl(s["site.logo"])} style={{ width: 110 }} alt="CCI Logo" />
        </Link>
        <ul className="nav-center">
          {menu.map((item) => (
            <li className="nav-item" key={item.id}>
              <SmartLink href={item.href} newTab={item.openInNewTab}>
                {item.label}
              </SmartLink>
              {item.children.length > 0 && (
                <div className="dropdown">
                  {item.children.map((c) => (
                    <SmartLink key={c.id} href={c.href} newTab={c.openInNewTab}>
                      {c.label}
                    </SmartLink>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
        <Link className="nav-cta" href={s["nav.ctaHref"]}>
          {s["nav.ctaLabel"]}
        </Link>
        <MobileMenu menu={menu} ctaLabel={s["nav.ctaLabel"]} ctaHref={s["nav.ctaHref"]} />
      </nav>
    </>
  );
}
