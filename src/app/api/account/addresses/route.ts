import { and, desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { getProductionSessionUser } from "@/lib/production/auth";
import { customerAddresses, getProductionDb } from "@/lib/production/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "private, no-store" };
const MAX_ADDRESSES = 10;
const text = (value: unknown, max: number) => typeof value === "string" ? value.trim().slice(0, max) : "";
const id = (value: unknown) => typeof value === "number" && Number.isSafeInteger(value) && value > 0 ? value : null;

function addressInput(body: any) {
  const input = { label: text(body?.label, 80), recipientName: text(body?.recipientName, 120), phone: text(body?.phone, 32), city: text(body?.city, 80) || "თბილისი", address: text(body?.address, 1000), instructions: text(body?.instructions, 1000), isDefault: Boolean(body?.isDefault) };
  if (!input.label || !input.recipientName || !input.address || (input.phone && !/^[0-9+()\-\s]{5,32}$/.test(input.phone))) return null;
  return input;
}

async function currentUser() {
  const user = await getProductionSessionUser();
  return user ?? null;
}

export async function GET() {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401, headers });
  const addresses = await getProductionDb().select().from(customerAddresses).where(eq(customerAddresses.userId, user.id)).orderBy(desc(customerAddresses.isDefault), desc(customerAddresses.updatedAt));
  return NextResponse.json({ addresses }, { headers });
}

export async function POST(request: NextRequest) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401, headers });
  const input = addressInput(await request.json().catch(() => null));
  if (!input) return NextResponse.json({ error: "invalid_address" }, { status: 400, headers });
  const db = getProductionDb();
  const currentAddresses = await db.select({ id: customerAddresses.id }).from(customerAddresses).where(eq(customerAddresses.userId, user.id)).limit(MAX_ADDRESSES);
  if (currentAddresses.length >= MAX_ADDRESSES) return NextResponse.json({ error: "address_limit" }, { status: 400, headers });
  const inserted = await db.transaction(async (tx) => {
    const existing = await tx.select({ id: customerAddresses.id }).from(customerAddresses).where(eq(customerAddresses.userId, user.id)).limit(1);
    const makeDefault = input.isDefault || existing.length === 0;
    if (makeDefault) await tx.update(customerAddresses).set({ isDefault: false }).where(eq(customerAddresses.userId, user.id));
    const result = await tx.insert(customerAddresses).values({ ...input, isDefault: makeDefault, userId: user.id, phone: input.phone || null, instructions: input.instructions || null });
    return Number(result[0]?.insertId);
  });
  const address = (await db.select().from(customerAddresses).where(and(eq(customerAddresses.id, inserted), eq(customerAddresses.userId, user.id))).limit(1))[0];
  return NextResponse.json({ address }, { status: 201, headers });
}

export async function PATCH(request: NextRequest) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401, headers });
  const body = await request.json().catch(() => null);
  const addressId = id(body?.id);
  const input = addressInput(body);
  if (!addressId || !input) return NextResponse.json({ error: "invalid_address" }, { status: 400, headers });
  const db = getProductionDb();
  const address = await db.transaction(async (tx) => {
    const owned = await tx.select({ id: customerAddresses.id }).from(customerAddresses).where(and(eq(customerAddresses.id, addressId), eq(customerAddresses.userId, user.id))).limit(1);
    if (!owned[0]) return null;
    if (input.isDefault) await tx.update(customerAddresses).set({ isDefault: false }).where(eq(customerAddresses.userId, user.id));
    await tx.update(customerAddresses).set({ ...input, phone: input.phone || null, instructions: input.instructions || null }).where(and(eq(customerAddresses.id, addressId), eq(customerAddresses.userId, user.id)));
    return (await tx.select().from(customerAddresses).where(and(eq(customerAddresses.id, addressId), eq(customerAddresses.userId, user.id))).limit(1))[0] ?? null;
  });
  if (!address) return NextResponse.json({ error: "not_found" }, { status: 404, headers });
  return NextResponse.json({ address }, { headers });
}

export async function DELETE(request: NextRequest) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401, headers });
  const addressId = id(Number(new URL(request.url).searchParams.get("id")));
  if (!addressId) return NextResponse.json({ error: "invalid_address" }, { status: 400, headers });
  const db = getProductionDb();
  const owned = await db.select({ id: customerAddresses.id, isDefault: customerAddresses.isDefault }).from(customerAddresses).where(and(eq(customerAddresses.id, addressId), eq(customerAddresses.userId, user.id))).limit(1);
  if (!owned[0]) return NextResponse.json({ error: "not_found" }, { status: 404, headers });
  await db.transaction(async (tx) => {
    await tx.delete(customerAddresses).where(and(eq(customerAddresses.id, addressId), eq(customerAddresses.userId, user.id)));
    if (owned[0]?.isDefault) {
      const replacement = await tx.select({ id: customerAddresses.id }).from(customerAddresses).where(eq(customerAddresses.userId, user.id)).orderBy(desc(customerAddresses.updatedAt)).limit(1);
      if (replacement[0]) await tx.update(customerAddresses).set({ isDefault: true }).where(and(eq(customerAddresses.id, replacement[0].id), eq(customerAddresses.userId, user.id)));
    }
  });
  return NextResponse.json({ ok: true }, { headers });
}
