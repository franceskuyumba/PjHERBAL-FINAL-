import Link from "next/link";
import { SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-cream px-4">
      <div className="text-center">
        <p className="font-display text-7xl font-bold text-brand-200">404</p>
        <h1 className="mt-2 font-display text-2xl font-bold text-brand-950">Page not found</h1>
        <p className="mx-auto mt-2 max-w-sm text-sm text-ink/55">
          The page you are looking for may have moved, or no longer exists.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-primary">
            Back to home
          </Link>
          <Link href="/shop" className="btn-outline">
            <SearchX className="mr-2 h-4 w-4" /> Browse products
          </Link>
        </div>
      </div>
    </div>
  );
}
