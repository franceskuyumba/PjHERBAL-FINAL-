"use client";

import { Star, StarHalf } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/context/LanguageContext";

interface RatingProps {
  value: number;
  count?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  className?: string;
}

const sizes = { sm: "h-3.5 w-3.5", md: "h-4 w-4", lg: "h-5 w-5" };

export function Rating({ value, count, size = "md", showValue = true, className }: RatingProps) {
  const { t } = useI18n();
  const stars = Array.from({ length: 5 }, (_, i) => i + 1);

  return (
    <div className={cn("flex items-center gap-1.5", className)} aria-label={t("ui.ratedOf").replace("{n}", value.toFixed(1))}>
      <div className="flex items-center gap-0.5">
        {stars.map((star) => {
          const full = value >= star;
          const half = !full && value >= star - 0.5;
          return (
            <span key={star} className="relative inline-flex">
              <Star className={cn(sizes[size], "text-ink/15")} fill="currentColor" />
              {(full || half) && (
                <span className="absolute inset-0 overflow-hidden" style={half ? { width: "50%" } : undefined}>
                  <Star className={cn(sizes[size], "text-gold-500")} fill="currentColor" />
                </span>
              )}
            </span>
          );
        })}
      </div>
      {showValue && (
        <span className="text-xs font-semibold text-ink/60">
          {value.toFixed(1)}
          {count !== undefined && count > 0 && <span className="font-normal text-ink/40"> ({count})</span>}
        </span>
      )}
    </div>
  );
}
