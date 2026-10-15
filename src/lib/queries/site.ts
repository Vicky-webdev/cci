import "server-only";
import { cache } from "react";
import { db } from "@/lib/db";
import { publishedWhere } from "@/lib/content/publishing";
import { readSections } from "@/lib/content/sections";

export interface MenuNode {
  id: string;
  label: string;
  href: string;
  openInNewTab: boolean;
  children: MenuNode[];
}

export const getMenu = cache(async (menu: string): Promise<MenuNode[]> => {
  const items = await db.menuItem.findMany({ where: { menu, isVisible: true }, orderBy: { sortOrder: "asc" } });
  const toNode = (i: (typeof items)[number]): MenuNode => ({
    id: i.id,
    label: i.label,
    href: i.href,
    openInNewTab: i.openInNewTab,
    children: items.filter((c) => c.parentId === i.id).map(toNode),
  });
  return items.filter((i) => !i.parentId).map(toNode);
});

export const getPublishedPage = cache(async (slug: string) => {
  const page = await db.page.findFirst({ where: { slug, ...publishedWhere() } });
  if (!page) return null;
  return { ...page, sections: readSections(page.sections).filter((s) => !s.hidden) };
});

export async function findRedirect(path: string) {
  const r = await db.redirect.findFirst({ where: { source: path, isActive: true } });
  if (r) await db.redirect.update({ where: { id: r.id }, data: { hits: { increment: 1 } } });
  return r;
}
