import { GridSkeleton } from "@/components/ui/Skeleton";

export default function ShopLoading() {
  return (
    <div className="container-site py-8 sm:py-12">
      <div className="mb-8">
        <div className="h-3 w-24 animate-pulse rounded bg-ink/10" />
        <div className="mt-3 h-9 w-64 animate-pulse rounded bg-ink/10" />
        <div className="mt-2 h-4 w-40 animate-pulse rounded bg-ink/10" />
      </div>
      <div className="flex gap-8">
        <div className="hidden w-64 shrink-0 lg:block">
          <div className="h-96 animate-pulse rounded-3xl bg-ink/5" />
        </div>
        <div className="flex-1">
          <GridSkeleton count={8} />
        </div>
      </div>
    </div>
  );
}
