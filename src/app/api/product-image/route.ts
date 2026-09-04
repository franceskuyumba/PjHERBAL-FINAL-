import { get } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const rawUrl = request.nextUrl.searchParams.get("url");
  if (!rawUrl) return new NextResponse("Missing image URL", { status: 400 });

  let blobUrl: URL;
  try {
    blobUrl = new URL(rawUrl);
  } catch {
    return new NextResponse("Invalid image URL", { status: 400 });
  }

  if (!blobUrl.hostname.endsWith(".blob.vercel-storage.com")) {
    return new NextResponse("Invalid image host", { status: 400 });
  }

  const result = await get(blobUrl.toString(), { access: "private" });
  if (!result) return new NextResponse("Image not found", { status: 404 });

  return new NextResponse(result.stream, {
    headers: {
      "Content-Type": result.blob.contentType || "image/jpeg",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}