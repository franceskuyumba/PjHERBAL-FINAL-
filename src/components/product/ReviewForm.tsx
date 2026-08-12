"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

interface ReviewFormProps {
  productId: string;
  defaultRating?: number;
}

export function ReviewForm({ productId, defaultRating = 5 }: ReviewFormProps) {
  const [rating, setRating] = useState(defaultRating);
  const [hover, setHover] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast("Please write a short review", "error");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, rating, title, comment }),
    });
    setLoading(false);
    if (res.ok) {
      toast("Thank you! Your review will appear once approved.", "success");
      setTitle("");
      setComment("");
      setRating(5);
    } else {
      const data = await res.json().catch(() => null);
      toast(data?.error || "Could not submit your review.", "error");
    }
  };

  return (
    <form onSubmit={submit} className="rounded-2xl bg-white p-5 shadow-card sm:p-6">
      <h3 className="font-display text-lg font-bold text-brand-950">Write a review</h3>
      <div className="mt-4 flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            aria-label={`Rate ${star} stars`}
            className="text-2xl transition-transform hover:scale-110"
          >
            <Star
              className={cn(
                "h-7 w-7",
                (hover || rating) >= star ? "text-gold-500" : "text-ink/15"
              )}
              fill="currentColor"
            />
          </button>
        ))}
        <span className="ml-2 text-sm font-medium text-ink/60">{rating}/5</span>
      </div>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Review title (optional)"
        maxLength={120}
        className="input mt-4"
      />
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={4}
        placeholder="Share your experience with this product..."
        className="input mt-4"
        maxLength={600}
      />
      <Button type="submit" loading={loading} className="mt-4">
        Submit review
      </Button>
    </form>
  );
}
