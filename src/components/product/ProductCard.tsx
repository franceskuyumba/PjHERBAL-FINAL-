"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Heart, MessageCircle, ShoppingCart } from "lucide-react";
import { useRef, useState } from "react";
import { Rating } from "@/components/ui/Rating";
import { PriceTag } from "@/components/ui/PriceTag";
import { StockBadge } from "@/components/ui/Badge";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/components/ui/Toast";
import { formatTZS } from "@/lib/utils";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

export interface ProductCardProduct {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  price: number;
  compareAtPrice?: number | null;
  image: string;
  stock: number;
  rating: number;
  ratingCount: number;
  isBestSeller?: boolean;
  categoryName?: string;
}

export function ProductCard({
  product,
  index = 0,
  isLoggedIn = false,
}: {
  product: ProductCardProduct;
  index?: number;
  isLoggedIn?: boolean;
}) {
  const { addItem } = useCart();
  const { toast } = useToast();
  const [wishlisted, setWishlisted] = useState(false);
  const [added, setAdded] = useState(false);
  const addedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleAddToCart = () => {
    if (product.stock <= 0) return;
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      stock: product.stock,
    });
    setAdded(true);
    if (addedTimer.current) clearTimeout(addedTimer.current);
    addedTimer.current = setTimeout(() => setAdded(false), 1200);
    toast(`${product.name} added to cart`, "success");
  };

  const handleWishlist = async () => {
    if (!isLoggedIn) {
      toast("Please sign in to save items to your wishlist", "info");
      return;
    }
    const res = await fetch(`/api/wishlist/${product.id}`, { method: "POST" });
    if (res.ok) {
      setWishlisted((v) => !v);
      toast(wishlisted ? "Removed from wishlist" : "Saved to wishlist", "success");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.06, 0.4) }}
      whileHover={{ y: -6 }}
      className="group card relative flex flex-col overflow-hidden transition-shadow duration-300 hover:shadow-lift"
    >
      <div className="relative aspect-square overflow-hidden bg-brand-50">
        <Link href={`/product/${product.slug}`} aria-label={product.name}>
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        {product.isBestSeller && (
          <span className="badge absolute left-3 top-3 bg-gold-500 text-brand-950 shadow-card">
            Best Seller
          </span>
        )}

        <motion.button
          onClick={handleWishlist}
          aria-label="Toggle wishlist"
          animate={wishlisted ? { scale: [1, 1.35, 1] } : { scale: 1 }}
          transition={{ duration: 0.35 }}
          className={cn(
            "absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-card backdrop-blur transition-colors hover:scale-110",
            wishlisted ? "text-red-500" : "text-ink/50 hover:text-red-500"
          )}
        >
          <Heart className="h-4 w-4" fill={wishlisted ? "currentColor" : "none"} />
        </motion.button>
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {product.categoryName && (
          <p className="mb-1 text-[11px] font-bold uppercase tracking-widest text-brand-500">
            {product.categoryName}
          </p>
        )}
        <Link href={`/product/${product.slug}`}>
          <h3 className="line-clamp-1 font-display text-base font-bold text-brand-950 transition-colors group-hover:text-brand-700 sm:text-lg">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 line-clamp-2 text-xs leading-5 text-ink/55 sm:text-sm">
          {product.shortDescription}
        </p>

        <div className="mt-2">
          <Rating value={product.rating} count={product.ratingCount} size="sm" />
        </div>

        <div className="mt-3 flex items-center justify-between gap-2">
          <PriceTag price={product.price} compareAtPrice={product.compareAtPrice} size="sm" />
        </div>

        <div className="mt-2">
          <StockBadge stock={product.stock} />
        </div>

        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className={cn(
              "btn-primary btn-sm flex-1 disabled:opacity-50",
              added && "bg-brand-800"
            )}
          >
            {added ? (
              <>
                <Check className="h-4 w-4" />
                <span className="hidden sm:inline">Added</span>
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4" />
                <span className="hidden sm:inline">Add to cart</span>
                <span className="sm:hidden">{formatTZS(product.price)}</span>
              </>
            )}
          </button>
          <a
            href={buildWhatsAppUrl({
              productName: product.name,
              productPrice: formatTZS(product.price),
              page: `${process.env.NEXT_PUBLIC_SITE_URL || ""}/product/${product.slug}`,
            })}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Ask about ${product.name} on WhatsApp`}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#25D366]/30 text-[#1eb958] transition-colors hover:bg-[#25D366] hover:text-white"
          >
            <MessageCircle className="h-4 w-4" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}
