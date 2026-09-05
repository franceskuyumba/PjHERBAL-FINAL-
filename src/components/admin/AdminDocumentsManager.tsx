"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  FileDown,
  FilePlus2,
  Pencil,
  Printer,
  Search,
  Trash2,
} from "lucide-react";
import { cn, formatDate, formatTZS } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";
import { useI18n } from "@/context/LanguageContext";

interface DocRow {
  id: string;
  docNumber: string;
  type: string;
  category: string;
  title: string | null;
  partyName: string;
  total: number;
  status: string;
  issueDate: string;
  paidAt: string | null;
  _count: { items: number };
}

type CategoryFilter = "ALL" | "EXTERNAL" | "INTERNAL";
type TypeFilter = "ALL" | "RECEIPT" | "INVOICE";

const statusStyles: Record<string, string> = {
  DRAFT: "bg-slate-100 text-slate-700",
  ISSUED: "bg-blue-50 text-blue-700",
  PAID: "bg-emerald-50 text-emerald-700",
  CANCELLED: "bg-red-50 text-red-700",
};

export function AdminDocumentsManager() {
  const { toast } = useToast();
  const { t } = useI18n();
  const [documents, setDocuments] = useState<DocRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("ALL");
  const [type, setType] = useState<TypeFilter>("ALL");
  const [busyId, setBusyId] = useState<string | null>(null);

  const params = useMemo(() => {
    const p = new URLSearchParams();
    if (search) p.set("search", search);
    if (category !== "ALL") p.set("category", category);
    if (type !== "ALL") p.set("type", type);
    return p.toString();
  }, [search, category, type]);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/documents?${params}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t("admin2.documents.loadError"));
      setDocuments(data.documents);
    } catch (e) {
      toast((e as Error).message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const markPaid = async (doc: DocRow) => {
    setBusyId(doc.id);
    try {
      const res = await fetch(`/api/admin/documents/${doc.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "quick", status: "PAID" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t("admin2.documents.updateError"));
      toast(t("admin2.documents.markPaid").replace("{docNumber}", doc.docNumber), "success");
      load();
    } catch (e) {
      toast((e as Error).message, "error");
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (doc: DocRow) => {
    if (!confirm(t("admin2.documents.deleteConfirm").replace("{docNumber}", doc.docNumber).replace("{partyName}", doc.partyName))) return;
    setBusyId(doc.id);
    try {
      const res = await fetch(`/api/admin/documents/${doc.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t("admin2.documents.deleteError"));
      toast(t("admin2.documents.deleted").replace("{docNumber}", doc.docNumber), "success");
      load();
    } catch (e) {
      toast((e as Error).message, "error");
    } finally {
      setBusyId(null);
    }
  };

  const totals = documents.reduce((sum, d) => sum + d.total, 0);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-brand-950">{t("admin2.documents.title")}</h1>
          <p className="mt-1 text-sm text-ink/55">
            {documents.length} {documents.length === 1 ? t("admin2.documents.docSingular") : t("admin2.documents.docPlural")} · {t("admin2.documents.totalLabel")}{" "}
            <span className="font-semibold text-brand-800">{formatTZS(totals)}</span>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <a
            href={`/api/admin/documents/export?${params}`}
            className="btn-outline btn-md"
          >
            <FileDown className="h-4 w-4" /> {t("admin2.documents.exportExcel")}
          </a>
          <Link href="/admin/documents/new" className="btn-primary btn-md">
            <FilePlus2 className="h-4 w-4" /> {t("admin2.documents.newDoc")}
          </Link>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("admin2.documents.searchPlaceholder")}
            className="input w-full rounded-xl border border-ink/15 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>
        <div className="flex rounded-xl border border-ink/15 bg-slate-50 p-1">
          {(
            [
              ["ALL", t("admin2.documents.filterAll")],
              ["EXTERNAL", t("admin2.documents.filterExternal")],
              ["INTERNAL", t("admin2.documents.filterInternal")],
            ] as [CategoryFilter, string][]
          ).map(([value, label]) => (
            <button
              key={value}
              onClick={() => setCategory(value)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors",
                category === value ? "bg-white text-brand-800 shadow" : "text-ink/60 hover:text-ink"
              )}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex rounded-xl border border-ink/15 bg-slate-50 p-1">
          {(
            [
              ["ALL", t("admin2.documents.typeAll")],
              ["RECEIPT", t("admin2.documents.typeReceipts")],
              ["INVOICE", t("admin2.documents.typeInvoices")],
            ] as [TypeFilter, string][]
          ).map(([value, label]) => (
            <button
              key={value}
              onClick={() => setType(value)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors",
                type === value ? "bg-white text-brand-800 shadow" : "text-ink/60 hover:text-ink"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-3xl border border-ink/5 bg-white shadow-card">
        {loading ? (
          <p className="p-10 text-center text-sm text-ink/50">{t("admin2.documents.loading")}</p>
        ) : documents.length === 0 ? (
          <p className="p-10 text-center text-sm text-ink/50">
            {t("admin2.documents.empty")}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <div className="w-full overflow-x-auto"><table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-ink/10 bg-slate-50 text-xs uppercase tracking-wide text-ink/40">
                  <th className="px-5 py-3 font-semibold">{t("admin2.documents.thDoc")}</th>
                  <th className="px-5 py-3 font-semibold">{t("admin2.documents.thType")}</th>
                  <th className="px-5 py-3 font-semibold">{t("admin2.documents.thCategory")}</th>
                  <th className="px-5 py-3 font-semibold">{t("admin2.documents.thParty")}</th>
                  <th className="px-5 py-3 font-semibold">{t("admin2.documents.thItems")}</th>
                  <th className="px-5 py-3 text-right font-semibold">{t("admin2.documents.thTotal")}</th>
                  <th className="px-5 py-3 font-semibold">{t("admin2.documents.thStatus")}</th>
                  <th className="px-5 py-3 font-semibold">{t("admin2.documents.thIssued")}</th>
                  <th className="px-5 py-3 text-right font-semibold">{t("admin2.documents.thActions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5">
                {documents.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50">
                    <td className="px-5 py-3 font-mono text-xs font-semibold text-brand-800">{d.docNumber}</td>
                    <td className="px-5 py-3">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-bold",
                          d.type === "RECEIPT" ? "bg-emerald-50 text-emerald-700" : "bg-indigo-50 text-indigo-700"
                        )}
                      >
                        {d.type}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-bold",
                          d.category === "EXTERNAL" ? "bg-sky-50 text-sky-700" : "bg-amber-50 text-amber-700"
                        )}
                      >
                        {d.category}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <p className="font-semibold text-brand-950">{d.partyName}</p>
                      {d.title && <p className="text-xs text-ink/50">{d.title}</p>}
                    </td>
                    <td className="px-5 py-3 text-ink/60">{d._count.items}</td>
                    <td className="px-5 py-3 text-right font-semibold text-brand-950">{formatTZS(d.total)}</td>
                    <td className="px-5 py-3">
                      <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-bold", statusStyles[d.status] || "bg-slate-100 text-slate-700")}>
                        {d.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-xs text-ink/60">{formatDate(d.issueDate)}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {d.status === "ISSUED" && (
                          <button
                            onClick={() => markPaid(d)}
                            disabled={busyId === d.id}
                            title={t("admin2.documents.titleMarkPaid")}
                            className="rounded-lg p-2 text-ink/50 transition-colors hover:bg-emerald-50 hover:text-emerald-700 disabled:opacity-40"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </button>
                        )}
                        <Link
                          href={`/admin/documents/${d.id}/print`}
                          title={t("admin2.documents.titleViewPrint")}
                          className="rounded-lg p-2 text-ink/50 transition-colors hover:bg-slate-100 hover:text-brand-800"
                        >
                          <Printer className="h-4 w-4" />
                        </Link>
                        <a
                          href={`/api/admin/documents/${d.id}/export`}
                          title={t("admin2.documents.titleDownload")}
                          className="rounded-lg p-2 text-ink/50 transition-colors hover:bg-slate-100 hover:text-brand-800"
                        >
                          <FileDown className="h-4 w-4" />
                        </a>
                        <Link
                          href={`/admin/documents/${d.id}/edit`}
                          title={t("admin2.documents.titleEdit")}
                          className="rounded-lg p-2 text-ink/50 transition-colors hover:bg-slate-100 hover:text-brand-800"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => remove(d)}
                          disabled={busyId === d.id}
                          title={t("admin2.documents.titleDelete")}
                          className="rounded-lg p-2 text-ink/50 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table></div>
          </div>
        )}
      </div>
    </div>
  );
}
