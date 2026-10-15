import { s, type SectionData } from "./types";

export function PageHero({ data }: { data: SectionData }) {
  const gold = s(data, "variant") === "gold";
  return (
    <div className={`page-hero${gold ? " gold-hero" : ""}`}>
      {s(data, "watermark") && (
        <div className="kamala-bg" aria-hidden="true">
          {s(data, "watermark")}
        </div>
      )}
      <div className="page-hero-content">
        <h1 className="page-title">{s(data, "title")}</h1>
        {s(data, "subtitle") && <p className="page-subtitle">{s(data, "subtitle")}</p>}
      </div>
    </div>
  );
}
