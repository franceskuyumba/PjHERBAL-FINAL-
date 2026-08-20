"use client";

import { useEffect, useState } from "react";
import { Plus, RefreshCw, Search, Store, UserPlus, X } from "lucide-react";
import { useI18n } from "@/context/LanguageContext";

interface WalkInCustomer {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  source: string;
  interest: string | null;
  notes: string | null;
  visitedAt: string;
}

const SOURCES = ["WALK_IN", "PHONE", "REFERRAL", "SOCIAL"];
const SOURCE_LABELS: Record<string, string> = {
  WALK_IN: "Walk-in",
  PHONE: "Phone",
  REFERRAL: "Referral",
  SOCIAL: "Social media",
};

export function WalkInCustomersManager() {
  const { t } = useI18n();
  const [customers, setCustomers] = useState<WalkInCustomer[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [source, setSource] = useState("WALK_IN");
  const [interest, setInterest] = useState("");
  const [notes, setNotes] = useState("");

  const load = async (q = "") => {
    setLoading(true);
    const res = await fetch(`/api/admin/walk-ins${q ? `?q=${encodeURIComponent(q)}` : ""}`);
    const data = await res.json();
    setCustomers(data.customers || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch("/api/admin/walk-ins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, email, source, interest, notes }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      setError(data.error || t("admin.walkIns.save"));
      return;
    }
    setShowForm(false);
    setName("");
    setPhone("");
    setEmail("");
    setSource("WALK_IN");
    setInterest("");
    setNotes("");
    load();
  };

  const remove = async (id: string) => {
    if (!confirm(t("admin.walkIns.deleteConfirm"))) return;
    const res = await fetch(`/api/admin/walk-ins/${id}`, { method: "DELETE" });
    if (res.ok) load();
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-brand-950">{t("admin.walkIns.title")}</h1>
          <p className="mt-1 text-sm text-ink/55">{t("admin.walkIns.summary").replace("{count}", String(customers.length))}</p>
        </div>
        <button onClick={() => setShowForm((v) => !v)} className="btn-primary">
          {showForm ? <X className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
          {showForm ? t("admin.walkIns.close") : t("admin.walkIns.add")}
        </button>
      </div>

      {showForm && (
        <form onSubmit={submit} className="mt-6 rounded-3xl border border-ink/5 bg-white p-6 shadow-card">
          <h2 className="flex items-center gap-2 font-display text-lg font-bold text-brand-950">
            <Store className="h-5 w-5 text-brand-600" /> {t("admin.walkIns.record")}
          </h2>
          {error && <p className="mt-2 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("admin.walkIns.name")}
              className="input rounded-xl border border-ink/15 px-4 py-2.5 text-sm"
              required
            />
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t("admin.walkIns.phone")}
              className="input rounded-xl border border-ink/15 px-4 py-2.5 text-sm"
            />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("admin.walkIns.email")}
              className="input rounded-xl border border-ink/15 px-4 py-2.5 text-sm"
            />
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="input rounded-xl border border-ink/15 px-4 py-2.5 text-sm"
            >
              {SOURCES.map((s) => (
                <option key={s} value={s}>
                  {SOURCE_LABELS[s]}
                </option>
              ))}
            </select>
            <input
              value={interest}
              onChange={(e) => setInterest(e.target.value)}
              placeholder="Interested in (e.g. weight loss products)"
              className="input rounded-xl border border-ink/15 px-4 py-2.5 text-sm sm:col-span-2"
            />
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notes (optional)"
              rows={2}
              className="input rounded-xl border border-ink/15 px-4 py-2.5 text-sm sm:col-span-2"
            />
          </div>
          <div className="mt-4 flex justify-end">
            <button type="submit" disabled={busy} className="btn-primary">
              {busy ? "Saving..." : "Save customer"}
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
            placeholder="Search name, phone or email..."
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
      ) : customers.length === 0 ? (
        <div className="mt-6 rounded-3xl border-2 border-dashed border-ink/10 p-12 text-center text-ink/55">
          No walk-in customers recorded yet.
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-3xl border border-ink/5 bg-white shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-ink/5 bg-slate-50 text-xs uppercase tracking-wide text-ink/50">
                <tr>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Source</th>
                  <th className="px-5 py-3">Interest</th>
                  <th className="px-5 py-3">Visited</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="px-5 py-3">
                      <p className="font-semibold text-brand-950">{c.name}</p>
                      {(c.phone || c.email) && (
                        <p className="text-xs text-ink/55">{c.phone || c.email}</p>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <span className="inline-flex rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">
                        {SOURCE_LABELS[c.source] || c.source}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-ink/70">
                      {c.interest || <span className="text-ink/35">—</span>}
                    </td>
                    <td className="px-5 py-3 text-ink/60">{new Date(c.visitedAt).toLocaleDateString()}</td>
                    <td className="px-5 py-3 text-right">
                      <button onClick={() => remove(c.id)} className="text-ink/40 hover:text-red-600" aria-label="Delete">
                        <Plus className="h-4 w-4 rotate-45" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
