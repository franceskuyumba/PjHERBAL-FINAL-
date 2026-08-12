import { Skeleton } from "@/components/ui/Skeleton";

export default function LoadingPage() {
  return (
    <div className="container-site grid gap-6 py-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} className="aspect-[3/4] rounded-3xl" />
      ))}
    </div>
  );
}
