import { NextRequest } from "next/server";
import { json, requireApiAdmin, handleApiError } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    await requireApiAdmin();
    const search = request.nextUrl.searchParams.get("search") || "";
    const page = Math.max(1, Number(request.nextUrl.searchParams.get("page")) || 1);
    const pageSize = 50;

    const where = search
      ? {
          OR: [
            { actorName: { contains: search } },
            { action: { contains: search } },
            { details: { contains: search } },
            { entity: { contains: search } },
          ],
        }
      : undefined;

    const [logs, total] = await Promise.all([
      prisma.activityLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.activityLog.count({ where }),
    ]);

    return json({ logs, total, page, pageSize });
  } catch (e) {
    return handleApiError(e);
  }
}
