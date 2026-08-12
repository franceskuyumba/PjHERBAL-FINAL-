import { NextRequest } from "next/server";
import { json, error, requireApiAdmin, handleApiError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { financeDocumentSchema } from "@/lib/validations";
import { zodParseSafe } from "@/lib/zod-helpers";
import { logActivity } from "@/lib/activity";
import { generateDocNumber } from "@/lib/utils";

const DOCUMENT_TYPES = ["RECEIPT", "INVOICE"];
const DOCUMENT_CATEGORIES = ["EXTERNAL", "INTERNAL"];
const DOCUMENT_STATUSES = ["DRAFT", "ISSUED", "PAID", "CANCELLED"];

function computeTotals(
  items: { quantity: number; unitPrice: number }[],
  discount: number,
  tax: number
) {
  const subtotal = items.reduce((sum, i) => sum + Math.round(i.quantity * i.unitPrice), 0);
  const total = Math.max(0, subtotal - discount + tax);
  return { subtotal, total };
}

export async function GET(request: NextRequest) {
  try {
    await requireApiAdmin();
    const search = request.nextUrl.searchParams.get("search") || "";
    const type = request.nextUrl.searchParams.get("type") || "";
    const category = request.nextUrl.searchParams.get("category") || "";
    const status = request.nextUrl.searchParams.get("status") || "";

    const documents = await prisma.financeDocument.findMany({
      where: {
        ...(type && DOCUMENT_TYPES.includes(type) ? { type } : {}),
        ...(category && DOCUMENT_CATEGORIES.includes(category) ? { category } : {}),
        ...(status && DOCUMENT_STATUSES.includes(status) ? { status } : {}),
        ...(search
          ? {
              OR: [
                { docNumber: { contains: search } },
                { partyName: { contains: search } },
                { title: { contains: search } },
                { orderNumber: { contains: search } },
              ],
            }
          : {}),
      },
      include: { _count: { select: { items: true } } },
      orderBy: { createdAt: "desc" },
      take: 200,
    });

    return json({ documents });
  } catch (e) {
    return handleApiError(e);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireApiAdmin();
    const body = await request.json().catch(() => null);
    for (const key of ["title", "partyPhone", "partyEmail", "orderNumber", "notes", "dueDate"]) {
      if (body?.[key] === "") body[key] = null;
    }
    const parsed = zodParseSafe(financeDocumentSchema, body || {});
    if (!parsed.ok) return error(parsed.message);

    const { items, discount, tax, status, ...rest } = parsed.data;
    const totals = computeTotals(items, discount, tax);
    const docNumber = generateDocNumber(parsed.data.type);

    const document = await prisma.financeDocument.create({
      data: {
        ...rest,
        docNumber,
        subtotal: totals.subtotal,
        total: totals.total,
        paidAt: status === "PAID" ? new Date() : null,
        createdBy: session.sub,
        items: { create: items.map((i) => ({ ...i, amount: Math.round(i.quantity * i.unitPrice) })) },
      },
      include: { items: true },
    });

    await logActivity({
      actorId: session.sub,
      actorName: session.name,
      role: session.role,
      action: "DOCUMENT_CREATE",
      entity: "FinanceDocument",
      entityId: document.id,
      details: `${document.docNumber} · ${document.type} · ${document.category} · ${document.partyName} · ${formatAmount(document.total)}`,
      ip: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
    });

    return json({ document }, 201);
  } catch (e) {
    return handleApiError(e);
  }
}

function formatAmount(amount: number): string {
  return `TZS ${Math.round(amount).toLocaleString("en-TZ")}`;
}
