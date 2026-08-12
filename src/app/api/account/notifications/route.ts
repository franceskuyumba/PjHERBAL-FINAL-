import { NextRequest } from "next/server";
import { json, error, requireApiUser, handleApiError } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await requireApiUser();
    const limitParam = new URL(request.url).searchParams.get("limit");
    const limit = limitParam ? Math.min(Number(limitParam) || 50, 100) : 50;

    const [notifications, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where: { userId: session.sub },
        orderBy: { createdAt: "desc" },
        take: limit,
      }),
      prisma.notification.count({ where: { userId: session.sub, read: false } }),
    ]);

    return json({ notifications, unreadCount });
  } catch (e) {
    return handleApiError(e);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await requireApiUser();
    const body = await request.json().catch(() => null);

    if (body?.readAll) {
      await prisma.notification.updateMany({
        where: { userId: session.sub, read: false },
        data: { read: true },
      });
      return json({ ok: true });
    }

    const ids = Array.isArray(body?.ids) ? body.ids.filter((x: unknown): x is string => typeof x === "string") : [];
    if (ids.length === 0) return error("No notification ids provided.");

    await prisma.notification.updateMany({
      where: { id: { in: ids }, userId: session.sub },
      data: { read: true },
    });
    return json({ ok: true });
  } catch (e) {
    return handleApiError(e);
  }
}
