import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return (
      <input
        ref={ref}
        className={cn(
          "input w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-sm text-brand-950 shadow-sm transition-colors placeholder:text-ink/40 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20",
          className
        )}
        {...props}
      />
    );
  }
);
