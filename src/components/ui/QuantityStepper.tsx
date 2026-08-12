"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

export function QuantityStepper({ value, onChange, min = 1, max = 99, className }: QuantityStepperProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-ink/10 bg-white p-1",
        className
      )}
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="flex h-8 w-8 items-center justify-center rounded-full text-ink/60 transition-colors hover:bg-brand-50 hover:text-brand-700 disabled:opacity-30"
        aria-label="Decrease quantity"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="w-8 text-center text-sm font-bold text-ink">{value}</span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="flex h-8 w-8 items-center justify-center rounded-full text-ink/60 transition-colors hover:bg-brand-50 hover:text-brand-700 disabled:opacity-30"
        aria-label="Increase quantity"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
