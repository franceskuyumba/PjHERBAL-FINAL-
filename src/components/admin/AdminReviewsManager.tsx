"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { Rating } from "@/components/ui/Rating";
import { formatDate } from "@/lib/utils";

interface Review {
  id: string;
  author: string;
  rating: number;
  title: string | null;
  comment: string;
  isApproved: boolean;
  createdAt: string;
  product: { id: string; name: string; slug: string } | null;
}

export function AdminReviewsManager() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [pendingOnly, setPendingOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/reviews${pendingOnly ? "?pending=1" : ""}`);
    const data = await res.json();
    setReviews(data.reviews || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingOnly]);

  const onApprove = async (r: Review, approved: boolean) => {
    await fetch("/api/admin/reviews", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: r.id, isApproved: approved }),
    });
    load();
  };

  const onDelete = async (r: Review) => {
    if (!confirm("Delete this review?")) return;
    await fetch(`/api/admin/reviews?id=${r.id}`, { method: "DELETE" });
    load();
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-brand-950">Reviews</h1>
          <p className="mt-1 text-sm text-ink/55">{reviews.length} reviews</p>
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-brand-950">
          <input type="checkbox" checked={pendingOnly} onChange={(e) => setPendingOnly(e.target.checked)} className="h-4 w-4 accent-brand-700" />
          Pending approval only
        </label>
      </div>

      <div className="mt-5 space-y-4">
        {loading ? (
          <p className="p-10 text-center text-sm text-ink/50">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="rounded-3xl border border-dashed border-ink/15 bg-white p-10 text-center text-sm text-ink/50">
            {pendingOnly ? "No pending reviews." : "No reviews yet."}
          </p>
        ) : (
          reviews.map((r) => (
            <div key={r.id} className="rounded-3xl border border-ink/5 bg-white p-6 shadow-card">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Rating value={r.rating} size="sm" />
                  <span className="text-sm font-semibold text-brand-950">{r.author}</span>
                  <span className="text-xs text-ink/40">{formatDate(r.createdAt)}</span>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    r.isApproved ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {r.isApproved ? "Approved" : "Pending"}
                </span>
              </div>
              <p className="mt-3 text-sm font-medium text-brand-950">{r.product?.name}</p>
              {r.title && <p className="mt-1 text-sm font-semibold text-brand-950">{r.title}</p>}
              <p className="mt-1 text-sm text-ink/60">{r.comment}</p>
              <div className="mt-4 flex gap-2">
                {!r.isApproved ? (
                  <button onClick={() => onApprove(r, true)} className="btn-primary btn-sm">
                    Approve
                  </button>
                ) : (
                  <button onClick={() => onApprove(r, false)} className="btn-outline btn-sm">
                    Unpublish
                  </button>
                )}
                <button onClick={() => onDelete(r)} className="btn btn-sm bg-red-600 text-white hover:bg-red-700">
                  <Trash2 className="mr-1 h-3.5 w-3.5" /> Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
