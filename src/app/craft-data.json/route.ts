import { NextResponse } from "next/server";
import { listCraftStates } from "@/lib/queries/content";

export const dynamic = "force-dynamic";

/** Legacy /craft-data.json, regenerated from the CMS in the original shape. */
export async function GET() {
  const states = await listCraftStates();
  return NextResponse.json(
    states.map((s) => ({
      state: s.sourceNames[0] ?? s.name,
      count: s.locations.length,
      crafts: s.locations.map((l) => ({ craft: l.craft, district: l.district, village: l.village })),
    })),
  );
}
