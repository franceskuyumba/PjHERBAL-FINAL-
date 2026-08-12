"use client";

import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { key: "PENDING", label: "Order placed", desc: "We have received your order" },
  { key: "PAID", label: "Payment confirmed", desc: "Your payment has been received" },
  { key: "PROCESSING", label: "Processing", desc: "We are preparing your order" },
  { key: "DISPATCHED", label: "Dispatched", desc: "Your order is on its way" },
  { key: "DELIVERED", label: "Delivered", desc: "Enjoy your order!" },
];

function stepIndex(status: string): number {
  if (status === "CANCELLED") return -1;
  const idx = STEPS.findIndex((s) => s.key === status);
  return idx === -1 ? 0 : idx;
}

export function TrackingTimeline({ status }: { status: string }) {
  const current = stepIndex(status);
  const cancelled = status === "CANCELLED";

  if (cancelled) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
          <X className="h-6 w-6" />
        </span>
        <p className="mt-3 font-display text-lg font-bold text-red-800">Order cancelled</p>
        <p className="mt-1 text-sm text-red-600/80">
          This order was cancelled. If you believe this is a mistake, contact us on WhatsApp.
        </p>
      </div>
    );
  }

  return (
    <ol className="relative space-y-6">
      {STEPS.map((step, i) => {
        const done = i <= current;
        const isCurrent = i === current;
        return (
          <li key={step.key} className="relative flex gap-4">
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold transition-colors",
                  done ? "border-brand-600 bg-brand-600 text-white" : "border-ink/15 bg-white text-ink/30"
                )}
              >
                {done ? <Check className="h-4 w-4" /> : i + 1}
              </span>
              {i < STEPS.length - 1 && (
                <span className={cn("mt-1 w-0.5 flex-1", i < current ? "bg-brand-600" : "bg-ink/10")} style={{ minHeight: 24 }} />
              )}
            </div>
            <div className="pb-2">
              <p className={cn("text-sm font-semibold", done ? "text-brand-950" : "text-ink/40")}>{step.label}</p>
              <p className={cn("mt-0.5 text-xs", isCurrent ? "text-brand-700" : "text-ink/45")}>{step.desc}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
