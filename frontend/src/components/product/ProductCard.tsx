"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Check } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { productInquiryMessage } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/whatsapp/WhatsAppButton";
import Rating from "@/components/ui/Rating";
import Badge from "@/components/ui/Badge";
import type { Product } from "@/lib/types";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  const discount = product.compareAtPrice
    ? Math.round((1 - product.price / product.compareAtPrice) * 100)
    : 0;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-brand-100 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
      <Link
        href={`/product/${product.slug}`}
        className="relative block aspect-square overflow-hidden bg-brand-50"
      >
        <Image
          src={product.images[0]}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.bestSeller && <Badge variant="gold">Best Seller</Badge>}
          {discount > 0 && <Badge variant="red">-{discount}%</Badge>}
        </div>
        {!product.inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm">
            <Badge variant="dark">Out of stock</Badge>
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-1 flex items-center gap-2">
          <Rating value={product.rating} count={product.reviewCount} />
        </div>
        <Link href={`/product/${product.slug}`}>
          <h3 className="line-clamp-2 font-display text-sm font-semibold text-brand-950 transition-colors group-hover:text-brand-700">
            {product.title}
          </h3>
        </Link>
        <p className="mt-1 line-clamp-2 text-xs text-brand-500">
          {product.shortBenefits}
        </p>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="font-display text-lg font-bold text-brand-900">
            {formatPrice(product.price)}
          </span>
          {product.compareAtPrice && (
            <span className="text-xs text-brand-400 line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>

        <div className="mt-3 flex gap-2">
          <button
            onClick={handleAdd}
            disabled={!product.inStock}
            className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-full bg-brand-600 px-3 text-sm font-semibold text-white transition hover:bg-brand-700 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50"
          >
            {added ? (
              <>
                <Check className="h-4 w-4" /> Added
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4" /> Add to Cart
              </>
            )}
          </button>
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "255712345678"}?text=${encodeURIComponent(productInquiryMessage(product.id))}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Inquire about ${product.title} on WhatsApp`}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#25D366]/30 bg-[#25D366]/10 text-[#1fae54] transition hover:bg-[#25D366] hover:text-white"
          >
            <WhatsAppIcon className="h-4 w-4" />
          </a>
        </div>
      </div>
    </article>
  );
}
