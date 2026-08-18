import { NextResponse } from "next/server";
import { registerProductionCustomer } from "@/lib/production/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
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
