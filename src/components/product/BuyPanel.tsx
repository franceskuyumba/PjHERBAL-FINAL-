"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, ShoppingCart, Zap } from "lucide-react";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { useCart } from "@/context/CartContext";
import { useI18n } from "@/context/LanguageContext";
import { useToast } from "@/components/ui/Toast";
import { formatTZS } from "@/lib/utils";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { trackClientEvent } from "@/lib/client-analytics";

interface BuyPanelProps {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  stock: number;
}

export function BuyPanel({ productId, slug, name, price, image, stock }: BuyPanelProps) {
  const { addItem } = useCart();
  const { t } = useI18n();
  const { toast } = useToast();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const outOfStock = stock <= 0;

  const addToCart = (redirect = false) => {
    if (outOfStock) return;
    addItem({ productId, slug, name, price, image, quantity, stock });
    trackClientEvent("add_to_cart", { value: price * quantity });
    toast(t("product.added").replace("{name}", name), "success");
    if (redirect) {
      router.push("/cart");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="card p-6"
    >
      <p className="text-xs font-bold uppercase tracking-widest text-gold-600">{t("product.price")}</p>
      <div className="mt-1 flex items-baseline gap-3">
        <span className="font-display text-3xl font-bold text-brand-800">{formatTZS(price)}</span>
        <span className="text-sm text-ink/40 line-through">{formatTZS(price * 1.2)}</span>
      </div>
      <p className="mt-1 text-xs text-ink/50">{t("product.finalPriceNote")}</p>

      <div className="mt-6 flex items-center gap-4">
        <span className="text-sm font-medium text-ink/70">{t("product.quantity")}</span>
        <QuantityStepper value={quantity} onChange={setQuantity} max={Math.max(stock, 1)} />
      </div>

      <div className="mt-6 space-y-3">
        <button onClick={() => addToCart(false)} disabled={outOfStock} className="btn-primary btn-lg w-full">
          <ShoppingCart className="h-5 w-5" />
          {t("product.addToCart")}
        </button>
        <button onClick={() => addToCart(true)} disabled={outOfStock} className="btn-gold btn-lg w-full">
          <Zap className="h-5 w-5" />
          {t("product.buyNow")}
        </button>
        <a
          href={buildWhatsAppUrl({
            recipient: "specialist",
            productName: name,
            productPrice: formatTZS(price),
            page: `${process.env.NEXT_PUBLIC_SITE_URL || ""}/product/${slug}`,
          })}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-whatsapp btn-lg w-full"
          onClick={() => trackClientEvent("whatsapp_click", { product: slug })}
        >
          <MessageCircle className="h-5 w-5" />
          {t("product.askWhatsApp")}
        </a>
      </div>

      {outOfStock ? (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-2.5 text-center text-sm font-medium text-red-600">
          {t("product.outOfStockMsg")}
        </p>
      ) : (
        <div className="mt-4 space-y-1.5 rounded-xl bg-brand-50 px-4 py-3 text-xs text-brand-800">
          <p>✓ {t("product.stockNote1")}</p>
          <p>✓ {t("product.stockNote2")}</p>
          <p>✓ {t("product.stockNote3")}</p>
        </div>
      )}
    </motion.div>
  );
}
