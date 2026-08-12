import { NextRequest } from "next/server";
import { requireApiAdmin, handleApiError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { toCsv, csvResponse } from "@/lib/csv";

const DOCUMENT_TYPES = ["RECEIPT", "INVOICE"];
const DOCUMENT_CATEGORIES = ["EXTERNAL", "INTERNAL"];
const DOCUMENT_STATUSES = ["DRAFT", "ISSUED", "PAID", "CANCELLED"];

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
      orderBy: { createdAt: "desc" },
      take: 200,
    });

    const rows: (string | number)[][] = [
      ["Doc #", "Type", "Category", "Party name", "Phone", "Email", "Title", "Linked order", "Subtotal (TZS)", "Discount (TZS)", "Tax (TZS)", "Total (TZS)", "Status", "Issue date", "Due date", "Paid date", "Notes"],
      ...documents.map((d) => [
        d.docNumber,
        d.type,
        d.category,
        d.partyName,
        d.partyPhone ?? "",
        d.partyEmail ?? "",
        d.title ?? "",
        d.orderNumber ?? "",
        d.subtotal,
        d.discount,
        d.tax,
        d.total,
        d.status,
        d.issueDate.toISOString().slice(0, 10),
        d.dueDate ? d.dueDate.toISOString().slice(0, 10) : "",
        d.paidAt ? d.paidAt.toISOString().slice(0, 10) : "",
        d.notes ?? "",
      ]),
    ];

    const date = new Date().toISOString().slice(0, 10);
    return csvResponse(toCsv(rows), `pjherbal-receipts-invoices-${date}.csv`);
  } catch (e) {
    return handleApiError(e);
  }
}
