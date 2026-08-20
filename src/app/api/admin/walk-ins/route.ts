import { json, requireApiStaff, handleApiError, ApiError, requireSameOrigin } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    await requireApiStaff();
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim();
    const limit = Math.min(Number(searchParams.get("limit") || 200), 500);

    const where: { OR?: object[] } = {};
    if (q) {
      where.OR = [
        { name: { contains: q } },
        { phone: { contains: q } },
        { email: { contains: q } },
      ];
    }

    const customers = await prisma.walkInCustomer.findMany({
      where,
      orderBy: { visitedAt: "desc" },
      take: limit,
    });
    return json({ customers });
  } catch (e) {
    return handleApiError(e);
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireApiStaff();
    requireSameOrigin(request);
    const body = await request.json().catch(() => null);
    if (!body) throw new ApiError("Invalid request body");

    const name = String(body.name || "").trim();
    if (!name) throw new ApiError("Customer name is required");

    const customer = await prisma.walkInCustomer.create({
      data: {
        name,
        phone: body.phone ? String(body.phone).trim() : null,
        email: body.email ? String(body.email).trim() : null,
        source: body.source ? String(body.source) : "WALK_IN",
        interest: body.interest ? String(body.interest).trim() : null,
        notes: body.notes ? String(body.notes).trim() : null,
        visitedAt: body.visitedAt ? new Date(body.visitedAt) : new Date(),
      },
    });

    return json({ customer }, 201);
  } catch (e) {
    return handleApiError(e);
  }
}
