"use client";

import { Facebook, Instagram, Link2, MessageCircle, Music2 } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

export function ProductShareButtons({ title, slug }: { title: string; slug: string }) {
  const { toast } = useToast();
  const url = typeof window !== "undefined" ? window.location.href : `/product/${slug}`;
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast("Product link copied", "success");
    } catch {
      toast("Could not copy the product link", "error");
    }
  };

  return (
    <div className="mt-5 flex flex-wrap items-center gap-2">
      <span className="mr-1 text-sm font-semibold text-ink/55">Share product</span>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-icon border border-ink/10 bg-white text-ink/55 hover:bg-blue-600 hover:text-white"
        aria-label="Share on Facebook"
      >
        <Facebook className="h-4 w-4" />
      </a>
      <a
        href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-icon border border-ink/10 bg-white text-ink/55 hover:bg-[#25D366] hover:text-white"
        aria-label="Share on WhatsApp"
      >
        <MessageCircle className="h-4 w-4" />
      </a>
      <button
        type="button"
        onClick={copy}
        className="btn-icon border border-ink/10 bg-white text-ink/55 hover:bg-brand-600 hover:text-white"
        aria-label="Copy product link"
      >
        <Link2 className="h-4 w-4" />
      </button>
      <span className="ml-1 hidden items-center gap-1 text-xs text-ink/40 sm:inline-flex" title="Follow PJHERBAL on social media">
        <Instagram className="h-3.5 w-3.5" /> <Music2 className="h-3.5 w-3.5" />
      </span>
    </div>
  );
}
