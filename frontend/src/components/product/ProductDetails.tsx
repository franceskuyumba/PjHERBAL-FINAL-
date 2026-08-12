"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShoppingCart,
  Zap,
  Check,
  Truck,
  ShieldCheck,
  MessageCircle,
  Minus,
  Plus,
  PackageCheck,
  Heart,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { productInquiryMessage, whatsappUrl } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/whatsapp/WhatsAppButton";
import Rating from "@/components/ui/Rating";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import type { Product } from "@/lib/types";

export default function ProductDetails({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [tab, setTab] = useState<"description" | "ingredients" | "usage" | "warnings">(
    "description"
  );
  const [wishlisted, setWishlisted] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      const list = JSON.parse(localStorage.getItem("afyaplus_wishlist") || "[]") as string[];
      return list.includes(product.id);
    } catch {
      return false;
    }
  });

  const toggleWishlist = () => {
    setWishlisted((w) => {
      try {
        const list = JSON.parse(localStorage.getItem("afyaplus_wishlist") || "[]") as string[];
        const next = w ? list.filter((id) => id !== product.id) : [...list, product.id];
        localStorage.setItem("afyaplus_wishlist", JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return !w;
    });
  };

  const discount = product.compareAtPrice
    ? Math.round((1 - product.price / product.compareAtPrice) * 100)
    : 0;

  const handleAdd = () => {
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleBuyNow = () => {
    addToCart(product, qty);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        {product.bestSeller && <Badge variant="gold">Best Seller</Badge>}
        {product.featured && <Badge variant="green">Featured</Badge>}
        {discount > 0 && <Badge variant="red">Save {discount}%</Badge>}
        <Badge variant={product.inStock ? "green" : "red"}>
          {product.inStock ? `In Stock (${product.stock} available)` : "Out of Stock"}
        </Badge>
      </div>

      <h1 className="mt-4 font-display text-2xl font-bold text-brand-950 sm:text-3xl">
        {product.title}
      </h1>

      <div className="mt-3 flex items-center gap-3">
        <Rating value={product.rating} count={product.reviewCount} size="md" />
        <span className="text-xs text-brand-400">|</span>
        <span className="text-xs text-brand-500">{product.reviewCount} verified reviews</span>
      </div>

      <div className="mt-5 flex items-baseline gap-3">
        <span className="font-display text-3xl font-bold text-brand-900">
          {formatPrice(product.price)}
        </span>
        {product.compareAtPrice && (
          <span className="text-base text-brand-400 line-through">
            {formatPrice(product.compareAtPrice)}
          </span>
        )}
      </div>
      <p className="mt-1 text-xs text-brand-500">All prices include VAT</p>

      <p className="mt-4 text-sm leading-relaxed text-brand-600">{product.shortBenefits}</p>

      <div className="mt-6 grid gap-2.5 text-sm text-brand-700">
        {[
          { icon: Truck, text: "Same-day delivery in Dar es Salaam" },
          { icon: PackageCheck, text: "Nationwide delivery in 1–4 days" },
          { icon: ShieldCheck, text: "100% authentic, quality checked" },
        ].map((f) => (
          <p key={f.text} className="flex items-center gap-2.5">
            <f.icon className="h-5 w-5 text-brand-600" /> {f.text}
          </p>
        ))}
      </div>

      {/* Quantity + actions */}
      <div className="mt-6 flex items-center gap-3">
        <div className="flex items-center rounded-full border border-brand-200 bg-white">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            aria-label="Decrease quantity"
            className="flex h-11 w-11 items-center justify-center rounded-full text-brand-700 transition hover:bg-brand-50"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-10 text-center font-semibold text-brand-900">{qty}</span>
          <button
            onClick={() => setQty((q) => Math.min(99, q + 1))}
            aria-label="Increase quantity"
            className="flex h-11 w-11 items-center justify-center rounded-full text-brand-700 transition hover:bg-brand-50"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <button
          onClick={toggleWishlist}
          aria-label="Add to wishlist"
          className={`flex h-11 w-11 items-center justify-center rounded-full border transition ${
            wishlisted
              ? "border-red-200 bg-red-50 text-red-500"
              : "border-brand-200 bg-white text-brand-600 hover:border-red-200 hover:text-red-500"
          }`}
        >
          <Heart className={`h-5 w-5 ${wishlisted ? "fill-red-500" : ""}`} />
        </button>
      </div>

      <div className="mt-4 grid gap-3">
        <div className="grid grid-cols-2 gap-3">
          <Button size="lg" onClick={handleAdd} disabled={!product.inStock}>
            {added ? (
              <>
                <Check className="h-5 w-5" /> Added to Cart
              </>
            ) : (
              <>
                <ShoppingCart className="h-5 w-5" /> Add to Cart
              </>
            )}
          </Button>
          <Link
            href="/checkout"
            onClick={handleBuyNow}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-gold-400 to-gold-600 px-5 text-base font-semibold text-white shadow-sm shadow-gold-500/30 transition hover:from-gold-500 hover:to-gold-700"
          >
            <Zap className="h-5 w-5" /> Buy Now
          </Link>
        </div>
        <a
          href={whatsappUrl(productInquiryMessage(product.id, product.title))}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 text-base font-semibold text-white transition hover:bg-[#1fb958]"
        >
          <MessageCircle className="h-5 w-5" /> WhatsApp Consultation
        </a>
      </div>

      {/* Tabs */}
      <div className="mt-8">
        <div className="flex flex-wrap gap-1 border-b border-brand-100">
          {(
            [
              ["description", "Description"],
              ["ingredients", "Ingredients"],
              ["usage", "Usage"],
              ["warnings", "Precautions"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`border-b-2 px-4 py-2.5 text-sm font-semibold transition ${
                tab === key
                  ? "border-brand-600 text-brand-700"
                  : "border-transparent text-brand-400 hover:text-brand-600"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="pt-5">
          {tab === "description" && (
            <p className="text-sm leading-relaxed text-brand-600">{product.description}</p>
          )}
          {tab === "ingredients" && (
            <ul className="grid gap-2 text-sm text-brand-700">
              {product.ingredients.map((i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" /> {i}
                </li>
              ))}
            </ul>
          )}
          {tab === "usage" && (
            <ul className="grid gap-2 text-sm text-brand-700">
              {product.usage.map((u, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
                    {i + 1}
                  </span>{" "}
                  {u}
                </li>
              ))}
            </ul>
          )}
          {tab === "warnings" && (
            <ul className="grid gap-2 text-sm text-brand-700">
              {product.warnings.map((w) => (
                <li key={w} className="flex items-start gap-2">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-red-500" /> {w}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
