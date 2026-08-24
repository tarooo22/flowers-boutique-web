import { NextResponse } from "next/server";
import { getDeliveryPolicy } from "@/lib/production/storefrontSettings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const { policy, revision } = await getDeliveryPolicy();
  return NextResponse.json({ policy, revision }, { headers: { "Cache-Control": "public, max-age=60, s-maxage=60" } });
}
