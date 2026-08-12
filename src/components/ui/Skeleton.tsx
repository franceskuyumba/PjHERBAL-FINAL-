import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl bg-ink/[0.06]",
        className
      )}
      aria-hidden="true"
    >
      <div
        className="absolute inset-0 animate-pulse"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",
        }}
      />
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="card overflow-hidden p-0">
      <Skeleton className="aspect-square w-full rounded-none" />
      <div className="space-y-3 p-5">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-5 w-24" />
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
