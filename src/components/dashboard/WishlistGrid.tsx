"use client";

import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Heart, ShoppingBag, Trash2 } from "lucide-react";
import { ProductCard, type ProductCardProduct } from "@/components/product/ProductCard";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/components/ui/Toast";
import { EmptyState } from "@/components/ui/EmptyState";
import { cn } from "@/lib/utils";

type WishlistProduct = ProductCardProduct & { wishlistId: string };

export function WishlistGrid({ products }: { products: WishlistProduct[] }) {
  const router = useRouter();
  const { addItem } = useCart();
  const { toast } = useToast();

  const remove = async (id: string) => {
    await fetch(`/api/wishlist/${id}`, { method: "POST" });
    router.refresh();
  };

  const moveToCart = async (p: WishlistProduct) => {
    if (p.stock <= 0) return;
    addItem({
      productId: p.id,
      slug: p.slug,
      name: p.name,
      price: p.price,
      image: p.image,
      quantity: 1,
      stock: p.stock,
    });
    await fetch(`/api/wishlist/${p.wishlistId}`, { method: "POST" });
    toast(`${p.name} moved to cart`, "success");
    router.refresh();
  };

  if (products.length === 0) {
    return (
      <div className="mt-8">
        <EmptyState
          icon={<Heart className="h-7 w-7" />}
          title="Your wishlist is empty"
          description="Tap the heart on any product to save it here for later."
          action={<a href="/shop" className="btn-primary btn-sm">Browse products</a>}
        />
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {products.map((p) => (
            <motion.div
              key={p.wishlistId}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.25 }}
              className="relative"
            >
              <button
                onClick={() => remove(p.wishlistId)}
                aria-label="Remove from wishlist"
                className="absolute -right-1.5 -top-1.5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white shadow-card transition-transform hover:scale-110"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
              <div className="group relative">
                <ProductCard product={p} isLoggedIn />
                <button
                  onClick={() => moveToCart(p)}
                  disabled={p.stock <= 0}
                  className={cn(
                    "absolute inset-x-3 bottom-3 z-10 flex items-center justify-center gap-1.5 rounded-full bg-brand-950/85 py-2 text-xs font-bold text-gold-200 opacity-0 backdrop-blur transition-all hover:bg-brand-950 disabled:cursor-not-allowed disabled:opacity-0 group-hover:opacity-100",
                    "focus:opacity-100"
                  )}
                >
                  <ShoppingBag className="h-3.5 w-3.5" />
                  {p.stock <= 0 ? "Out of stock" : "Move to cart"}
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
