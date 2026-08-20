import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { isProductionAdmin } from "@/lib/production/auth";
import { listProductionAdminMedia, recordProductionAdminMedia } from "@/lib/production/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_FILE_BYTES = 8 * 1024 * 1024;
const MAX_FILES = 8;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

async function guard() {
  if (await isProductionAdmin()) return null;
  return NextResponse.json({ error: "unauthorized" }, { status: 401 });
}

function safeExtension(file: File) {
  const fromType = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  return fromType;
}

export async function GET() {
  const denied = await guard();
  if (denied) return denied;
  return NextResponse.json(
    { media: await listProductionAdminMedia() },
    { headers: { "Cache-Control": "private, no-store, max-age=0", "X-Admin-Media-Revision": "managed-media-registry-v1" } },
  );
}

export async function POST(request: Request) {
  const denied = await guard();
  if (denied) return denied;

  const formData = await request.formData().catch(() => null);
  if (!formData) return NextResponse.json({ error: "invalid_form_data" }, { status: 400 });
  const files = formData.getAll("files").filter((value): value is File => value instanceof File && value.size > 0);
  if (!files.length || files.length > MAX_FILES) return NextResponse.json({ error: "invalid_file_count" }, { status: 400 });
  if (files.some((file) => !ALLOWED_TYPES.has(file.type) || file.size > MAX_FILE_BYTES)) {
    return NextResponse.json({ error: "unsupported_file", maxBytes: MAX_FILE_BYTES }, { status: 400 });
  }

  const forgeUrl = process.env.BUILT_IN_FORGE_API_URL;
  const forgeKey = process.env.BUILT_IN_FORGE_API_KEY;
  if (!forgeUrl || !forgeKey) return NextResponse.json({ error: "storage_not_configured" }, { status: 500 });

  try {
    const uploaded = await Promise.all(files.map(async (file) => {
      const key = `admin-media/${new Date().toISOString().slice(0, 10)}/${randomUUID()}.${safeExtension(file)}`;
      const presign = new URL("v1/storage/presign/put", `${forgeUrl.replace(/\/+$/, "")}/`);
      presign.searchParams.set("path", key);
      const presignResponse = await fetch(presign, { headers: { Authorization: `Bearer ${forgeKey}` }, cache: "no-store" });
      const presignPayload = await presignResponse.json().catch(() => ({})) as { url?: string };
      if (!presignResponse.ok || !presignPayload.url) throw new Error("presign_failed");
      const uploadResponse = await fetch(presignPayload.url, { method: "PUT", headers: { "Content-Type": file.type }, body: await file.arrayBuffer() });
      if (!uploadResponse.ok) throw new Error("upload_failed");
      return recordProductionAdminMedia({ key, url: `/manus-storage/${key}`, mimeType: file.type });
    }));
    return NextResponse.json({ media: uploaded }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "upload_failed" }, { status: 502 });
  }
}
