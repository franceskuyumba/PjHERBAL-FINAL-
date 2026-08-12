"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useI18n } from "@/context/LanguageContext";

interface Coupon {
  id: string;
  code: string;
  type: string;
  value: number;
  minOrder: number;
  maxDiscount: number | null;
  maxUses: number | null;
  usedCount: number;
  startsAt: string | null;
  expiresAt: string | null;
  isActive: boolean;
}

const emptyForm = {
  code: "",
  type: "PERCENTAGE",
  value: "",
  minOrder: "0",
  maxDiscount: "",
  maxUses: "",
  startsAt: "",
  expiresAt: "",
};

export function AdminCouponsManager() {
  const { t } = useI18n();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const res = await fetch("/api/admin/coupons");
    const data = await res.json();
    setCoupons(data.coupons || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSaving(true);
    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          value: form.value ? Number(form.value) : 0,
          minOrder: form.minOrder ? Number(form.minOrder) : 0,
          maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : null,
          maxUses: form.maxUses ? Number(form.maxUses) : null,
          startsAt: form.startsAt ? new Date(form.startsAt).toISOString() : null,
          expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t("admin2.coupons.createError"));
      setForm(emptyForm);
      load();
    } catch (err) {
      setErrorMsg((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const onToggle = async (c: Coupon) => {
    await fetch(`/api/admin/coupons/${c.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode: "toggle", isActive: !c.isActive }),
    });
    load();
  };

  const onDelete = async (c: Coupon) => {
    if (!confirm(t("admin2.coupons.deleteConfirm").replace("{code}", c.code))) return;
    await fetch(`/api/admin/coupons/${c.id}`, { method: "DELETE" });
    load();
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-brand-950">{t("admin2.coupons.title")}</h1>
      <p className="mt-1 text-sm text-ink/55">{t("admin2.coupons.subtitle")}</p>

      <div className="mt-5 grid gap-6 lg:grid-cols-[340px_1fr]">
        <form onSubmit={onCreate} className="rounded-3xl border border-ink/5 bg-white p-6 shadow-card">
          <h2 className="mb-4 font-display text-lg font-bold text-brand-950">{t("admin2.coupons.newCoupon")}</h2>
          {errorMsg && <div className="mb-3 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">{errorMsg}</div>}
          <div className="space-y-4">
            <Field label={t("admin2.coupons.codeLabel")}>
              <Input required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder={t("admin2.coupons.codePlaceholder")} />
            </Field>
            <Field label={t("admin2.coupons.typeLabel")}>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="input w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20">
                <option value="PERCENTAGE">{t("admin2.coupons.typePercentage")}</option>
                <option value="FIXED">{t("admin2.coupons.typeFixed")}</option>
              </select>
            </Field>
            <Field label={t("admin2.coupons.valueLabel")}>
              <Input required type="number" min={0} value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} />
            </Field>
            <Field label={t("admin2.coupons.minOrderLabel")}>
              <Input type="number" min={0} value={form.minOrder} onChange={(e) => setForm({ ...form, minOrder: e.target.value })} />
            </Field>
            <Field label={t("admin2.coupons.maxDiscountLabel")}>
              <Input type="number" min={0} value={form.maxDiscount} onChange={(e) => setForm({ ...form, maxDiscount: e.target.value })} placeholder={t("admin2.coupons.optionalPlaceholder")} />
            </Field>
            <Field label={t("admin2.coupons.maxUsesLabel")}>
              <Input type="number" min={1} value={form.maxUses} onChange={(e) => setForm({ ...form, maxUses: e.target.value })} placeholder={t("admin2.coupons.optionalPlaceholder")} />
            </Field>
            <Field label={t("admin2.coupons.startsLabel")}>
              <Input type="date" value={form.startsAt} onChange={(e) => setForm({ ...form, startsAt: e.target.value })} />
            </Field>
            <Field label={t("admin2.coupons.expiresLabel")}>
              <Input type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} />
            </Field>
            <Button type="submit" fullWidth loading={saving}>
              {t("admin2.coupons.createButton")}
            </Button>
          </div>
        </form>

        <div className="overflow-hidden rounded-3xl border border-ink/5 bg-white shadow-card">
          {loading ? (
            <p className="p-10 text-center text-sm text-ink/50">{t("admin2.coupons.loading")}</p>
          ) : coupons.length === 0 ? (
            <p className="p-10 text-center text-sm text-ink/50">{t("admin2.coupons.empty")}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-ink/10 bg-slate-50 text-xs uppercase tracking-wide text-ink/40">
                    <th className="px-5 py-3 font-semibold">{t("admin2.coupons.thCode")}</th>
                    <th className="px-5 py-3 font-semibold">{t("admin2.coupons.thValue")}</th>
                    <th className="px-5 py-3 font-semibold">{t("admin2.coupons.thMinOrder")}</th>
                    <th className="px-5 py-3 font-semibold">{t("admin2.coupons.thUsed")}</th>
                    <th className="px-5 py-3 font-semibold">{t("admin2.coupons.thStarts")}</th>
                    <th className="px-5 py-3 font-semibold">{t("admin2.coupons.thExpires")}</th>
                    <th className="px-5 py-3 font-semibold">{t("admin2.coupons.thActive")}</th>
                    <th className="px-5 py-3 text-right font-semibold">{t("admin2.coupons.thActions")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/5">
                  {coupons.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="px-5 py-3 font-mono font-semibold text-brand-950">{c.code}</td>
                      <td className="px-5 py-3 text-ink/70">
                        {c.type === "PERCENTAGE" ? `${c.value}%` : `TZS ${c.value.toLocaleString()}`}
                      </td>
                      <td className="px-5 py-3 text-ink/70">{c.minOrder ? `TZS ${c.minOrder.toLocaleString()}` : "—"}</td>
                      <td className="px-5 py-3 text-ink/70">{c.usedCount}{c.maxUses ? ` / ${c.maxUses}` : ""}</td>
                      <td className="px-5 py-3 text-ink/50">{c.startsAt ? new Date(c.startsAt).toLocaleDateString() : "—"}</td>
                      <td className="px-5 py-3 text-ink/50">{c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : "—"}</td>
                      <td className="px-5 py-3">
                        <button
                          onClick={() => onToggle(c)}
                          className={`relative h-6 w-11 rounded-full transition-colors ${c.isActive ? "bg-brand-600" : "bg-slate-200"}`}
                          aria-label={`Toggle ${c.code}`}
                        >
                          <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${c.isActive ? "left-[22px]" : "left-0.5"}`} />
                        </button>
                      </td>
                      <td className="px-5 py-3">
                        <button
                          onClick={() => onDelete(c)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-ink/50 hover:bg-red-50 hover:text-red-600"
                          aria-label="Delete coupon"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-brand-950">{label}</label>
      {children}
    </div>
  );
}
