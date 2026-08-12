"use client";

import { useState } from "react";
import { BadgeCheck } from "lucide-react";
import Rating from "@/components/ui/Rating";
import Button from "@/components/ui/Button";
import type { Product } from "@/lib/types";

export default function ProductReviews({ product }: { product: Product }) {
  const [showAll, setShowAll] = useState(false);
  const reviews = showAll ? product.reviews : product.reviews.slice(0, 2);
  const [rating, setRating] = useState(5);
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !body.trim()) return;
    setSubmitted(true);
    setName("");
    setBody("");
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {/* Summary */}
      <div className="rounded-2xl border border-brand-100 bg-white p-6 text-center shadow-card">
        <p className="font-display text-5xl font-bold text-brand-900">
          {product.rating.toFixed(1)}
        </p>
        <div className="mt-2 flex justify-center">
          <Rating value={product.rating} size="md" />
        </div>
        <p className="mt-2 text-sm text-brand-500">
          Based on {product.reviewCount} verified reviews
        </p>
        <div className="mt-4 grid gap-1.5 text-xs">
          {[5, 4, 3, 2, 1].map((star) => {
            const pct =
              star === 5 ? 72 : star === 4 ? 18 : star === 3 ? 6 : star === 2 ? 2 : 2;
            return (
              <div key={star} className="flex items-center gap-2">
                <span className="w-4 text-brand-700">{star}★</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-brand-100">
                  <div
                    className="h-full rounded-full bg-gold-400"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-6 text-right text-brand-400">{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* List + form */}
      <div className="space-y-6 lg:col-span-2">
        <h3 className="font-display text-xl font-bold text-brand-950">
          Customer Reviews
        </h3>
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="rounded-2xl border border-brand-100 bg-white p-5 shadow-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-xs font-bold text-white">
                    {r.name.charAt(0)}
                  </span>
                  <div>
                    <p className="flex items-center gap-1 text-sm font-semibold text-brand-950">
                      {r.name}
                      {r.verified && <BadgeCheck className="h-3.5 w-3.5 text-brand-600" />}
                    </p>
                    <p className="text-xs text-brand-400">{r.date}</p>
                  </div>
                </div>
                <Rating value={r.rating} />
              </div>
              <p className="mt-3 text-sm font-semibold text-brand-800">{r.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-brand-600">{r.body}</p>
            </div>
          ))}
        </div>

        {product.reviews.length > 2 && (
          <Button
            variant="outline"
            onClick={() => setShowAll((v) => !v)}
            className="mx-auto block"
          >
            {showAll ? "Show Less" : "View All Reviews"}
          </Button>
        )}

        <form
          onSubmit={submit}
          className="rounded-2xl border border-brand-100 bg-white p-6 shadow-card"
        >
          <h3 className="font-display text-lg font-bold text-brand-950">
            Write a Review
          </h3>
          <div className="mt-4">
            <label className="mb-1.5 block text-sm font-medium text-brand-900">
              Your Rating
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                  className={`text-2xl transition ${star <= rating ? "text-gold-500" : "text-brand-200"}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Your name"
              className="rounded-xl border border-brand-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
            />
            <input
              value={rating > 0 ? `${rating} stars` : "Select rating above"}
              disabled
              className="rounded-xl border border-brand-100 bg-brand-50 px-4 py-3 text-sm text-brand-400"
            />
          </div>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            rows={4}
            placeholder="Share your experience with this product..."
            className="mt-4 w-full rounded-xl border border-brand-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
          <Button type="submit" className="mt-4">
            {submitted ? "Thank you! Review submitted" : "Submit Review"}
          </Button>
        </form>
      </div>
    </div>
  );
}
