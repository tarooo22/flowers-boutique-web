import { NextResponse } from "next/server";
import { listProductionHomepageBanners } from "@/lib/production/admin";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({ banners: await listProductionHomepageBanners() });
}
