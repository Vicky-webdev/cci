export type SectionData = Record<string, unknown>;

export const s = (d: SectionData, k: string, fallback = ""): string => (typeof d[k] === "string" ? (d[k] as string) : fallback);
export const n = (d: SectionData, k: string, fallback: number): number => {
  const v = Number(d[k]);
  return Number.isFinite(v) && v > 0 ? v : fallback;
};
export const b = (d: SectionData, k: string): boolean => d[k] === true;
export const list = <T = SectionData>(d: SectionData, k: string): T[] => (Array.isArray(d[k]) ? (d[k] as T[]) : []);
