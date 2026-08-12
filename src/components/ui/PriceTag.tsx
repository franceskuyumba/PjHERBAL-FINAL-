import { formatTZS } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface PriceTagProps {
  price: number;
  compareAtPrice?: number | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: { price: "text-base font-bold", compare: "text-xs" },
  md: { price: "text-lg font-bold", compare: "text-sm" },
  lg: { price: "text-3xl font-bold", compare: "text-lg" },
};

export function PriceTag({ price, compareAtPrice, size = "md", className }: PriceTagProps) {
  const s = sizes[size];
  const discount =
    compareAtPrice && compareAtPrice > price
      ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
      : 0;

  return (
    <div className={cn("flex items-baseline gap-2", className)}>
      <span className={cn("text-brand-700", s.price)}>{formatTZS(price)}</span>
      {discount > 0 && (
        <>
          <span className={cn("text-ink/35 line-through", s.compare)}>
            {formatTZS(compareAtPrice!)}
          </span>
          <span className="badge bg-red-50 text-red-600">{discount}% OFF</span>
        </>
      )}
    </div>
  );
}
