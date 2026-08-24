import { and, desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { getProductionSessionUser } from "@/lib/production/auth";
import { customerGiftReminders, getProductionDb } from "@/lib/production/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "private, no-store" };
const text = (value: unknown, max: number) => typeof value === "string" ? value.trim().slice(0, max) : "";
const reminderDate = (value: unknown) => typeof value === "string" && /^(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(value) ? value : null;

async function currentUser() { return (await getProductionSessionUser()) ?? null; }

export async function GET() {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401, headers });
  const reminders = await getProductionDb().select().from(customerGiftReminders).where(eq(customerGiftReminders.userId, user.id)).orderBy(desc(customerGiftReminders.reminderMonthDay), desc(customerGiftReminders.createdAt));
  return NextResponse.json({ reminders, delivery: "not_configured" }, { headers });
}

export async function POST(request: NextRequest) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401, headers });
  const body = await request.json().catch(() => null);
  const occasion = text(body?.occasion, 80);
  const monthDay = reminderDate(body?.reminderMonthDay);
  const recipientName = text(body?.recipientName, 120);
  const note = text(body?.note, 400);
  if (!occasion || !monthDay) return NextResponse.json({ error: "invalid_reminder" }, { status: 400, headers });
  const db = getProductionDb();
  const count = await db.select({ id: customerGiftReminders.id }).from(customerGiftReminders).where(eq(customerGiftReminders.userId, user.id)).limit(20);
  if (count.length >= 20) return NextResponse.json({ error: "reminder_limit" }, { status: 400, headers });
  const result = await db.insert(customerGiftReminders).values({ userId: user.id, occasion, reminderMonthDay: monthDay, recipientName: recipientName || null, note: note || null });
  const reminder = (await db.select().from(customerGiftReminders).where(and(eq(customerGiftReminders.id, Number(result[0]?.insertId)), eq(customerGiftReminders.userId, user.id))).limit(1))[0];
  return NextResponse.json({ reminder }, { status: 201, headers });
}

export async function DELETE(request: NextRequest) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401, headers });
  const id = Number(new URL(request.url).searchParams.get("id"));
  if (!Number.isSafeInteger(id) || id < 1) return NextResponse.json({ error: "invalid_reminder" }, { status: 400, headers });
  const result = await getProductionDb().delete(customerGiftReminders).where(and(eq(customerGiftReminders.id, id), eq(customerGiftReminders.userId, user.id)));
  if (!result[0]?.affectedRows) return NextResponse.json({ error: "not_found" }, { status: 404, headers });
  return NextResponse.json({ ok: true }, { headers });
}
