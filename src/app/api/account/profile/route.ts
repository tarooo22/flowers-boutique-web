import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getProductionSessionUser } from "@/lib/production/auth";
import { getProductionDb, users } from "@/lib/production/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "private, no-store" };
const clean = (value: unknown, max: number) => typeof value === "string" ? value.trim().slice(0, max) : "";

export async function GET() {
  const user = await getProductionSessionUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401, headers });
  return NextResponse.json({ profile: { name: user.name ?? "", email: user.email ?? "", phone: user.phone ?? "" } }, { headers });
}

export async function PATCH(request: NextRequest) {
  const user = await getProductionSessionUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401, headers });
  const body = await request.json().catch(() => null);
  const name = clean(body?.name, 120);
  const phone = clean(body?.phone, 32);
  if (name.length < 2 || (phone && !/^[0-9+()\-\s]{5,32}$/.test(phone))) return NextResponse.json({ error: "invalid_profile" }, { status: 400, headers });
  await getProductionDb().update(users).set({ name, phone: phone || null }).where(eq(users.id, user.id));
  return NextResponse.json({ profile: { name, email: user.email ?? "", phone } }, { headers });
}
