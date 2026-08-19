import { NextResponse } from "next/server";
import { getProductionSessionUser } from "@/lib/production/auth";

export const runtime = "nodejs";

export async function GET() {
  const user = await getProductionSessionUser();
  if (!user) return NextResponse.json({ user: null });
  return NextResponse.json({
    user: {
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
}
