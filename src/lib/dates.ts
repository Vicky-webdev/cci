/**
 * Parses the free-text date strings used throughout the legacy site into a date range.
 * Handles month-first ("July 31 – August 6, 2025", "May 9, 16, 23 & 30, 2026") and
 * day-first ("31 July, 1 & 3 August 2026 (Closed on 2 August)", "9–12 October 2026")
 * forms, embedded times, and scraped WordPress ranges ("March 21, 2019 10:30 am – 23, 2019 7:00 pm").
 * Returns null when no day + month + year can be established (e.g. "Coming Soon").
 */

const MONTHS: Record<string, number> = {
  jan: 0, january: 0, feb: 1, february: 1, mar: 2, march: 2, apr: 3, april: 3, may: 4,
  jun: 5, june: 5, jul: 6, july: 6, aug: 7, august: 7, sep: 8, sept: 8, september: 8,
  oct: 9, october: 9, nov: 10, november: 10, dec: 11, december: 11,
};

type Token = { kind: "day"; value: number } | { kind: "month"; value: number } | { kind: "year"; value: number };

export interface DateRange {
  start: Date;
  end: Date;
}

function tokenize(input: string): Token[] {
  const cleaned = input
    .replace(/\([^)]*\)/g, " ") // parenthetical notes
    .replace(/\b\d{1,2}[:.]\d{2}\s*(?:am|pm|a\.m\.|p\.m\.)?/gi, " ") // times
    .replace(/\b\d{1,2}\s*(?:am|pm)\b/gi, " ")
    .replace(/(\d)(st|nd|rd|th)\b/gi, "$1");
  const tokens: Token[] = [];
  for (const m of cleaned.matchAll(/[A-Za-z]+|\d+/g)) {
    const word = m[0];
    if (/^\d+$/.test(word)) {
      const n = Number(word);
      if (word.length === 4 && n >= 1900 && n <= 2100) tokens.push({ kind: "year", value: n });
      else if (word.length <= 2 && n >= 1 && n <= 31) tokens.push({ kind: "day", value: n });
    } else {
      const month = MONTHS[word.toLowerCase()];
      if (month !== undefined) tokens.push({ kind: "month", value: month });
    }
  }
  return tokens;
}

export function parseDateRange(input: string | null | undefined): DateRange | null {
  if (!input) return null;
  const tokens = tokenize(input);
  const firstMeaningful = tokens.find((t) => t.kind !== "year");
  if (!firstMeaningful) return null;
  const monthFirst = firstMeaningful.kind === "month";

  const entries: { d: number; m?: number; y?: number }[] = [];
  let currentMonth: number | undefined;
  for (const t of tokens) {
    if (t.kind === "day") {
      entries.push({ d: t.value, m: monthFirst ? currentMonth : undefined });
    } else if (t.kind === "month") {
      if (monthFirst) currentMonth = t.value;
      else for (const e of entries) if (e.m === undefined) e.m = t.value;
    } else {
      for (const e of entries) if (e.y === undefined) e.y = t.value;
    }
  }
  // Fill gaps from neighbours (e.g. a trailing year with no following entries).
  for (let i = 0; i < entries.length; i++) {
    const e = entries[i];
    if (e.m === undefined) e.m = entries.slice(i + 1).find((x) => x.m !== undefined)?.m ?? entries.slice(0, i).reverse().find((x) => x.m !== undefined)?.m;
    if (e.y === undefined) e.y = entries.slice(i + 1).find((x) => x.y !== undefined)?.y ?? entries.slice(0, i).reverse().find((x) => x.y !== undefined)?.y;
  }
  const dates = entries
    .filter((e): e is { d: number; m: number; y: number } => e.m !== undefined && e.y !== undefined)
    .map((e) => new Date(Date.UTC(e.y, e.m, e.d)))
    .filter((d) => !Number.isNaN(d.getTime()));
  if (!dates.length) return null;
  const sorted = dates.sort((a, b) => a.getTime() - b.getTime());
  return { start: sorted[0], end: sorted[sorted.length - 1] };
}

/** Today's date (UTC midnight) in the site's time zone (Asia/Kolkata). */
export function todayInIndia(now = new Date()): Date {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit" })
    .format(now)
    .split("-")
    .map(Number);
  return new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
}

/** Legacy semantics: an event is "upcoming" when its start date is today or later. */
export function isUpcoming(start: Date | null | undefined, now = new Date()): boolean {
  if (!start) return false;
  return start.getTime() >= todayInIndia(now).getTime();
}

export function toIsoDate(d: Date | null | undefined): string | null {
  return d ? d.toISOString().slice(0, 10) : null;
}
