"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ORDER_STATUSES, PAYMENT_STATUSES } from "@/lib/constants";

export function OrderStatusControls({
  orderId,
  status,
  paymentStatus,
}: {
  orderId: string;
  status: string;
  paymentStatus: string;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const update = async (data: { status?: string; paymentStatus?: string }) => {
    setSaving(true);
    setMsg("");
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || "Update failed");
      setMsg("Order updated.");
      router.refresh();
    } catch (e) {
      setMsg((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-brand-950">Order status</label>
        <div className="mt-2 flex flex-wrap gap-2">
          {ORDER_STATUSES.map((s) => (
            <button
              key={s.value}
              disabled={saving}
              onClick={() => update({ status: s.value })}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                status === s.value
                  ? "bg-brand-700 text-white"
                  : "bg-slate-100 text-ink/60 hover:bg-brand-50 hover:text-brand-700"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-brand-950">Payment status</label>
        <div className="mt-2 flex flex-wrap gap-2">
          {PAYMENT_STATUSES.map((p) => (
            <button
              key={p}
              disabled={saving}
              onClick={() => update({ paymentStatus: p })}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                paymentStatus === p
                  ? "bg-brand-700 text-white"
                  : "bg-slate-100 text-ink/60 hover:bg-brand-50 hover:text-brand-700"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {saving && <p className="text-xs text-ink/50">Saving...</p>}
      {msg && (
        <p className={`text-xs font-medium ${msg === "Order updated." ? "text-green-600" : "text-red-600"}`}>{msg}</p>
      )}
    </div>
  );
}
