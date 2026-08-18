import { NextResponse } from "next/server";
import { listOverrides } from "@/lib/server/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Public read-only view of the admin's product overrides, so the storefront
 * can reflect price / stock edits without a rebuild.
 */
export async function GET() {
  return NextResponse.json(
    { overrides: await listOverrides() },
    { headers: { "Cache-Control": "no-store" } },
  );
}
