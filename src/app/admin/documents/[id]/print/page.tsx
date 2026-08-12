import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { FileDown } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatTZS, formatDate } from "@/lib/utils";
import { SITE } from "@/lib/constants";
import { PrintButton } from "@/components/order/PrintButton";
import { getLocale, t } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Receipt / Invoice",
  robots: { index: false, follow: false },
};

const statusBadge: Record<string, string> = {
  DRAFT: "bg-slate-100 text-slate-700",
  ISSUED: "bg-blue-50 text-blue-700",
  PAID: "bg-emerald-50 text-emerald-700",
  CANCELLED: "bg-red-50 text-red-700",
};

export default async function DocumentPrintPage({ params }: { params: { id: string } }) {
  const lang = getLocale();
  const document = await prisma.financeDocument.findUnique({
    where: { id: params.id },
    include: { items: { orderBy: { id: "asc" } } },
  });
  if (!document) notFound();

  const isReceipt = document.type === "RECEIPT";
  const isExternal = document.category === "EXTERNAL";

  return (
    <div className="container-site py-8">
      <style>{`
        @media print {
          header, footer, .mobile-bottom-nav, .no-print { display: none !important; }
          body { padding: 0 !important; }
          main { padding: 0 !important; }
          .invoice-sheet { box-shadow: none !important; border: none !important; margin: 0 !important; }
        }
        @page { margin: 18mm; }
      `}</style>

      <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link href="/admin/documents" className="btn-outline btn-sm">
          {t(lang, "admin2.print.backTo")}
        </Link>
        <div className="flex items-center gap-2">
          <a
            href={`/api/admin/documents/${document.id}/export`}
            className="btn-outline btn-sm"
          >
            <FileDown className="h-4 w-4" /> {t(lang, "admin2.print.downloadItems")}
          </a>
          <PrintButton />
        </div>
      </div>

      <div className="invoice-sheet mx-auto max-w-3xl rounded-3xl border border-ink/5 bg-white p-8 shadow-card sm:p-12">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <Image src="/images/logo.svg" alt={SITE.name} width={160} height={40} className="h-10 w-auto" />
            <h1 className="mt-4 font-display text-2xl font-bold text-brand-950">{SITE.fullName}</h1>
            <p className="mt-1 text-sm text-ink/60">{SITE.address}</p>
            <p className="text-sm text-ink/60">{SITE.phone} · {SITE.email}</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold uppercase tracking-widest text-ink/40">
              {isReceipt
                ? isExternal
                  ? t(lang, "admin2.print.officialReceipt")
                  : t(lang, "admin2.print.paymentReceipt")
                : t(lang, "admin2.print.invoice")}
              {!isExternal && t(lang, "admin2.print.internalExpense")}
            </p>
            <p className="mt-2 font-mono text-lg font-bold text-brand-950">{document.docNumber}</p>
            <p className="mt-1 text-sm text-ink/55">{t(lang, "admin2.print.issued").replace("{date}", formatDate(document.issueDate))}</p>
            {document.dueDate && (
              <p className="mt-1 text-sm text-ink/55">{t(lang, "admin2.print.due").replace("{date}", formatDate(document.dueDate))}</p>
            )}
            <p className="mt-1 text-sm">
              <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${statusBadge[document.status] || "bg-slate-100 text-slate-700"}`}>
                {document.status}
              </span>
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-8 sm:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-ink/40">
              {isExternal ? t(lang, "admin2.print.billTo") : t(lang, "admin2.print.billFrom")}
            </p>
            <p className="mt-2 font-semibold text-brand-950">{document.partyName}</p>
            {document.title && <p className="text-sm text-ink/60">{document.title}</p>}
            {document.partyPhone && <p className="text-sm text-ink/60">{document.partyPhone}</p>}
            {document.partyEmail && <p className="text-sm text-ink/60">{document.partyEmail}</p>}
            {document.orderNumber && (
              <p className="mt-2 text-xs text-ink/50">{t(lang, "admin2.print.orderLabel")} {document.orderNumber}</p>
            )}
          </div>
          <div className="sm:text-right">
            <p className="text-xs font-bold uppercase tracking-widest text-ink/40">
              {isReceipt ? (isExternal ? t(lang, "admin2.print.paymentLabel") : t(lang, "admin2.print.expenseLabel")) : t(lang, "admin2.print.referenceLabel")}
            </p>
            <p className="mt-2 text-sm font-semibold text-brand-950">
              {isReceipt && isExternal ? t(lang, "admin2.print.paymentReceived") : isReceipt ? t(lang, "admin2.print.paymentMade") : t(lang, "admin2.print.amountDue")}
            </p>
            <p className="mt-3 font-mono text-lg font-bold text-brand-800">{formatTZS(document.total)}</p>
          </div>
        </div>

        <table className="mt-8 w-full text-left text-sm">
          <thead>
            <tr className="border-b-2 border-ink/10 text-xs uppercase tracking-wide text-ink/40">
              <th className="pb-3 pr-4 font-semibold">{t(lang, "admin2.print.thItem")}</th>
              <th className="pb-3 pr-4 text-right font-semibold">{t(lang, "admin2.print.thQty")}</th>
              <th className="pb-3 pr-4 text-right font-semibold">{t(lang, "admin2.print.thPrice")}</th>
              <th className="pb-3 text-right font-semibold">{t(lang, "admin2.print.thAmount")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/5">
            {document.items.map((item) => (
              <tr key={item.id}>
                <td className="py-3 pr-4 font-medium text-brand-950">{item.description}</td>
                <td className="py-3 pr-4 text-right text-ink/70">{item.quantity}</td>
                <td className="py-3 pr-4 text-right text-ink/70">{formatTZS(item.unitPrice)}</td>
                <td className="py-3 text-right font-semibold text-brand-950">{formatTZS(item.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-6 flex justify-end">
          <dl className="w-full max-w-xs space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink/55">{t(lang, "admin2.print.subtotal")}</dt>
              <dd className="font-semibold">{formatTZS(document.subtotal)}</dd>
            </div>
            {document.discount > 0 && (
              <div className="flex justify-between text-brand-600">
                <dt>{t(lang, "admin2.print.discount")}</dt>
                <dd className="font-semibold">−{formatTZS(document.discount)}</dd>
              </div>
            )}
            {document.tax > 0 && (
              <div className="flex justify-between">
                <dt className="text-ink/55">{t(lang, "admin2.print.tax")}</dt>
                <dd className="font-semibold">{formatTZS(document.tax)}</dd>
              </div>
            )}
            <div className="flex justify-between border-t border-ink/10 pt-3">
              <dt className="font-bold text-brand-950">{t(lang, "admin2.print.total")}</dt>
              <dd className="font-display text-xl font-bold text-brand-800">{formatTZS(document.total)}</dd>
            </div>
          </dl>
        </div>

        {document.notes && (
          <div className="mt-8 rounded-2xl border border-ink/10 bg-slate-50 p-4 text-sm text-ink/70">
            {document.notes}
          </div>
        )}

        <p className="mt-8 border-t border-ink/10 pt-4 text-center text-xs text-ink/40">
          {SITE.name} · {SITE.address} · {SITE.phone} · {t(lang, "admin2.print.footerThanks")}
        </p>
      </div>
    </div>
  );
}
