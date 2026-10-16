import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { audit } from "@/lib/audit";
import { AuthorizationError, requirePermission } from "@/lib/auth/guards";
import { assetUrl } from "@/lib/links";
import { storeUpload, UploadError } from "@/lib/media";
import { clientIpFrom, isSameOrigin } from "@/lib/request";

const json = (body: unknown, status = 200) => NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function GET(request: Request) {
  try {
    await requirePermission("media.read");
  } catch (e) {
    return json({ error: (e as Error).message }, e instanceof AuthorizationError ? 403 : 500);
  }
  const url = new URL(request.url);
  const q = (url.searchParams.get("q") ?? "").trim().slice(0, 200);
  const type = url.searchParams.get("type");
  const take = Math.min(Number(url.searchParams.get("take") ?? 60) || 60, 200);
  const items = await db.media.findMany({
    where: {
      ...(q ? { OR: [{ path: { contains: q, mode: "insensitive" } }, { title: { contains: q, mode: "insensitive" } }, { alt: { contains: q, mode: "insensitive" } }] } : {}),
      ...(type === "visual" ? { OR: [{ mimeType: { startsWith: "image/" } }, { mimeType: { startsWith: "video/" } }] } : {}),
    },
    orderBy: [{ createdAt: "desc" }, { path: "asc" }],
    take,
  });
  return json({ items: items.map((m) => ({ id: m.id, path: m.path, url: assetUrl(m.path), originalName: m.originalName, mimeType: m.mimeType, size: m.size, alt: m.alt })) });
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return json({ error: "Invalid request origin." }, 403);
  let user;
  try {
    user = await requirePermission("media.upload");
  } catch (e) {
    return json({ error: (e as Error).message }, 403);
  }
  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return json({ error: "No file received." }, 400);
  try {
    const { media, reused } = await storeUpload(file, user.id);
    if (!reused) {
      await audit({ actorId: user.id, action: "media.upload", entityType: "media", entityId: media.id, summary: `Uploaded ${media.path}`, ip: clientIpFrom(request.headers) });
    }
    return json({ item: { id: media.id, path: media.path, url: assetUrl(media.path) }, reused });
  } catch (e) {
    if (e instanceof UploadError) return json({ error: e.message }, 422);
    console.error("[media upload]", e);
    return json({ error: "Upload failed." }, 500);
  }
}
