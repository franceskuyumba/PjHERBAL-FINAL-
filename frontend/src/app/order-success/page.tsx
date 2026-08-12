"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Truck, Package, CreditCard } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { SITE, PAYMENT_METHODS } from "@/lib/constants";
import type { Order } from "@/lib/types";

export default function OrderSuccessPage() {
  const [order, setOrder] = useState<Order | null>(null);
  const [searchOrder, setSearchOrder] = useState("");
  const [found, setFound] = useState<Order | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("lastOrder");
      if (raw) setOrder(JSON.parse(raw) as Order);
    } catch {
      /* ignore */
    }
  }, []);

  const lookup = () => {
    try {
      const raw = sessionStorage.getItem("lastOrder");
      if (raw) {
        const o = JSON.parse(raw) as Order;
        if (o.orderNumber.toLowerCase() === searchOrder.trim().toLowerCase()) {
          setFound(o);
          return;
        }
      }
      setFound(null);
    } catch {
      setFound(null);
    }
  };

  const active = order || found;

  return (
    <div className="bg-cream py-14">
      <div className="mx-auto max-w-2xl px-4">
        {active ? (
          <div className="rounded-3xl border border-brand-100 bg-white p-8 text-center shadow-lift">
            <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand-100">
              <CheckCircle2 className="h-11 w-11 text-brand-600" />
            </span>
            <h1 className="mt-6 font-display text-3xl font-bold text-brand-950">
              Thank You for Your Order!
            </h1>
            <p className="mt-2 text-sm text-brand-600">
              Order <span className="font-bold text-brand-900">#{active.orderNumber}</span> was placed
              successfully. A confirmation has been sent to your phone.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-brand-50 p-4">
                <CreditCard className="mx-auto h-5 w-5 text-brand-600" />
                <p className="mt-2 text-xs text-brand-500">Payment</p>
                <p className="text-sm font-semibold text-brand-900">
                  {PAYMENT_METHODS.find((p) => p.id === active.paymentMethod)?.label || active.paymentMethod}
                </p>
              </div>
              <div className="rounded-xl bg-brand-50 p-4">
                <Package className="mx-auto h-5 w-5 text-brand-600" />
                <p className="mt-2 text-xs text-brand-500">Total</p>
                <p className="text-sm font-semibold text-brand-900">{formatPrice(active.total)}</p>
              </div>
              <div className="rounded-xl bg-brand-50 p-4">
                <Truck className="mx-auto h-5 w-5 text-brand-600" />
                <p className="mt-2 text-xs text-brand-500">Delivery to</p>
                <p className="text-sm font-semibold text-brand-900">{active.delivery.region}</p>
              </div>
            </div>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(
                  `Hello AfyaPlus! I just placed order #${active.orderNumber}. Please confirm it.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#1fb958]"
              >
                Confirm on WhatsApp
              </a>
              <Link
                href="/customer-dashboard"
                className="inline-flex items-center gap-2 rounded-full border border-brand-200 px-7 py-3 text-sm font-semibold text-brand-700 transition hover:bg-brand-50"
              >
                <Truck className="h-4 w-4" /> Track Order
              </Link>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-7 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-brand-100 bg-white p-8 shadow-card">
            <h1 className="text-center font-display text-2xl font-bold text-brand-950">
              Find Your Order
            </h1>
            <p className="mt-2 text-center text-sm text-brand-500">
              Enter your order number to view its status.
            </p>
            <div className="mt-6 flex gap-2">
              <input
                value={searchOrder}
                onChange={(e) => setSearchOrder(e.target.value)}
                placeholder="e.g. AP-123456"
                className="h-11 flex-1 rounded-xl border border-brand-200 px-4 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
              />
              <button
                onClick={lookup}
                className="h-11 rounded-xl bg-brand-600 px-6 text-sm font-semibold text-white transition hover:bg-brand-700"
              >
                Track
              </button>
            </div>
            {found === null && searchOrder && (
              <p className="mt-3 text-center text-sm text-red-500">
                Order not found. Please check your order number or contact support.
              </p>
            )}
            <div className="mt-6 text-center">
              <Link href="/contact" className="text-sm font-semibold text-brand-700 underline">
                Need help? Contact support
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
