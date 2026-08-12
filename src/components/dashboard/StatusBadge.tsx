import { cn } from "@/lib/utils";
import { ORDER_STATUSES } from "@/lib/constants";

const colorMap: Record<string, string> = {
  amber: "bg-amber-100 text-amber-800",
  blue: "bg-blue-100 text-blue-800",
  indigo: "bg-indigo-100 text-indigo-800",
  violet: "bg-violet-100 text-violet-800",
  green: "bg-green-100 text-green-800",
  red: "bg-red-100 text-red-800",
};

export function StatusBadge({ status }: { status: string }) {
  const def = ORDER_STATUSES.find((s) => s.value === status);
  const color = colorMap[def?.color || "blue"];
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold", color)}>
      {def?.label || status}
    </span>
  );
}

export function PaymentStatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    UNPAID: "bg-red-100 text-red-800",
    PAID: "bg-green-100 text-green-800",
    FAILED: "bg-red-100 text-red-800",
    REFUNDED: "bg-slate-100 text-slate-700",
  };
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold", map[status] || map.UNPAID)}>
      {status}
    </span>
  );
}
