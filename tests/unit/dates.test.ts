import { describe, expect, it } from "vitest";
import { isUpcoming, parseDateRange, todayInIndia } from "@/lib/dates";

const iso = (d: Date | undefined) => d?.toISOString().slice(0, 10);
const range = (s: string) => {
  const r = parseDateRange(s);
  return r ? [iso(r.start), iso(r.end)] : null;
};

describe("parseDateRange — every date format found in the legacy data", () => {
  it.each([
    ["November 23, 2024", ["2024-11-23", "2024-11-23"]],
    ["March 7– 8, 2025", ["2025-03-07", "2025-03-08"]],
    ["July 31 – August 6, 2025", ["2025-07-31", "2025-08-06"]],
    ["May 9, 16, 23 & 30, 2026", ["2026-05-09", "2026-05-30"]],
    ["24, 25, 26 September 2026", ["2026-09-24", "2026-09-26"]],
    ["9, 10 & 12 October 2026", ["2026-10-09", "2026-10-12"]],
    ["9–12 October 2026", ["2026-10-09", "2026-10-12"]],
    ["23 October 2026 – 22 November 2026", ["2026-10-23", "2026-11-22"]],
    ["31 July, 1 & 3 August 2026 (Closed on 2 August)", ["2026-07-31", "2026-08-03"]],
    ["March 21, 2019 10:30 am – 23, 2019 7:00 pm", ["2019-03-21", "2019-03-23"]],
    ["October 3, 2019 – January 31, 2020", ["2019-10-03", "2020-01-31"]],
    ["june 14, 2014 – 14, 2014", ["2014-06-14", "2014-06-14"]],
    ["April 3, 2018 5:30 pm – 7:00 pm", ["2018-04-03", "2018-04-03"]],
  ])("%s", (input, expected) => {
    expect(range(input)).toEqual(expected);
  });

  it.each(["", "Coming Soon", "N/A", "2026"])("returns null for %j", (input) => {
    expect(parseDateRange(input)).toBeNull();
  });
});

describe("isUpcoming", () => {
  const now = new Date("2026-10-15T06:00:00Z");
  it("treats today as upcoming (start date >= today, India time)", () => {
    expect(isUpcoming(new Date("2026-10-15T00:00:00Z"), now)).toBe(true);
    expect(isUpcoming(new Date("2026-10-14T00:00:00Z"), now)).toBe(false);
    expect(isUpcoming(null, now)).toBe(false);
  });
  it("uses the Asia/Kolkata calendar date", () => {
    // 20:00 UTC on the 14th is already the 15th in India.
    expect(iso(todayInIndia(new Date("2026-10-14T20:00:00Z")))).toBe("2026-10-15");
  });
});
