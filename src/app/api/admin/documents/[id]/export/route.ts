import { NextRequest } from "next/server";
import { error, requireApiAdmin, handleApiError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { toCsv, csvResponse } from "@/lib/csv";

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireApiAdmin();
    const document = await prisma.financeDocument.findUnique({
      where: { id: params.id },
      include: { items: { orderBy: { id: "asc" } } },
    });
    if (!document) return error("Document not found.", 404);

    const rows: (string | number)[][] = [
      ["Doc #", "Type", "Category", "Party name", "Description", "Quantity", "Unit price (TZS)", "Amount (TZS)", "Discount (TZS)", "Tax (TZS)", "Total (TZS)", "Status", "Issue date", "Due date"],
      ...document.items.map((i) => [
        document.docNumber,
        document.type,
        document.category,
        document.partyName,
        i.description,
        i.quantity,
        i.unitPrice,
        i.amount,
        document.discount,
        document.tax,
        document.total,
        document.status,
        document.issueDate.toISOString().slice(0, 10),
        document.dueDate ? document.dueDate.toISOString().slice(0, 10) : "",
      ]),
    ];

    const safeName = document.partyName.replace(/[^a-z0-9]+/gi, "-").slice(0, 30) || "document";
    return csvResponse(toCsv(rows), `pjherbal-${document.docNumber}-${safeName}.csv`);
  } catch (e) {
    return handleApiError(e);
  }
}
