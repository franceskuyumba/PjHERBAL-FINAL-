"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Landmark,
  MessageCircle,
  Package,
  ShoppingBag,
  Smartphone,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useCart } from "@/context/CartContext";
import { PAYMENT_METHODS, SHIPPING, TANZANIA_REGIONS } from "@/lib/constants";
import { formatTZS } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { buildWhatsAppUrl, whatsappOrderMessage } from "@/lib/whatsapp";

type Step = 1 | 2 | 3 | 4;

interface OrderResult {
  orderNumber: string;
  reference: string;
  redirectUrl?: string;
  instructions?: string[];
  provider: string;
  total: number;
  paymentMethod: string;
  customerName: string;
}

const stepLabels: Record<Step, string> = {
  1: "Your details",
  2: "Delivery",
  3: "Payment",
  4: "Confirmation",
};

export default function CheckoutPage() {
  const { items, totals, coupon, clearCart } = useCart();
  const { toast } = useToast();

  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState({
    customerName: "",
    email: "",
    phone: "",
    region: "",
    district: "",
    address: "",
    notes: "",
    paymentMethod: "M-PESA",
  });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<OrderResult | null>(null);

  const totalItems = useMemo(() => items.reduce((s, i) => s + i.quantity, 0), [items]);

  const update = (key: keyof typeof form, value: string) => setForm((f) => ({ ...f, [key]: value }));

  if (items.length === 0) {
    return (
      <div className="container-site py-16 sm:py-24">
        <div className="mx-auto max-w-md text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
            <ShoppingBag className="h-8 w-8" />
          </div>
          <h1 className="font-display text-2xl font-bold text-brand-950">Your cart is empty</h1>
          <p className="mt-2 text-sm text-ink/55">Add some products before checking out.</p>
          <Link href="/shop" className="btn-primary btn-md mt-6">
            Browse products
          </Link>
        </div>
      </div>
    );
  }

  const validateStep1 = () => {
    if (!form.customerName.trim() || form.customerName.trim().length < 2) return "Please enter your full name";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) return "Please enter a valid email address";
    if (!/^(\+?[0-9]{9,15})$/.test(form.phone)) return "Please enter a valid phone number (e.g. 2557XXXXXXXX)";
    return null;
  };

  const validateStep2 = () => {
    if (!form.region) return "Please select a region";
    if (!form.district.trim()) return "Please enter your district";
    if (!form.address.trim() || form.address.trim().length < 3) return "Please enter your delivery address";
    return null;
  };

  const next = () => {
    const error = step === 1 ? validateStep1() : step === 2 ? validateStep2() : null;
    if (error) {
      toast(error, "error");
      return;
    }
    setStep((s) => (s + 1) as Step);
    if (step === 3) submitOrder();
  };

  const submitOrder = async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          coupon,
          ...form,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast(data.error || "Something went wrong during checkout.", "error");
        setSubmitting(false);
        return;
      }
      setResult(data as OrderResult);
      setStep(4);
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
        return;
      }
      clearCart();
    } catch {
      toast("Network error. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-site py-8 sm:py-12">
      <h1 className="font-display text-3xl font-bold text-brand-950">Checkout</h1>

      <div className="mt-6 flex items-center gap-1 sm:gap-2">
        {([1, 2, 3, 4] as Step[]).map((s) => (
          <div key={s} className="flex flex-1 items-center gap-1 sm:gap-2">
            <button
              onClick={() => s < step && step !== 4 && setStep(s)}
              disabled={s >= step || step === 4}
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all",
                step > s || (step === 4 && s < 4)
                  ? "bg-brand-600 text-white"
                  : step === s
                    ? "bg-brand-600 text-white ring-4 ring-brand-100"
                    : "bg-ink/10 text-ink/40"
              )}
            >
              {step > s ? <Check className="h-4 w-4" /> : s}
            </button>
            <span className={cn("hidden text-xs font-medium sm:block", step === s ? "text-brand-800" : "text-ink/40")}>
              {stepLabels[s]}
            </span>
            {s < 4 && <div className={cn("h-0.5 flex-1 rounded", step > s ? "bg-brand-600" : "bg-ink/10")} />}
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="min-w-0">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="card p-6 sm:p-8">
                <h2 className="font-display text-xl font-bold text-brand-950">Customer details</h2>
                <p className="mt-1 text-sm text-ink/55">We'll use this to confirm your order.</p>
                <div className="mt-6 space-y-4">
                  <div>
                    <label className="label" htmlFor="name">Full name *</label>
                    <input id="name" className="input" value={form.customerName} onChange={(e) => update("customerName", e.target.value)} placeholder="e.g. Juma Mohamed" />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="label" htmlFor="email">Email *</label>
                      <input id="email" type="email" className="input" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@example.com" />
                    </div>
                    <div>
                      <label className="label" htmlFor="phone">Phone (WhatsApp) *</label>
                      <input id="phone" type="tel" className="input" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="2557XXXXXXXX" />
                    </div>
                  </div>
                </div>
                <div className="mt-8 flex justify-end">
                  <Button onClick={() => next()}>
                    Continue to delivery
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="card p-6 sm:p-8">
                <h2 className="font-display text-xl font-bold text-brand-950">Delivery information</h2>
                <p className="mt-1 text-sm text-ink/55">Where should we deliver your order?</p>
                <div className="mt-6 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="label" htmlFor="region">Region *</label>
                      <select id="region" className="input" value={form.region} onChange={(e) => update("region", e.target.value)}>
                        <option value="">Select region...</option>
                        {TANZANIA_REGIONS.map((r) => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="label" htmlFor="district">District *</label>
                      <input id="district" className="input" value={form.district} onChange={(e) => update("district", e.target.value)} placeholder="e.g. Ilala" />
                    </div>
                  </div>
                  <div>
                    <label className="label" htmlFor="address">Street / delivery address *</label>
                    <textarea id="address" className="input" rows={2} value={form.address} onChange={(e) => update("address", e.target.value)} placeholder="House number, street, landmarks..." />
                  </div>
                  <div>
                    <label className="label" htmlFor="notes">Order notes (optional)</label>
                    <textarea id="notes" className="input" rows={2} value={form.notes} onChange={(e) => update("notes", e.target.value)} placeholder="Any special instructions for delivery..." />
                  </div>
                </div>
                <div className="mt-8 flex items-center justify-between">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Button>
                  <Button onClick={() => next()}>
                    Continue to payment
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="card p-6 sm:p-8">
                <h2 className="font-display text-xl font-bold text-brand-950">Payment</h2>
                <p className="mt-1 text-sm text-ink/55">Choose how you'd like to pay. Payments are processed securely.</p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {PAYMENT_METHODS.map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => update("paymentMethod", method.id)}
                      className={cn(
                        "flex items-center gap-3 rounded-2xl border-2 p-4 text-left transition-all",
                        form.paymentMethod === method.id
                          ? "border-brand-600 bg-brand-50 shadow-glow"
                          : "border-ink/10 bg-white hover:border-brand-300"
                      )}
                    >
                      <span className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                        method.icon === "mobile" ? "bg-brand-50 text-brand-600" : "bg-gold-50 text-gold-600"
                      )}>
                        {method.icon === "mobile" ? <Smartphone className="h-5 w-5" /> : <Landmark className="h-5 w-5" />}
                      </span>
                      <span>
                        <span className="block font-bold text-brand-950">{method.name}</span>
                        <span className="block text-xs text-ink/50">{method.description}</span>
                      </span>
                      {form.paymentMethod === method.id && (
                        <CheckCircle2 className="ml-auto h-5 w-5 shrink-0 text-brand-600" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="mt-8 flex items-center justify-between">
                  <Button variant="outline" onClick={() => setStep(2)} disabled={submitting}>
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Button>
                  <Button onClick={() => next()} loading={submitting} variant="gold" size="lg">
                    Pay {formatTZS(totals.total)}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 4 && result && (
              <motion.div key="s4" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="card overflow-hidden">
                <div className="bg-gradient-to-br from-brand-700 to-brand-600 p-8 text-center text-white">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.2 }}
                    className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/20"
                  >
                    <CheckCircle2 className="h-10 w-10" />
                  </motion.div>
                  <h2 className="mt-4 font-display text-2xl font-bold">Order confirmed!</h2>
                  <p className="mt-2 text-white/80">
                    Thank you, {result.customerName.split(" ")[0]}. Your order is being prepared.
                  </p>
                  <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-5 py-2">
                    <Package className="h-4 w-4" />
                    <span className="font-mono font-bold">Order #{result.orderNumber}</span>
                  </div>
                </div>

                <div className="p-6 sm:p-8">
                  {result.instructions && result.instructions.length > 0 && (
                    <div className="rounded-2xl border border-gold-200 bg-gold-50 p-5">
                      <h3 className="font-bold text-gold-800">Complete your payment ({result.paymentMethod})</h3>
                      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-gold-900/80">
                        {result.instructions.map((line, i) => (
                          <li key={i}>{line}</li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {result.provider === "MANUAL" ? (
                    <a
                      href={`${buildWhatsAppUrl()}&text=${whatsappOrderMessage({
                        orderNumber: result.orderNumber,
                        total: result.total,
                        paymentMethod: result.paymentMethod,
                        customerName: result.customerName,
                      })}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-whatsapp btn-lg mt-6 w-full"
                    >
                      <MessageCircle className="h-5 w-5" />
                      Confirm payment on WhatsApp
                    </a>
                  ) : (
                    <p className="mt-4 rounded-2xl bg-brand-50 p-4 text-center text-sm text-brand-800">
                      You'll be redirected to complete your payment securely.
                    </p>
                  )}

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <Link href="/customer-dashboard/orders" className="btn-primary btn-md flex-1">
                      View your orders
                    </Link>
                    <Link href="/shop" className="btn-outline btn-md flex-1">
                      Continue shopping
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="card p-6">
            <h2 className="font-display text-lg font-bold text-brand-950">Order summary</h2>
            <p className="mt-1 text-xs text-ink/45">{totalItems} items</p>
            <div className="mt-4 max-h-52 space-y-3 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.productId} className="flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-xs font-bold text-brand-700">
                    ×{item.quantity}
                  </div>
                  <p className="min-w-0 flex-1 truncate text-sm text-ink/70">{item.name}</p>
                  <p className="shrink-0 text-sm font-semibold text-ink">{formatTZS(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            <dl className="mt-5 space-y-2.5 border-t border-ink/10 pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink/55">Subtotal</dt>
                <dd className="font-semibold">{formatTZS(totals.subtotal)}</dd>
              </div>
              {totals.discount > 0 && (
                <div className="flex justify-between text-brand-600">
                  <dt>Discount ({coupon?.code})</dt>
                  <dd className="font-semibold">−{formatTZS(totals.discount)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-ink/55">Delivery</dt>
                <dd className="font-semibold">{totals.shipping === 0 ? "FREE" : formatTZS(totals.shipping)}</dd>
              </div>
              <div className="flex justify-between border-t border-ink/10 pt-3">
                <dt className="font-bold text-brand-950">Total</dt>
                <dd className="font-display text-lg font-bold text-brand-800">{formatTZS(totals.total)}</dd>
              </div>
            </dl>

            {!totals.freeShipping && totals.subtotal > 0 && (
              <div className="mt-5 rounded-2xl bg-brand-50 p-4">
                <p className="text-xs font-medium text-brand-800">
                  Add <span className="font-bold">{formatTZS(SHIPPING.freeThreshold - (totals.subtotal - totals.discount))}</span> more to unlock{" "}
                  <span className="font-bold">FREE delivery</span>
                </p>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-brand-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-600 transition-all duration-500"
                    style={{
                      width: `${Math.min(100, ((totals.subtotal - totals.discount) / SHIPPING.freeThreshold) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
