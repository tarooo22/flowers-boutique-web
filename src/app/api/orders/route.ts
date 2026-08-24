import { NextResponse } from "next/server";
import { createProductionOrder } from "@/lib/production/orders";
import { getProductionSessionUser } from "@/lib/production/auth";
import { takePublicRequest } from "@/lib/server/publicRequestGuard";

export const runtime = "nodejs";

/** Places an order from the checkout form. */
export async function POST(request: Request) {
  const allowance = takePublicRequest(request, "orders", { limit: 12, windowMs: 10 * 60_000 });
  if (!allowance.allowed) return NextResponse.json({ error: "rate_limited" }, { status: 429, headers: { "Cache-Control": "no-store", "Retry-After": String(allowance.retryAfterSeconds) } });
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  try {
    const payload = body as { customer?: unknown; items?: unknown; useFlowerCircleBenefit?: unknown };
    const sessionUser = await getProductionSessionUser();
    const order = await createProductionOrder({
      customer: (payload.customer ?? {}) as never,
      items: Array.isArray(payload.items) ? payload.items.slice(0, 60) as never : [],
      userId: sessionUser?.id ?? null,
      useFlowerCircleBenefit: payload.useFlowerCircleBenefit === true,
    });
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    const code = error instanceof Error ? error.message : "order_creation_failed";
    const clientError = ["missing_fields", "empty_order", "invalid_product", "invalid_custom_composition"].includes(code);
    return NextResponse.json({ error: code }, { status: clientError ? 400 : 500 });
  }
}
