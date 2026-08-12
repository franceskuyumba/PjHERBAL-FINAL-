"use client";

import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="bg-cream py-24">
      <div className="mx-auto max-w-md px-4 text-center">
        <h1 className="font-display text-2xl font-bold text-brand-950">
          Something went wrong
        </h1>
        <p className="mt-2 text-sm text-brand-500">
          {error.message || "An unexpected error occurred. Please try again."}
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={reset}
            className="rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="rounded-full border border-brand-200 bg-white px-6 py-3 text-sm font-semibold text-brand-700 transition hover:bg-brand-50"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
