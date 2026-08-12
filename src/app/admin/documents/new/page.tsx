import { prisma } from "@/lib/prisma";
import { DocumentForm, type DocumentDraft } from "@/components/admin/DocumentForm";

export default async function NewDocumentPage({
  searchParams,
}: {
  searchParams: { order?: string };
}) {
  let initial: DocumentDraft | undefined;

  // Pre-fill a receipt from an existing web order (e.g. in-store re-issue).
  if (searchParams.order) {
    const order = await prisma.order.findUnique({
      where: { orderNumber: searchParams.order },
      include: { items: true },
    });
    if (order) {
      const items = order.items.map((i) => ({
        description: i.productName,
        quantity: i.quantity,
        unitPrice: i.price,
      }));
      if (order.shipping > 0) {
        items.push({ description: "Delivery fee", quantity: 1, unitPrice: order.shipping });
      }
      initial = {
        type: "RECEIPT",
        category: "EXTERNAL",
        title: `Order ${order.orderNumber}`,
        partyName: order.customerName,
        partyPhone: order.customerPhone,
        partyEmail: order.customerEmail,
        orderNumber: order.orderNumber,
        notes: order.notes ?? "",
        status: order.paymentStatus === "PAID" ? "PAID" : "ISSUED",
        issueDate: order.createdAt.toISOString(),
        dueDate: "",
        discount: order.discount,
        tax: 0,
        items,
      };
    }
  }

  return <DocumentForm initial={initial} />;
}
