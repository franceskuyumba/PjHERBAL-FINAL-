import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-ink/10 bg-white/60 px-6 py-16 text-center",
        className
      )}
    >
      {icon && (
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
          {icon}
        </div>
      )}
      <h3 className="font-display text-xl font-bold text-brand-950">{title}</h3>
      {description && <p className="mt-2 max-w-sm text-sm text-ink/55">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
