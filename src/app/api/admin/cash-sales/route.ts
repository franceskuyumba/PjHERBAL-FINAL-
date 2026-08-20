import { json, requireApiStaff, handleApiError, ApiError, requireSameOrigin } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { generateCashSaleNumber } from "@/lib/utils";

export async function GET(request: Request) {
  try {
    await requireApiStaff();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const q = searchParams.get("q")?.trim();
    const limit = Math.min(Number(searchParams.get("limit") || 100), 500);

    const where: { status?: string; OR?: object[] } = {};
    if (status && status !== "ALL") where.status = status;
    if (q) {
      where.OR = [
        { customerName: { contains: q } },
        { customerPhone: { contains: q } },
        { saleNumber: { contains: q } },
      ];
    }

    const sales = await prisma.cashSale.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    return json({ sales });
  } catch (e) {
    return handleApiError(e);
  }
}

interface ItemInput {
  description: string;
  quantity: number;
  unitPrice: number;
}

export async function POST(request: Request) {
  try {
    const session = await requireApiStaff();
    requireSameOrigin(request);
    const body = await request.json().catch(() => null);
    if (!body) throw new ApiError("Invalid request body");

    const customerName = String(body.customerName || "").trim();
    const customerPhone = body.customerPhone ? String(body.customerPhone).trim() : null;
    const notes = body.notes ? String(body.notes).trim() : null;
    const items: ItemInput[] = Array.isArray(body.items) ? body.items : [];
    const discount = Number(body.discount || 0);

    if (!customerName) throw new ApiError("Customer name is required");
    if (items.length === 0) throw new ApiError("Add at least one item");

    const cleaned: ItemInput[] = items
      .map((it) => ({
        description: String(it.description || "").trim(),
        quantity: Math.max(1, Math.floor(Number(it.quantity) || 1)),
        unitPrice: Math.max(0, Number(it.unitPrice) || 0),
      }))
      .filter((it) => it.description);

    const subtotal = cleaned.reduce((sum, it) => sum + it.unitPrice * it.quantity, 0);
    const total = Math.max(0, subtotal - Math.min(discount, subtotal));
    const payload = cleaned.map((it) => ({
      description: it.description,
      quantity: it.quantity,
      unitPrice: it.unitPrice,
      amount: it.unitPrice * it.quantity,
    }));

    const sale = await prisma.cashSale.create({
      data: {
        saleNumber: generateCashSaleNumber(),
        customerName,
        customerPhone,
        notes,
        items: JSON.stringify(payload),
        subtotal,
        discount,
        total,
        createdBy: session.sub,
      },
    });

    return json({ sale }, 201);
  } catch (e) {
    return handleApiError(e);
  }
}
