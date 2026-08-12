import Link from "next/link";
import { SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="bg-cream py-24">
      <div className="mx-auto max-w-md px-4 text-center">
        <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand-100 text-brand-600">
          <SearchX className="h-10 w-10" />
        </span>
        <h1 className="mt-6 font-display text-4xl font-bold text-brand-950">404</h1>
        <p className="mt-2 text-sm text-brand-500">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/"
            className="rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            Go Home
          </Link>
          <Link
            href="/shop"
            className="rounded-full border border-brand-200 bg-white px-6 py-3 text-sm font-semibold text-brand-700 transition hover:bg-brand-50"
          >
            Browse Shop
          </Link>
        </div>
      </div>
    </div>
  );
}
