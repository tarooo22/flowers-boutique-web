import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(_request: Request, context: { params: Promise<{ key: string[] }> }) {
  const key = (await context.params).key.filter(Boolean).join("/");
  if (!key) return new NextResponse("Missing storage key", { status: 400 });

  const forgeUrl = process.env.BUILT_IN_FORGE_API_URL;
  const forgeKey = process.env.BUILT_IN_FORGE_API_KEY;
  if (!forgeUrl || !forgeKey) return new NextResponse("Storage proxy not configured", { status: 500 });

  try {
    const presign = new URL("v1/storage/presign/get", `${forgeUrl.replace(/\/+$/, "")}/`);
    presign.searchParams.set("path", key);
    const response = await fetch(presign, { headers: { Authorization: `Bearer ${forgeKey}` }, cache: "no-store" });
    if (!response.ok) return new NextResponse("Storage backend error", { status: 502 });
    const result = await response.json() as { url?: string };
    if (!result.url) return new NextResponse("Empty signed URL from storage backend", { status: 502 });
    return NextResponse.redirect(result.url, { status: 307, headers: { "Cache-Control": "no-store" } });
  } catch {
    return new NextResponse("Storage proxy error", { status: 502 });
  }
}
