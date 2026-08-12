import Link from "next/link";
import { Check, Truck, ShieldCheck, RefreshCcw } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import type { Product } from "@/lib/types";

export default function RelatedProducts({ products }: { products: Product[] }) {
  if (products.length === 0) return null;
  return (
    <section className="mt-16 border-t border-brand-100 pt-10">
      <h2 className="font-display text-2xl font-bold text-brand-950">
        You May Also Like
      </h2>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      <div className="mt-8 grid gap-4 rounded-2xl bg-brand-950 p-6 text-white sm:grid-cols-3">
        {[
          { icon: Truck, title: "Fast Nationwide Delivery", text: "Same day in Dar, 1–4 days upcountry." },
          { icon: ShieldCheck, title: "100% Authentic Products", text: "Quality checked and genuine, guaranteed." },
          { icon: RefreshCcw, title: "Easy Returns", text: "Contact us within 7 days for any issues." },
        ].map((f) => (
          <div key={f.title} className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-800 text-gold-400">
              <f.icon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold">{f.title}</p>
              <p className="mt-0.5 text-xs text-brand-300">{f.text}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-sm text-brand-500">
        <Check className="h-4 w-4 text-brand-600" /> Need help choosing?{" "}
        <Link href="/contact" className="font-semibold text-brand-700 underline">
          Talk to a specialist
        </Link>
      </p>
    </section>
  );
}
