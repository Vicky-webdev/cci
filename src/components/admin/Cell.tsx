import { STATUS_LABELS } from "@/lib/content/publishing";
import { assetUrl } from "@/lib/links";
import type { ListColumn } from "@/lib/admin/resources";

export function Cell({ col, value }: { col: ListColumn; value: unknown }) {
  switch (col.format) {
    case "status":
      return <span className={`a-badge ${String(value)}`}>{STATUS_LABELS[value as keyof typeof STATUS_LABELS] ?? String(value)}</span>;
    case "boolean":
      return <span className={`a-badge ${value ? "yes" : "no"}`}>{value ? "Yes" : "No"}</span>;
    case "date":
      return <>{value instanceof Date ? value.toISOString().slice(0, 10) : ""}</>;
    case "datetime":
      return <>{value instanceof Date ? value.toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" }) : ""}</>;
    case "image":
      return value && /\.(jpe?g|png|gif|webp|avif)$/i.test(String(value)) ? (
        // eslint-disable-next-line @next/next/no-img-element -- admin thumbnail
        <img className="a-thumb" src={assetUrl(String(value))} alt="" loading="lazy" />
      ) : (
        <span className="a-thumb" />
      );
    case "code":
      return <code>{String(value ?? "")}</code>;
    default:
      return <>{value == null ? "" : String(value)}</>;
  }
}
