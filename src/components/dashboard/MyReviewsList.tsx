"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MessageSquarePlus, Star, Trash2 } from "lucide-react";
import { Rating } from "@/components/ui/Rating";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDate } from "@/lib/utils";

interface MyReview {
  id: string;
  rating: number;
  title: string | null;
  comment: string;
  isApproved: boolean;
  createdAt: string;
  product: {
    slug: string;
    name: string;
    image: string;
  };
}

export function MyReviewsList({ reviews }: { reviews: MyReview[] }) {
  const router = useRouter();

  const remove = async (id: string) => {
    if (!confirm("Delete this review?")) return;
    await fetch(`/api/reviews/${id}`, { method: "DELETE" });
    router.refresh();
  };

  if (reviews.length === 0) {
    return (
      <div className="mt-8">
        <EmptyState
          icon={<MessageSquarePlus className="h-7 w-7" />}
          title="No reviews yet"
          description="Share your experience with products you have bought — your review helps other customers."
          action={<Link href="/shop" className="btn-primary btn-sm">Browse products</Link>}
        />
      </div>
    );
  }

  return (
    <ul className="mt-6 space-y-4">
      {reviews.map((r) => (
        <li key={r.id} className="card flex flex-col gap-4 p-5 sm:flex-row sm:items-start">
          <div className="flex items-start gap-4 sm:w-56 sm:shrink-0">
            <Link href={`/product/${r.product.slug}`} className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-brand-50">
              <Image src={r.product.image} alt={r.product.name} fill sizes="64px" className="object-cover" />
            </Link>
            <div className="min-w-0">
              <Link href={`/product/${r.product.slug}`} className="line-clamp-2 text-sm font-semibold text-brand-950 hover:text-brand-700">
                {r.product.name}
              </Link>
              <p className="mt-1 text-xs text-ink/45">{formatDate(r.createdAt)}</p>
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Rating value={r.rating} showValue={false} />
                <span className="text-xs font-bold text-brand-950">{r.rating}/5</span>
              </div>
              <span className={`badge ${r.isApproved ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                {r.isApproved ? "Approved" : "Pending review"}
              </span>
            </div>
            {r.title && <h3 className="mt-2 font-semibold text-brand-950">{r.title}</h3>}
            <p className="mt-1 text-sm leading-6 text-ink/60">{r.comment}</p>
            <div className="mt-3 flex justify-end">
              <button
                onClick={() => remove(r.id)}
                className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50"
              >
                <Trash2 className="h-3.5 w-3.5" /> Remove
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
