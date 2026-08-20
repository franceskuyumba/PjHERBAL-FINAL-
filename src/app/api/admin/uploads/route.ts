import { randomUUID } from "node:crypto";
import { mkdir, unlink } from "node:fs/promises";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { NextRequest } from "next/server";
import { json, error, requireApiAdmin, requireSameOrigin, handleApiError } from "@/lib/api";

export const runtime = "nodejs";

const allowedTypes: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

export async function POST(request: NextRequest) {
  try {
    await requireApiAdmin();
    requireSameOrigin(request);
    const formData = await request.formData();
    const files = formData.getAll("files").filter((value): value is File => value instanceof File);
    if (files.length === 0) return error("Select at least one image.");
    if (files.length > 8) return error("You can upload up to 8 images at a time.");

    const uploadDir = path.join(process.cwd(), "public", "uploads", "products");
    await mkdir(uploadDir, { recursive: true });
    const urls: string[] = [];

    for (const file of files) {
      const extension = allowedTypes[file.type];
      if (!extension) return error("Only JPG, PNG, WebP, and AVIF images are allowed.");
      if (file.size > 5 * 1024 * 1024) return error("Each image must be 5MB or smaller.");
      const filename = `${randomUUID()}.${extension}`;
      await writeFile(path.join(uploadDir, filename), Buffer.from(await file.arrayBuffer()));
      urls.push(`/uploads/products/${filename}`);
    }

    return json({ urls }, 201);
  } catch (e) {
    return handleApiError(e);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireApiAdmin();
    requireSameOrigin(request);
    const body = await request.json().catch(() => null);
    const url = String(body?.url || "");
    if (!url.startsWith("/uploads/")) return error("Only uploaded files can be deleted.", 400);
    const uploadRoot = path.resolve(process.cwd(), "public", "uploads");
    const filePath = path.resolve(process.cwd(), "public", url.replace(/^\//, ""));
    if (!filePath.startsWith(`${uploadRoot}${path.sep}`)) return error("Invalid upload path.", 400);
    await unlink(filePath).catch(() => undefined);
    return json({ ok: true });
  } catch (e) {
    return handleApiError(e);
  }
}
