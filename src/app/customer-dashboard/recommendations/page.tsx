import Link from "next/link";
import { notFound } from "next/navigation";
import { Sparkles } from "lucide-react";
import { getSession } from "@/lib/auth";
import { getRecommendations } from "@/lib/recommendations";
import { ProductCard } from "@/components/product/ProductCard";
import { EmptyState } from "@/components/ui/EmptyState";

export const metadata = { title: "Recommended For You", robots: { index: false, follow: false } };

export default async function RecommendationsPage() {
  const session = await getSession();
  if (!session) notFound();

  const products = await getRecommendations(session.sub, 8);

  return (
    <div>
      <div className="flex items-center gap-2">
        <Sparkles className="h-6 w-6 text-gold-600" />
        <h1 className="font-display text-2xl font-bold text-brand-950">Recommended for you</h1>
      </div>
      <p className="mt-1 max-w-xl text-sm text-ink/55">
        Chosen from what you have ordered, saved and viewed. Genuine suggestions — no magic, just smart matching.
      </p>

      {products.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            icon={<Sparkles className="h-7 w-7" />}
            title="Nothing to recommend yet"
            description="Order, save to wishlist or view a few products and we will personalise this page."
            action={<Link href="/shop" className="btn-primary btn-sm">Explore the shop</Link>}
          />
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} isLoggedIn />
          ))}
        </div>
      )}
    </div>
  );
}
