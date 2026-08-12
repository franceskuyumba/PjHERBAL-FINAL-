import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { DocumentForm, type DocumentDraft } from "@/components/admin/DocumentForm";

export default async function EditDocumentPage({ params }: { params: { id: string } }) {
  const document = await prisma.financeDocument.findUnique({
    where: { id: params.id },
    include: { items: { orderBy: { id: "asc" } } },
  });
  if (!document) notFound();

  const initial: DocumentDraft = {
    id: document.id,
    docNumber: document.docNumber,
    type: document.type,
    category: document.category,
    title: document.title ?? "",
    partyName: document.partyName,
    partyPhone: document.partyPhone ?? "",
    partyEmail: document.partyEmail ?? "",
    orderNumber: document.orderNumber ?? "",
    notes: document.notes ?? "",
    status: document.status,
    issueDate: document.issueDate.toISOString(),
    dueDate: document.dueDate ? document.dueDate.toISOString() : "",
    discount: document.discount,
    tax: document.tax,
    items: document.items.map((i) => ({
      description: i.description,
      quantity: i.quantity,
      unitPrice: i.unitPrice,
    })),
  };

  return <DocumentForm initial={initial} />;
}
