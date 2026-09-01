"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Heart, MessageCircle, Pencil, ShoppingCart, X } from "lucide-react";
import { useRef, useState } from "react";
import { Rating } from "@/components/ui/Rating";
import { PriceTag } from "@/components/ui/PriceTag";
import { StockBadge } from "@/components/ui/Badge";
import { useCart } from "@/context/CartContext";
import { useI18n } from "@/context/LanguageContext";
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
  isAdmin = false,
}: {
  product: ProductCardProduct;
  index?: number;
  isLoggedIn?: boolean;
  isAdmin?: boolean;
}) {
  const { addItem } = useCart();
  const { t } = useI18n();
  const { toast } = useToast();
  const [wishlisted, setWishlisted] = useState(false);
  const [added, setAdded] = useState(false);
  const addedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showEdit, setShowEdit] = useState(false);
  const [editPrice, setEditPrice] = useState(String(product.price));
  const [editDesc, setEditDesc] = useState(product.shortDescription);
  const [saving, setSaving] = useState(false);

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
    toast(t("product.added").replace("{name}", product.name), "success");
  };

  const handleWishlist = async () => {
    if (!isLoggedIn) {
      toast(t("product.wishlistSignIn"), "info");
      return;
    }
    const res = await fetch(`/api/wishlist/${product.id}`, { method: "POST" });
    if (res.ok) {
      setWishlisted((v) => !v);
      toast(wishlisted ? t("product.wishlistRemoved") : t("product.wishlistSaved"), "success");
    }
  };

  const saveQuickEdit = async () => {
    setSaving(true);
    const res = await fetch(`/api/admin/products/${product.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ price: Number(editPrice), shortDescription: editDesc, mode: "quick-edit" }),
    });
    setSaving(false);
    if (!res.ok) { toast("Could not save", "error"); return; }
    toast("Product updated", "success");
    setShowEdit(false);
    window.location.reload();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.06, 0.4) }}
      whileHover={{ y: -4 }}
      className="group card relative flex flex-col overflow-hidden rounded-2xl border border-ink/[0.04] bg-white shadow-soft transition-all duration-300 hover:shadow-lift"
    >
      {isAdmin && (
        <button onClick={() => setShowEdit(true)} className="absolute left-3 top-12 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow hover:bg-brand-50">
          <Pencil className="h-3.5 w-3.5 text-brand-700" />
        </button>
      )}
      {showEdit && (
        <div className="absolute inset-0 z-20 flex flex-col bg-white p-4">
          <div className="flex items-center justify-between">
            <p className="font-bold text-brand-950">Quick edit</p>
            <button onClick={() => setShowEdit(false)}><X className="h-4 w-4" /></button>
          </div>
          <label className="mt-3 text-xs font-semibold">Price (TZS)</label>
          <input value={editPrice} onChange={(e) => setEditPrice(e.target.value)} type="number" className="input mt-1" />
          <label className="mt-3 text-xs font-semibold">Details</label>
          <textarea value={editDesc} onChange={(e) => setEditDesc(e.target.value)} rows={3} className="input mt-1" />
          <button onClick={saveQuickEdit} disabled={saving} className="btn-primary btn-sm mt-3">{saving ? "Saving..." : "Save"}</button>
        </div>
      )}
      <div className="relative aspect-[4/3] overflow-hidden bg-brand-50 sm:aspect-square">
        <Link href={`/product/${product.slug}`} aria-label={product.name}>
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
        {isAdmin && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-brand-950/60 p-3 opacity-0 transition hover:opacity-100">
            <label className="cursor-pointer rounded-full bg-white px-3 py-1.5 text-xs font-bold text-brand-800">

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                className="hidden"
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  const fd = new FormData();
                  fd.append("files", f);
                  const res = await fetch("/api/admin/uploads", { method: "POST", body: fd });
                  const data = await res.json().catch(() => null);
                  const url = data?.urls?.[0];
                  if (!res.ok || !url) { alert("Upload failed"); return; }
                  await fetch(`/api/admin/products/${product.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ images: url, mode: "photo" }),
                  });
                  window.location.reload();
                }}
              />
            </label>
            <label className="cursor-pointer rounded-full bg-brand-600 px-3 py-1.5 text-xs font-bold text-white">
              📷 Take photo
              <input
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  const fd = new FormData();
                  fd.append("files", f);
                  const res = await fetch("/api/admin/uploads", { method: "POST", body: fd });
                  const data = await res.json().catch(() => null);
                  const url = data?.urls?.[0];
                  if (!res.ok || !url) { alert("Upload failed"); return; }
                  await fetch(`/api/admin/products/${product.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ images: url, mode: "photo" }),
                  });
                  window.location.reload();
                }}
              />
            </label>
          </div>
        )}

        {product.isBestSeller && (
          <span className="badge absolute left-3 top-3 rounded-lg bg-gold-500 px-2.5 py-1 text-[11px] font-bold text-brand-950 shadow-soft">
            {t("product.bestSeller")}
          </span>
        )}

        <motion.button
          onClick={handleWishlist}
          aria-label={t("product.toggleWishlist")}
          animate={wishlisted ? { scale: [1, 1.35, 1] } : { scale: 1 }}
          transition={{ duration: 0.35 }}
          className={cn(
            "absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 shadow-soft backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:shadow-card",
            wishlisted ? "text-red-500" : "text-ink/40 hover:text-red-500"
          )}
        >
          <Heart className="h-4 w-4" fill={wishlisted ? "currentColor" : "none"} />
        </motion.button>
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {product.categoryName && (
          <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-sage-600">
            {product.categoryName}
          </p>
        )}
        <Link href={`/product/${product.slug}`}>
          <h3 className="line-clamp-1 font-display text-[15px] font-bold text-ink transition-colors group-hover:text-brand-600 sm:text-base">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-ink-muted sm:text-sm">
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

        <div className="mt-4 grid gap-2">
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
                <span className="hidden sm:inline">{t("product.addedLabel")}</span>
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4" />
                <span className="hidden sm:inline">{t("product.addToCartLabel")}</span>
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
            aria-label={t("product.askAbout").replace("{name}", product.name)}
            className="flex h-10 items-center justify-center gap-2 rounded-xl border border-sage-500/30 text-sm font-semibold text-sage-700 transition-all duration-200 hover:border-[#25D366] hover:bg-[#25D366] hover:text-white"
          >
            <MessageCircle className="h-4 w-4" />
            <span>{t("product.whatsappInquiry")}</span>
          </a>
        </div>
      </div>
    </motion.div>
  );
}
