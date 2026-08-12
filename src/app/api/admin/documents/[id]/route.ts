import { NextRequest } from "next/server";
import { json, error, requireApiAdmin, handleApiError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { financeDocumentSchema } from "@/lib/validations";
import { zodParseSafe } from "@/lib/zod-helpers";
import { logActivity } from "@/lib/activity";

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

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireApiAdmin();
    const document = await prisma.financeDocument.findUnique({
      where: { id: params.id },
      include: { items: { orderBy: { id: "asc" } } },
    });
    if (!document) return error("Document not found.", 404);
    return json({ document });
  } catch (e) {
    return handleApiError(e);
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await requireApiAdmin();
    const existing = await prisma.financeDocument.findUnique({ where: { id: params.id } });
    if (!existing) return error("Document not found.", 404);

    const body = await request.json().catch(() => null);

    if (body?.mode === "quick") {
      const status = String(body.status || "");
      if (!DOCUMENT_STATUSES.includes(status)) return error("Invalid status.");
      const now = new Date();
      const document = await prisma.financeDocument.update({
        where: { id: existing.id },
        data: { status, paidAt: status === "PAID" ? existing.paidAt || now : null },
      });
      await logActivity({
        actorId: session.sub,
        actorName: session.name,
        role: session.role,
        action: "DOCUMENT_UPDATE",
        entity: "FinanceDocument",
        entityId: document.id,
        details: `${document.docNumber} · status → ${status}${status === "PAID" ? " (marked paid)" : ""}`,
        ip: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
      });
      return json({ document });
    }

    for (const key of ["title", "partyPhone", "partyEmail", "orderNumber", "notes", "dueDate"]) {
      if (body?.[key] === "") body[key] = null;
    }
    const parsed = zodParseSafe(financeDocumentSchema, body || {});
    if (!parsed.ok) return error(parsed.message);

    const { items, discount, tax, status, ...rest } = parsed.data;
    const totals = computeTotals(items, discount, tax);
    const now = new Date();
    const wasPaid = existing.status === "PAID";
    const isPaid = status === "PAID";
    const paidAt = isPaid ? existing.paidAt || now : null;

    const document = await prisma.$transaction(async (tx) => {
      await tx.financeDocumentItem.deleteMany({ where: { documentId: existing.id } });
      return tx.financeDocument.update({
        where: { id: existing.id },
        data: {
          ...rest,
          subtotal: totals.subtotal,
          total: totals.total,
          paidAt,
          items: {
            create: items.map((i) => ({ ...i, amount: Math.round(i.quantity * i.unitPrice) })),
          },
        },
        include: { items: { orderBy: { id: "asc" } } },
      });
    });

    await logActivity({
      actorId: session.sub,
      actorName: session.name,
      role: session.role,
      action: "DOCUMENT_UPDATE",
      entity: "FinanceDocument",
      entityId: document.id,
      details: `${document.docNumber} · status ${wasPaid ? "PAID →" : ""} ${status}${wasPaid !== isPaid ? (isPaid ? " (marked paid)" : " (no longer paid)") : ""}`,
      ip: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
    });

    return json({ document });
  } catch (e) {
    return handleApiError(e);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await requireApiAdmin();
    const existing = await prisma.financeDocument.findUnique({ where: { id: params.id } });
    if (!existing) return error("Document not found.", 404);

    await prisma.financeDocument.delete({ where: { id: existing.id } });

    await logActivity({
      actorId: session.sub,
      actorName: session.name,
      role: session.role,
      action: "DOCUMENT_DELETE",
      entity: "FinanceDocument",
      entityId: existing.id,
      details: `${existing.docNumber} · ${existing.type} · ${existing.category} · ${existing.partyName}`,
      ip: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
    });

    return json({ ok: true });
  } catch (e) {
    return handleApiError(e);
  }
}
