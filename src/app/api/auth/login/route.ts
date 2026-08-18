import { NextResponse } from "next/server";
import { loginProductionCustomer } from "@/lib/production/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { email?: unknown; password?: unknown } | null;
  if (!body) return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  try {
    const role = await loginProductionCustomer(body);
    return NextResponse.json({ ok: true, role });
  } catch (error) {
    const code = error instanceof Error ? error.message : "login_failed";
    return NextResponse.json({ error: code }, { status: code === "invalid_credentials" ? 401 : 400 });
  }
}
