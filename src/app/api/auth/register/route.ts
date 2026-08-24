import { NextResponse } from "next/server";
import { registerProductionCustomer } from "@/lib/production/auth";
import { takePublicRequest } from "@/lib/server/publicRequestGuard";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const allowance = takePublicRequest(request, "customer-registration", { limit: 5, windowMs: 60 * 60_000 });
  if (!allowance.allowed) return NextResponse.json({ error: "rate_limited" }, { status: 429, headers: { "Cache-Control": "no-store", "Retry-After": String(allowance.retryAfterSeconds) } });
  const body = await request.json().catch(() => null) as { name?: unknown; email?: unknown; password?: unknown } | null;
  if (!body) return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  try {
    await registerProductionCustomer(body);
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    const code = error instanceof Error ? error.message : "registration_failed";
    return NextResponse.json({ error: code }, { status: code === "email_in_use" ? 409 : 400 });
  }
}
