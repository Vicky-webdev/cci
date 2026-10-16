import { db } from "@/lib/db";
import { storage } from "@/lib/storage";

/** Serves CMS uploads from the local storage driver. Only files registered in the media library are served. */
export async function GET(_req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const rel = (await params).path.map(decodeURIComponent).join("/");
  const media = await db.media.findUnique({ where: { path: `uploads/${rel}` } });
  if (!media || media.storage !== "LOCAL") return new Response("Not found", { status: 404 });
  try {
    const data = await storage.get(rel);
    return new Response(new Uint8Array(data), {
      headers: {
        "Content-Type": media.mimeType,
        "Content-Length": String(data.length),
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
        "Content-Disposition": `inline; filename="${media.originalName.replace(/["\\\r\n]/g, "")}"`,
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
