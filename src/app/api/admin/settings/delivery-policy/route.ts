import { NextResponse } from "next/server";
import { getProductionSessionUser, isProductionAdmin } from "@/lib/production/auth";
import { getDeliveryPolicyAudit, normalizeDeliveryPolicy, updateDeliveryPolicy } from "@/lib/production/storefrontSettings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "private, no-store" };

export async function GET() {
  if (!await isProductionAdmin()) return NextResponse.json({ error: "unauthorized" }, { status: 401, headers });
  return NextResponse.json(await getDeliveryPolicyAudit(), { headers });
}

export async function PATCH(request: Request) {
  const user = await getProductionSessionUser();
  if (!user || !await isProductionAdmin()) return NextResponse.json({ error: "unauthorized" }, { status: 401, headers });
  const body = await request.json().catch(() => null) as { policy?: unknown; revision?: unknown } | null;
  const policy = normalizeDeliveryPolicy(body?.policy);
  const revision = Number(body?.revision);
  if (!policy || !Number.isSafeInteger(revision) || revision < 0) return NextResponse.json({ error: "invalid_input" }, { status: 400, headers });
  const result = await updateDeliveryPolicy(policy, revision, user.id);
  if (result.conflict) return NextResponse.json({ error: "revision_conflict", revision: result.revision }, { status: 409, headers });
  return NextResponse.json(await getDeliveryPolicyAudit(), { headers });
}
