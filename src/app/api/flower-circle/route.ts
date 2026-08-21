import { NextResponse } from "next/server";
import { getProductionSessionUser } from "@/lib/production/auth";
import { getFlowerCircleSummary } from "@/lib/production/flowerCircle";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Returns only the current session user's Flower Circle progress. */
export async function GET() {
  const user = await getProductionSessionUser();
  if (!user) return NextResponse.json({ summary: null }, { headers: { "Cache-Control": "private, no-store" } });
  return NextResponse.json(
    { summary: await getFlowerCircleSummary(user) },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
