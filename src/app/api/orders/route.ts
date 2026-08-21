import { NextResponse } from "next/server";
import { createProductionOrder } from "@/lib/production/orders";
import { getProductionSessionUser } from "@/lib/production/auth";

export const runtime = "nodejs";

/** Places an order from the checkout form. */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  try {
    const payload = body as { customer?: unknown; items?: unknown };
    const sessionUser = await getProductionSessionUser();
    const order = await createProductionOrder({
      customer: (payload.customer ?? {}) as never,
      items: Array.isArray(payload.items) ? payload.items.slice(0, 60) as never : [],
      userId: sessionUser?.id ?? null,
    });
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    const code = error instanceof Error ? error.message : "order_creation_failed";
    const clientError = ["missing_fields", "empty_order", "invalid_product", "invalid_custom_price"].includes(code);
    return NextResponse.json({ error: code }, { status: clientError ? 400 : 500 });
  }
}
