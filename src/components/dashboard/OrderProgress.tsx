import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = ["PENDING", "PAID", "PROCESSING", "DISPATCHED", "DELIVERED"] as const;

const LABELS: Record<string, string> = {
  PENDING: "Ordered",
  PAID: "Paid",
  PROCESSING: "Processing",
  DISPATCHED: "Dispatched",
  DELIVERED: "Delivered",
};

/** Compact horizontal order progress used on tracking + order lists. */
export function OrderProgress({ status }: { status: string }) {
  if (status === "CANCELLED") {
    return (
      <div className="flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
        <X className="h-4 w-4" /> Order cancelled
      </div>
    );
  }

  const current = STEPS.includes(status as (typeof STEPS)[number]) ? STEPS.indexOf(status as (typeof STEPS)[number]) : 0;

  return (
    <div className="flex items-center" role="img" aria-label={`Order progress: ${LABELS[STEPS[current]]}`}>
      {STEPS.map((step, i) => {
        const done = i <= current;
        const isCurrent = i === current;
        return (
          <div key={step} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <span
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full border-2 text-[11px] font-bold transition-colors",
                  done ? "border-brand-600 bg-brand-600 text-white" : "border-ink/15 bg-white text-ink/30"
                )}
              >
                {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </span>
              <span
                className={cn(
                  "hidden text-[11px] font-medium sm:block",
                  isCurrent ? "text-brand-700" : done ? "text-brand-950" : "text-ink/35"
                )}
              >
                {LABELS[step]}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <span className={cn("mx-1 h-0.5 flex-1 rounded-full sm:mx-1.5", i < current ? "bg-brand-600" : "bg-ink/10")} />
            )}
          </div>
        );
      })}
    </div>
  );
}
