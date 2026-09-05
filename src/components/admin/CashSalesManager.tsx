"use client";

import { useEffect, useState } from "react";
import { Check, Plus, RefreshCw, Search, Trash2, X, Wallet } from "lucide-react";
import { formatTZS } from "@/lib/utils";
import { useI18n } from "@/context/LanguageContext";

interface CashSale {
  id: string;
  saleNumber: string;
  customerName: string;
  customerPhone: string | null;
  items: string;
  subtotal: number;
  discount: number;
  total: number;
  status: string;
  notes: string | null;
  createdAt: string;
}

interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  APPROVED: "bg-emerald-100 text-emerald-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export function CashSalesManager() {
  const { t } = useI18n();
  const [sales, setSales] = useState<CashSale[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [busy, setBusy] = useState(false);

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState("");
  const [lines, setLines] = useState<LineItem[]>([{ description: "", quantity: 1, unitPrice: 0 }]);

  const load = async (q = "") => {
    setLoading(true);
    const res = await fetch(`/api/admin/cash-sales${q ? `?q=${encodeURIComponent(q)}` : ""}`);
    const data = await res.json();
    setSales(data.sales || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const subtotal = lines.reduce((s, l) => s + (Number(l.unitPrice) || 0) * (Number(l.quantity) || 1), 0);
  const total = Math.max(0, subtotal - discount);

  const updateLine = (i: number, patch: Partial<LineItem>) => {
    setLines((prev) => prev.map((l, idx) => (idx === i ? { ...l, ...patch } : l)));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch("/api/admin/cash-sales", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName,
        customerPhone,
        discount,
        notes,
        items: lines.filter((l) => l.description.trim()),
      }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      setError(data.error || t("admin.cashSales.save"));
      return;
    }
    setShowForm(false);
    setCustomerName("");
    setCustomerPhone("");
    setDiscount(0);
    setNotes("");
    setLines([{ description: "", quantity: 1, unitPrice: 0 }]);
    load();
  };

  const patchStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/admin/cash-sales/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) load();
  };

  const remove = async (id: string) => {
    if (!confirm(t("admin.cashSales.deleteConfirm"))) return;
    const res = await fetch(`/api/admin/cash-sales/${id}`, { method: "DELETE" });
    if (res.ok) load();
  };

  const pendingCount = sales.filter((s) => s.status === "PENDING").length;
  const approvedTotal = sales.filter((s) => s.status === "APPROVED").reduce((s, x) => s + x.total, 0);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-brand-950">{t("admin.cashSales.title")}</h1>
          <p className="mt-1 text-sm text-ink/55">
            {t("admin.cashSales.summary").replace("{sales}", String(sales.length)).replace("{pending}", String(pendingCount)).replace("{approved}", formatTZS(approvedTotal))}
          </p>
        </div>
        <button onClick={() => setShowForm((v) => !v)} className="btn-primary">
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? t("admin.cashSales.close") : t("admin.cashSales.newSale")}
        </button>
      </div>

      {showForm && (
        <form onSubmit={submit} className="mt-6 rounded-3xl border border-ink/5 bg-white p-6 shadow-card">
          <h2 className="font-display text-lg font-bold text-brand-950">Record cash sale</h2>
          {error && <p className="mt-2 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <input
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Customer name *"
              className="input rounded-xl border border-ink/15 px-4 py-2.5 text-sm"
              required
            />
            <input
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="Customer phone (optional)"
              className="input rounded-xl border border-ink/15 px-4 py-2.5 text-sm"
            />
          </div>

          <div className="mt-4 space-y-2">
            {lines.map((line, i) => (
              <div key={i} className="flex flex-wrap items-center gap-2">
                <input
                  value={line.description}
                  onChange={(e) => updateLine(i, { description: e.target.value })}
                  placeholder="Item description"
                  className="input flex-1 min-w-[180px] rounded-xl border border-ink/15 px-3 py-2 text-sm"
                />
                <input
                  type="number"
                  min={1}
                  value={line.quantity}
                  onChange={(e) => updateLine(i, { quantity: Number(e.target.value) })}
                  className="input w-16 rounded-xl border border-ink/15 px-2 py-2 text-sm"
                />
                <input
                  type="number"
                  min={0}
                  value={line.unitPrice || ""}
                  onChange={(e) => updateLine(i, { unitPrice: Number(e.target.value) })}
                  placeholder="Price"
                  className="input w-32 rounded-xl border border-ink/15 px-3 py-2 text-sm"
                />
                <span className="w-20 text-right text-sm font-semibold text-ink/70">
                  {formatTZS((Number(line.unitPrice) || 0) * (Number(line.quantity) || 1))}
                </span>
                {lines.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setLines((p) => p.filter((_, idx) => idx !== i))}
                    className="text-ink/40 hover:text-red-600"
                    aria-label="Remove item"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => setLines((p) => [...p, { description: "", quantity: 1, unitPrice: 0 }])}
              className="inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:text-brand-800"
            >
              <Plus className="h-4 w-4" /> Add item
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-end gap-4">
            <label className="text-sm">
              <span className="text-ink/60">Discount (TZS)</span>
              <input
                type="number"
                min={0}
                value={discount || ""}
                onChange={(e) => setDiscount(Number(e.target.value))}
                className="input mt-1 w-32 rounded-xl border border-ink/15 px-3 py-2 text-sm"
              />
            </label>
            <div className="ml-auto text-right">
              <p className="text-sm text-ink/55">Subtotal: {formatTZS(subtotal)}</p>
              <p className="text-lg font-bold text-brand-950">Total: {formatTZS(total)}</p>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notes (optional)"
              className="input flex-1 rounded-xl border border-ink/15 px-3 py-2 text-sm"
            />
            <button type="submit" disabled={busy} className="btn-primary">
              {busy ? "Saving..." : "Save cash sale"}
            </button>
          </div>
        </form>
      )}

      <form
        className="mt-6 flex max-w-md gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          load(search);
        }}
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search sale, name or phone..."
            className="input w-full rounded-xl border border-ink/15 bg-white py-2.5 pl-10 pr-4 text-sm"
          />
        </div>
        <button className="btn-outline btn-sm" type="submit">
          Search
        </button>
        <button type="button" onClick={() => load()} className="btn-outline btn-sm" aria-label="Refresh">
          <RefreshCw className="h-4 w-4" />
        </button>
      </form>

      {loading ? (
        <p className="mt-6 text-sm text-ink/55">Loading...</p>
      ) : sales.length === 0 ? (
        <div className="mt-6 rounded-3xl border-2 border-dashed border-ink/10 p-12 text-center text-ink/55">
          No cash sales yet. Record your first sale at the counter.
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-3xl border border-ink/5 bg-white shadow-card">
          <div className="overflow-x-auto">
            <div className="w-full overflow-x-auto"><table className="w-full text-left text-sm">
              <thead className="border-b border-ink/5 bg-slate-50 text-xs uppercase tracking-wide text-ink/50">
                <tr>
                  <th className="px-5 py-3">Sale #</th>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Items</th>
                  <th className="px-5 py-3">Total</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5">
                {sales.map((s) => {
                  const items = JSON.parse(s.items || "[]") as LineItem[];
                  return (
                    <tr key={s.id} className="hover:bg-slate-50">
                      <td className="px-5 py-3 font-semibold text-brand-700">{s.saleNumber}</td>
                      <td className="px-5 py-3">
                        <p className="font-semibold text-brand-950">{s.customerName}</p>
                        {s.customerPhone && <p className="text-xs text-ink/55">{s.customerPhone}</p>}
                      </td>
                      <td className="px-5 py-3">
                        <p className="text-ink/70">
                          {items.length} item{items.length !== 1 ? "s" : ""}
                        </p>
                        <p className="text-xs text-ink/50">{items.map((i) => i.description).join(", ")}</p>
                      </td>
                      <td className="px-5 py-3 font-bold text-brand-950">{formatTZS(s.total)}</td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[s.status] || ""}`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-ink/60">{new Date(s.createdAt).toLocaleDateString()}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-1.5">
                          {s.status === "PENDING" && (
                            <>
                              <button
                                onClick={() => patchStatus(s.id, "APPROVED")}
                                className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                              >
                                <Check className="h-3.5 w-3.5" /> Approve
                              </button>
                              <button
                                onClick={() => patchStatus(s.id, "CANCELLED")}
                                className="inline-flex items-center gap-1 rounded-lg bg-ink/5 px-2.5 py-1.5 text-xs font-semibold text-ink/70 hover:bg-ink/10"
                              >
                                Cancel
                              </button>
                            </>
                          )}
                          {s.status === "PENDING" && (
                            <button
                              onClick={() => remove(s.id)}
                              className="text-ink/40 hover:text-red-600"
                              aria-label="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table></div>
          </div>
        </div>
      )}

      <div className="mt-6 flex items-center gap-2 rounded-2xl border border-gold-200 bg-gold-50 px-4 py-3 text-sm text-gold-800">
        <Wallet className="h-4 w-4" />
        Approved cash sales are automatically counted in the dashboard financial report.
      </div>
    </div>
  );
}
