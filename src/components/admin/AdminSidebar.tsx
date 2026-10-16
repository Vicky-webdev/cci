"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export function AdminSidebar({ groups }: { groups: { group: string; items: { href: string; label: string }[] }[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));
  return (
    <>
      <button type="button" className="a-btn secondary small a-menu-toggle" style={{ position: "fixed", top: 10, left: 10, zIndex: 950 }} onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-controls="admin-sidebar">
        ☰ Menu
      </button>
      <aside id="admin-sidebar" className={`a-side${open ? " open" : ""}`} onClick={(e) => (e.target as HTMLElement).tagName === "A" && setOpen(false)}>
        <Link href="/admin" className="a-brand">
          {/* eslint-disable-next-line @next/next/no-img-element -- static logo */}
          <img src="/images/cci-logo.png" alt="" />
          <span>CCI Admin</span>
        </Link>
        <nav className="a-nav" aria-label="Admin">
          {groups.map((g, i) => (
            <div key={i}>
              {g.group && <div className="a-nav-group">{g.group}</div>}
              {g.items.map((it) => (
                <Link key={it.href} href={it.href} aria-current={isActive(it.href) ? "page" : undefined}>
                  {it.label}
                </Link>
              ))}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
