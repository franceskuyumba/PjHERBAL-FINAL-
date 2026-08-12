"use client";

import { useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Save, Trash2 } from "lucide-react";
import { cn, formatTZS } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";
import { useI18n } from "@/context/LanguageContext";

export interface DocumentItemDraft {
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface DocumentDraft {
  id?: string;
  docNumber?: string;
  type: string;
  category: string;
  title: string;
  partyName: string;
  partyPhone: string;
  partyEmail: string;
  orderNumber: string;
  notes: string;
  status: string;
  issueDate: string;
  dueDate: string;
  discount: number;
  tax: number;
  items: DocumentItemDraft[];
}

function toDateInput(value?: string): string {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function Label({ children }: { children: ReactNode }) {
  return (
    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink/50">
      {children}
    </label>
  );
}

function Segmented<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <div className="flex rounded-xl border border-ink/15 bg-slate-50 p-1">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={cn(
            "flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition-colors",
            value === o.value ? "bg-brand-600 text-white shadow" : "text-ink/60 hover:text-ink"
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function DocumentForm({ initial }: { initial?: DocumentDraft | null }) {
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useI18n();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<DocumentDraft>(
    initial ?? {
      type: "RECEIPT",
      category: "EXTERNAL",
      title: "",
      partyName: "",
      partyPhone: "",
      partyEmail: "",
      orderNumber: "",
      notes: "",
      status: "ISSUED",
      issueDate: toDateInput(new Date().toISOString()),
      dueDate: "",
      discount: 0,
      tax: 0,
      items: [{ description: "", quantity: 1, unitPrice: 0 }],
    }
  );

  const set = <K extends keyof DocumentDraft>(key: K, value: DocumentDraft[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const updateItem = (index: number, patch: Partial<DocumentItemDraft>) =>
    setForm((f) => ({
      ...f,
      items: f.items.map((it, i) => (i === index ? { ...it, ...patch } : it)),
    }));

  const addItem = () =>
    setForm((f) => ({ ...f, items: [...f.items, { description: "", quantity: 1, unitPrice: 0 }] }));

  const removeItem = (index: number) =>
    setForm((f) => ({ ...f, items: f.items.filter((_, i) => i !== index) }));

  const totals = useMemo(() => {
    const subtotal = form.items.reduce(
      (sum, it) => sum + (Number(it.quantity) || 0) * (Number(it.unitPrice) || 0),
      0
    );
    return { subtotal, total: Math.max(0, subtotal - form.discount + form.tax) };
  }, [form.items, form.discount, form.tax]);

  const save = async () => {
    setSaving(true);
    try {
      const url = form.id ? `/api/admin/documents/${form.id}` : "/api/admin/documents";
      const res = await fetch(url, {
        method: form.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t("admin2.documentForm.saveError"));
      toast(form.id ? t("admin2.documentForm.updatedToast") : t("admin2.documentForm.createdToast"), "success");
      router.push("/admin/documents");
      router.refresh();
    } catch (e) {
      toast((e as Error).message, "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/admin/documents" className="mb-2 inline-flex items-center gap-1.5 text-sm font-medium text-brand-700 hover:text-brand-800">
            <ArrowLeft className="h-4 w-4" /> {t("admin2.documentForm.backTo")}
          </Link>
          <h1 className="font-display text-2xl font-bold text-brand-950">
            {form.id ? t("admin2.documentForm.editTitle").replace("{docNumber}", form.docNumber || "") : t("admin2.documentForm.newDoc")}
          </h1>
          <p className="mt-1 text-sm text-ink/55">
            {t("admin2.documentForm.subtitle")}
          </p>
        </div>
        <button onClick={save} disabled={saving} className="btn-primary btn-md disabled:opacity-60">
          <Save className="h-4 w-4" /> {saving ? t("admin2.documentForm.saving") : form.id ? t("admin2.documentForm.saveChanges") : t("admin2.documentForm.createDoc")}
        </button>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-3xl border border-ink/5 bg-white p-5 shadow-card sm:p-6">
            <h2 className="font-display text-base font-bold text-brand-950">{t("admin2.documentForm.docType")}</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <Label>{t("admin2.documentForm.typeLabel")}</Label>
                <Segmented
                  value={form.type}
                  onChange={(v) => set("type", v)}
                  options={[
                    { value: "RECEIPT", label: t("admin2.documentForm.receipt") },
                    { value: "INVOICE", label: t("admin2.documentForm.invoice") },
                  ]}
                />
              </div>
              <div>
                <Label>{t("admin2.documentForm.categoryLabel")}</Label>
                <Segmented
                  value={form.category}
                  onChange={(v) => set("category", v)}
                  options={[
                    { value: "EXTERNAL", label: t("admin2.documentForm.external") },
                    { value: "INTERNAL", label: t("admin2.documentForm.internal") },
                  ]}
                />
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-ink/5 bg-white p-5 shadow-card sm:p-6">
            <h2 className="font-display text-base font-bold text-brand-950">
              {form.category === "EXTERNAL" ? t("admin2.documentForm.customerBillTo") : t("admin2.documentForm.supplierBillFrom")}
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label>{t("admin2.documentForm.partyNameLabel")}</Label>
                <input
                  value={form.partyName}
                  onChange={(e) => set("partyName", e.target.value)}
                  placeholder={form.category === "EXTERNAL" ? t("admin2.documentForm.partyNamePlaceholderExternal") : t("admin2.documentForm.partyNamePlaceholderInternal")}
                  className="input w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>
              <div>
                <Label>{t("admin2.documentForm.phoneLabel")}</Label>
                <input
                  value={form.partyPhone}
                  onChange={(e) => set("partyPhone", e.target.value)}
                  placeholder="e.g. +255 7XX XXX XXX"
                  className="input w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>
              <div>
                <Label>{t("admin2.documentForm.emailLabel")}</Label>
                <input
                  value={form.partyEmail}
                  onChange={(e) => set("partyEmail", e.target.value)}
                  placeholder="name@example.com"
                  className="input w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>
              <div>
                <Label>{t("admin2.documentForm.titleLabel")}</Label>
                <input
                  value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                  placeholder={form.category === "EXTERNAL" ? t("admin2.documentForm.titlePlaceholderExternal") : t("admin2.documentForm.titlePlaceholderInternal")}
                  className="input w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>
              {form.category === "EXTERNAL" && (
                <div>
                  <Label>{t("admin2.documentForm.orderLabel")}</Label>
                  <input
                    value={form.orderNumber}
                    onChange={(e) => set("orderNumber", e.target.value)}
                    placeholder="e.g. PJH-20260811-123456"
                    className="input w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>
              )}
            </div>
          </section>

          <section className="rounded-3xl border border-ink/5 bg-white p-5 shadow-card sm:p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-base font-bold text-brand-950">{t("admin2.documentForm.lineItems")}</h2>
              <button type="button" onClick={addItem} className="btn-outline btn-sm">
                <Plus className="h-4 w-4" /> {t("admin2.documentForm.addLine")}
              </button>
            </div>
            <div className="mt-4 space-y-3">
              {form.items.map((item, i) => (
                <div key={i} className="grid grid-cols-12 gap-2 items-center">
                  <input
                    value={item.description}
                    onChange={(e) => updateItem(i, { description: e.target.value })}
                    placeholder={t("admin2.documentForm.descriptionPlaceholder")}
                    className="input col-span-12 rounded-xl border border-ink/15 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 sm:col-span-5"
                  />
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) => updateItem(i, { quantity: Number(e.target.value) })}
                    className="input col-span-4 rounded-xl border border-ink/15 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 sm:col-span-2"
                    title={t("admin2.documentForm.qtyTitle")}
                  />
                  <input
                    type="number"
                    min={0}
                    value={item.unitPrice}
                    onChange={(e) => updateItem(i, { unitPrice: Number(e.target.value) })}
                    className="input col-span-4 rounded-xl border border-ink/15 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 sm:col-span-3"
                    title={t("admin2.documentForm.unitPriceTitle")}
                  />
                  <div className="col-span-3 text-right text-sm font-semibold text-brand-950 sm:col-span-1">
                    {formatTZS((Number(item.quantity) || 0) * (Number(item.unitPrice) || 0))}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(i)}
                    disabled={form.items.length === 1}
                    className="col-span-1 flex justify-end text-ink/40 transition-colors hover:text-red-600 disabled:opacity-30"
                    aria-label="Remove line"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-ink/5 bg-white p-5 shadow-card sm:p-6">
            <h2 className="font-display text-base font-bold text-brand-950">{t("admin2.documentForm.notesTitle")}</h2>
            <textarea
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              rows={3}
              placeholder={t("admin2.documentForm.notesPlaceholder")}
              className="input mt-3 w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-3xl border border-ink/5 bg-white p-5 shadow-card">
            <h2 className="font-display text-base font-bold text-brand-950">{t("admin2.documentForm.detailsTitle")}</h2>
            <div className="mt-4 space-y-4">
              <div>
                <Label>{t("admin2.documentForm.statusLabel")}</Label>
                <select
                  value={form.status}
                  onChange={(e) => set("status", e.target.value)}
                  className="w-full rounded-xl border border-ink/15 bg-white px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
                >
                  {[
                    { value: "DRAFT", label: t("admin2.documentForm.statusDraft") },
                    { value: "ISSUED", label: t("admin2.documentForm.statusIssued") },
                    { value: "PAID", label: t("admin2.documentForm.statusPaid") },
                    { value: "CANCELLED", label: t("admin2.documentForm.statusCancelled") },
                  ].map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label>{t("admin2.documentForm.issueDateLabel")}</Label>
                <input
                  type="date"
                  value={form.issueDate}
                  onChange={(e) => set("issueDate", e.target.value)}
                  className="w-full rounded-xl border border-ink/15 bg-white px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
                />
              </div>
              {form.type === "INVOICE" && (
                <div>
                  <Label>{t("admin2.documentForm.dueDateLabel")}</Label>
                  <input
                    type="date"
                    value={form.dueDate}
                    onChange={(e) => set("dueDate", e.target.value)}
                    className="w-full rounded-xl border border-ink/15 bg-white px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
                  />
                </div>
              )}
              <div>
                <Label>{t("admin2.documentForm.discountLabel")}</Label>
                <input
                  type="number"
                  min={0}
                  value={form.discount}
                  onChange={(e) => set("discount", Number(e.target.value))}
                  className="w-full rounded-xl border border-ink/15 bg-white px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
                />
              </div>
              <div>
                <Label>{t("admin2.documentForm.taxLabel")}</Label>
                <input
                  type="number"
                  min={0}
                  value={form.tax}
                  onChange={(e) => set("tax", Number(e.target.value))}
                  className="w-full rounded-xl border border-ink/15 bg-white px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
                />
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-ink/5 bg-white p-5 shadow-card">
            <h2 className="font-display text-base font-bold text-brand-950">{t("admin2.documentForm.summaryTitle")}</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink/55">{t("admin2.documentForm.subtotal")}</dt>
                <dd className="font-semibold">{formatTZS(totals.subtotal)}</dd>
              </div>
              {form.discount > 0 && (
                <div className="flex justify-between text-brand-600">
                  <dt>{t("admin2.documentForm.discount")}</dt>
                  <dd className="font-semibold">−{formatTZS(form.discount)}</dd>
                </div>
              )}
              {form.tax > 0 && (
                <div className="flex justify-between">
                  <dt className="text-ink/55">{t("admin2.documentForm.tax")}</dt>
                  <dd className="font-semibold">{formatTZS(form.tax)}</dd>
                </div>
              )}
              <div className="flex justify-between border-t border-ink/10 pt-3">
                <dt className="font-bold text-brand-950">{t("admin2.documentForm.total")}</dt>
                <dd className="font-display text-lg font-bold text-brand-800">{formatTZS(totals.total)}</dd>
              </div>
            </dl>
          </section>
        </div>
      </div>
    </div>
  );
}
