import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { getProductionSessionUser } from "@/lib/production/auth";
import { customerNotificationPreferences, getProductionDb } from "@/lib/production/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "private, no-store" };
const defaults = { orderUpdates: true, flowerCircleUpdates: true, editorialUpdates: false };

export async function GET() {
  const user = await getProductionSessionUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401, headers });
  const preference = (await getProductionDb().select().from(customerNotificationPreferences).where(eq(customerNotificationPreferences.userId, user.id)).limit(1))[0];
  return NextResponse.json({ preferences: preference ? { orderUpdates: preference.orderUpdates, flowerCircleUpdates: preference.flowerCircleUpdates, editorialUpdates: preference.editorialUpdates } : defaults }, { headers });
}

export async function PATCH(request: NextRequest) {
  const user = await getProductionSessionUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401, headers });
  const body = await request.json().catch(() => null);
  if (!body || [body.orderUpdates, body.flowerCircleUpdates, body.editorialUpdates].some((value) => typeof value !== "boolean")) return NextResponse.json({ error: "invalid_preferences" }, { status: 400, headers });
  const preferences = { orderUpdates: body.orderUpdates, flowerCircleUpdates: body.flowerCircleUpdates, editorialUpdates: body.editorialUpdates };
  await getProductionDb().insert(customerNotificationPreferences).values({ userId: user.id, ...preferences }).onDuplicateKeyUpdate({ set: preferences });
  return NextResponse.json({ preferences }, { headers });
}
