"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  description = "We couldn't load this content. Please try again.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-3xl border border-red-100 bg-red-50/60 px-6 py-16 text-center",
        className
      )}
    >
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 text-red-600">
        <AlertTriangle className="h-8 w-8" />
      </div>
      <h3 className="font-display text-xl font-bold text-red-900">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-red-800/70">{description}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn-outline btn-sm mt-6"
        >
          <RotateCcw className="h-4 w-4" />
          Try again
        </button>
      )}
    </div>
  );
}
