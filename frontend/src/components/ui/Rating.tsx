import { Star, StarHalf } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingProps {
  value: number;
  count?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  className?: string;
}

const sizes = { sm: "h-3.5 w-3.5", md: "h-4 w-4", lg: "h-5 w-5" };

export default function Rating({
  value,
  count,
  size = "sm",
  showValue,
  className,
}: RatingProps) {
  const full = Math.floor(value);
  const half = value - full >= 0.25 && value - full < 0.75;
  const hasHalf = value - full >= 0.75;

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i < full || (i === full && hasHalf);
          const isHalf = i === full && half;
          return isHalf ? (
            <span key={i} className="relative inline-flex">
              <Star className={cn(sizes[size], "text-brand-200 fill-brand-200")} />
              <StarHalf
                className={cn(sizes[size], "text-gold-500 fill-gold-500 absolute inset-0")}
              />
            </span>
          ) : (
            <Star
              key={i}
              className={cn(
                sizes[size],
                filled ? "text-gold-500 fill-gold-500" : "text-brand-200 fill-brand-100"
              )}
            />
          );
        })}
      </div>
      {showValue && (
        <span className="text-xs font-semibold text-brand-700">
          {value.toFixed(1)}
        </span>
      )}
      {typeof count === "number" && (
        <span className="text-xs text-brand-500">({count})</span>
      )}
    </div>
  );
}
