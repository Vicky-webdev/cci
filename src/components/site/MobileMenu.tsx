"use client";

import { useEffect, useRef, useState } from "react";
import type { MenuNode } from "@/lib/queries/site";
import { SmartLink } from "./SmartLink";

/** Hamburger + mobile menu with accordion submenus and outside-click close (legacy nav.js). */
export function MobileMenu({ menu, ctaLabel, ctaHref }: { menu: MenuNode[]; ctaLabel: string; ctaHref: string }) {
  const [open, setOpen] = useState(false);
  const [openSub, setOpenSub] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (menuRef.current?.contains(t) || btnRef.current?.contains(t)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
        ref={btnRef}
        className={`hamburger${open ? " open" : ""}`}
        id="hamburgerBtn"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobileMenu"
        type="button"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
      <div
        ref={menuRef}
        id="mobileMenu"
        className={`mobile-menu${open ? " active" : ""}`}
        onClick={(e) => {
          // Close after following a link (client-side navigation keeps the component mounted).
          if ((e.target as HTMLElement).closest("a")) {
            setOpen(false);
            setOpenSub(null);
          }
        }}
      >
        {menu.map((item) =>
          item.children.length ? (
            <div className="mobile-menu-item" key={item.id}>
              <button
                type="button"
                className={`nav-reset${openSub === item.id ? " active" : ""}`}
                aria-expanded={openSub === item.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenSub((cur) => (cur === item.id ? null : item.id));
                }}
                style={{ width: "100%", textAlign: "left", display: "block" }}
              >
                <span className={openSub === item.id ? "active" : undefined}>{item.label}</span>
              </button>
              <div className={`mobile-submenu${openSub === item.id ? " open" : ""}`}>
                {item.children.map((c) => (
                  <SmartLink key={c.id} href={c.href} newTab={c.openInNewTab}>
                    {c.label}
                  </SmartLink>
                ))}
              </div>
            </div>
          ) : (
            <div className="mobile-menu-item" key={item.id}>
              <SmartLink href={item.href} newTab={item.openInNewTab}>
                {item.label}
              </SmartLink>
            </div>
          ),
        )}
        <div className="mobile-cta-item">
          <SmartLink href={ctaHref}>{ctaLabel}</SmartLink>
        </div>
      </div>
    </>
  );
}
