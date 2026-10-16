/** Pages that loaded custom.css in the legacy site. */
const CUSTOM_CSS_PAGES = new Set([
  "happenings-in-handmade",
  "past-happenings-in-handmade",
  "newsletters",
  "past-newsletters",
  "reports",
]);

/** Wraps a page so its scoped legacy stylesheet (src/styles/pages/<page>.css) applies. */
export function PageScope({ page, children }: { page: string; children: React.ReactNode }) {
  const cls = `pg-${page}${CUSTOM_CSS_PAGES.has(page) ? " pg-custom" : ""}`;
  return <div className={cls}>{children}</div>;
}
