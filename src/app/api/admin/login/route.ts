import { NextResponse } from "next/server";
import { checkPassword, startSession, endSession } from "@/lib/server/auth";
import { takePublicRequest } from "@/lib/server/publicRequestGuard";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const allowance = takePublicRequest(request, "admin-login", { limit: 6, windowMs: 15 * 60_000 });
  if (!allowance.allowed) return NextResponse.json({ error: "rate_limited" }, { status: 429, headers: { "Cache-Control": "no-store", "Retry-After": String(allowance.retryAfterSeconds) } });
  let password = "";
  try {
    const body = (await request.json()) as { password?: unknown };
    password = typeof body.password === "string" ? body.password : "";
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  if (!checkPassword(password)) {
    // deliberately vague, and slowed slightly to blunt guessing
    await new Promise((r) => setTimeout(r, 400));
    return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });
  }

  await startSession();
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  await endSession();
  return NextResponse.json({ ok: true });
}
