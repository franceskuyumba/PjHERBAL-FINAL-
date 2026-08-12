"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { MapPin, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { TANZANIA_REGIONS } from "@/lib/constants";

export interface Address {
  id: string;
  label: string;
  recipientName: string;
  phone: string;
  region: string;
  district: string;
  street: string;
  isDefault: boolean;
}

const empty = { label: "", recipientName: "", phone: "", region: "", district: "", street: "" };

export function AddressesManager({ addresses }: { addresses: Address[] }) {
  const router = useRouter();
  const [items, setItems] = useState<Address[]>(addresses);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const refresh = () => router.refresh();

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);
    try {
      const isEdit = Boolean(editingId);
      const res = await fetch(isEdit ? `/api/account/addresses/${editingId}` : "/api/account/addresses", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Unable to save address.");
        return;
      }
      setForm(empty);
      setEditingId(null);
      refresh();
    } catch {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async (id: string) => {
    if (!confirm("Delete this address?")) return;
    await fetch(`/api/account/addresses/${id}`, { method: "DELETE" });
    refresh();
  };

  const onSetDefault = async (id: string) => {
    await fetch(`/api/account/addresses/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode: "default" }),
    });
    refresh();
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-brand-950">Saved addresses</h1>
      <p className="mt-1 text-sm text-ink/55">Manage your delivery addresses for faster checkout.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {items.map((addr) => (
          <div key={addr.id} className="relative rounded-3xl border border-ink/5 bg-white p-5 shadow-card">
            {addr.isDefault && (
              <span className="absolute right-4 top-4 rounded-full bg-brand-100 px-2.5 py-1 text-xs font-semibold text-brand-800">
                Default
              </span>
            )}
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-brand-700">
                <MapPin className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-semibold text-brand-950">{addr.label}</p>
                <p className="text-xs text-ink/50">{addr.recipientName} · {addr.phone}</p>
              </div>
            </div>
            <p className="mt-3 text-sm text-ink/65">
              {addr.street}, {addr.district}, {addr.region}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setEditingId(addr.id);
                  const { isDefault: _def, ...rest } = addr;
                  setForm(rest);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                Edit
              </Button>
              {!addr.isDefault && (
                <Button size="sm" variant="ghost" onClick={() => onSetDefault(addr.id)}>
                  Make default
                </Button>
              )}
              <Button size="sm" variant="ghost" className="text-red-600 hover:bg-red-50" onClick={() => onDelete(addr.id)}>
                <Trash2 className="mr-1 h-3.5 w-3.5" /> Delete
              </Button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="rounded-3xl border border-dashed border-ink/15 p-8 text-center sm:col-span-2">
            <MapPin className="mx-auto h-8 w-8 text-ink/30" />
            <p className="mt-3 text-sm font-semibold text-brand-950">No saved addresses</p>
            <p className="mt-1 text-xs text-ink/50">Add your first address below.</p>
          </div>
        )}
      </div>

      <div className="mt-8 rounded-3xl border border-ink/5 bg-white p-6 shadow-card">
        <h2 className="font-display text-lg font-bold text-brand-950">{editingId ? "Edit address" : "Add a new address"}</h2>
        {errorMsg && (
          <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errorMsg}</div>
        )}
        <form onSubmit={onSave} className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field label="Label">
            <Input placeholder="e.g. Home" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} />
          </Field>
          <Field label="Recipient name *">
            <Input
              required
              placeholder="Full name"
              value={form.recipientName}
              onChange={(e) => setForm({ ...form, recipientName: e.target.value })}
            />
          </Field>
          <Field label="Phone *">
            <Input
              required
              type="tel"
              placeholder="e.g. 0712 345 678"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </Field>
          <Field label="Region *">
            <select
              required
              value={form.region}
              onChange={(e) => setForm({ ...form, region: e.target.value })}
              className="input w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              <option value="">Select region</option>
              {TANZANIA_REGIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </Field>
          <Field label="District *">
            <Input required placeholder="e.g. Segerea" value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} />
          </Field>
          <Field label="Street / address *">
            <Input required placeholder="Street, house number / landmark" value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} />
          </Field>
          <div className="flex gap-3 sm:col-span-2">
            <Button type="submit" loading={loading}>
              {editingId ? "Save changes" : "Add address"}
            </Button>
            {editingId && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditingId(null);
                  setForm(empty);
                }}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
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
