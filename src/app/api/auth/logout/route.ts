import { NextResponse } from "next/server";
import { logoutProductionCustomer } from "@/lib/production/auth";

export const runtime = "nodejs";

export async function POST() {
  await logoutProductionCustomer();
  return NextResponse.json({ ok: true });
}
