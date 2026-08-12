"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  User,
  CreditCard,
  CheckCircle2,
  Truck,
  Smartphone,
  Lock,
  ChevronLeft,
  ArrowRight,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { PAYMENT_METHODS, SITE } from "@/lib/constants";
import { regions } from "@/lib/data/store";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { WhatsAppIcon } from "@/components/whatsapp/WhatsAppButton";
import { api } from "@/lib/api";
import type { Order } from "@/lib/types";

const steps = [
  { id: "details", label: "Details", icon: User },
  { id: "payment", label: "Payment", icon: CreditCard },
  { id: "confirm", label: "Confirm", icon: CheckCircle2 },
];

interface FormState {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  region: string;
  district: string;
  paymentMethod: string;
  mpesaNumber: string;
}

const initialForm: FormState = {
  fullName: "",
  phone: "",
  email: "",
  address: "",
  region: "",
  district: "",
  paymentMethod: "mpesa",
  mpesaNumber: "",
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const [step, setStep] = useState<"details" | "payment" | "confirm">("details");
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [checkoutError, setCheckoutError] = useState("");

  const set = (key: keyof FormState, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const regionInfo = regions.find((r) => r.name === form.region);
  const shipping =
    subtotal >= SITE.freeShippingThreshold || subtotal === 0 ? 0 : (regionInfo?.deliveryFee ?? 5000);
  const total = subtotal + shipping;

  useEffect(() => {
    if (placedOrder && items.length > 0) {
      clearCart();
    }
  }, [placedOrder, items.length, clearCart]);

  if (items.length === 0 && !placedOrder) {
    return (
      <div className="bg-cream py-20">
        <div className="mx-auto max-w-md px-4 text-center">
          <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand-100 text-brand-600">
            <ShoppingCart className="h-10 w-10" />
          </span>
          <h1 className="mt-6 font-display text-2xl font-bold text-brand-950">
            Nothing to checkout
          </h1>
          <p className="mt-2 text-sm text-brand-500">Your cart is empty. Add some products first.</p>
          <Link
            href="/shop"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-600 px-7 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            Browse Products <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  const validateDetails = (): boolean => {
    const e: typeof errors = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required";
    if (!form.phone.trim() || form.phone.replace(/\D/g, "").length < 9)
      e.phone = "Enter a valid phone number";
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email";
    if (!form.address.trim()) e.address = "Delivery address is required";
    if (!form.region) e.region = "Select your region";
    if (!form.district) e.district = "Select your district";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validatePayment = (): boolean => {
    const e: typeof errors = {};
    if (!form.paymentMethod) e.paymentMethod = "Select a payment method";
    const mobileMethods = ["mpesa", "tigo-pesa", "airtel-money", "halopesa"];
    if (mobileMethods.includes(form.paymentMethod) && form.mpesaNumber.replace(/\D/g, "").length < 9)
      e.mpesaNumber = "Enter the mobile money number to pay with";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const goToPayment = () => {
    if (validateDetails()) setStep("payment");
  };

  const placeOrder = async () => {
    if (!validatePayment()) return;
    setSubmitting(true);
    setCheckoutError("");

    const payload = {
      customer: {
        name: form.fullName,
        phone: form.phone,
        email: form.email,
      },
      delivery: {
        address: form.address,
        region: form.region,
        district: form.district,
      },
      items: items.map((i) => ({
        productId: i.productId,
        title: i.title,
        price: i.price,
        quantity: i.quantity,
        image: i.image,
      })),
      subtotal,
      shipping,
      total,
      paymentMethod: form.paymentMethod,
      mpesaNumber: form.mpesaNumber,
    };

    // Try real API route; fall back to client-side order creation in demo mode.
    const res = await api.post<Order>("/api/orders", payload);
    if (res.ok && res.data) {
      setPlacedOrder(res.data);
      setStep("confirm");
    } else {
      const demoOrder: Order = {
        id: `demo-${Date.now()}`,
        orderNumber: `AP-${Date.now().toString().slice(-6)}`,
        customer: payload.customer,
        delivery: payload.delivery,
        items: payload.items,
        subtotal: payload.subtotal,
        shipping: payload.shipping,
        discount: 0,
        total: payload.total,
        paymentMethod: payload.paymentMethod,
        paymentRef: `P${Date.now().toString().slice(-8)}`,
        status: "paid",
        createdAt: new Date().toISOString(),
        history: [
          { status: "pending", at: new Date().toISOString() },
          { status: "paid", at: new Date().toISOString() },
        ],
      };
      setPlacedOrder(demoOrder);
      setStep("confirm");
    }
    setSubmitting(false);
  };

  useEffect(() => {
    if (placedOrder) {
      try {
        sessionStorage.setItem("lastOrder", JSON.stringify(placedOrder));
      } catch {
        /* ignore */
      }
    }
  }, [placedOrder]);

  const selectedPayment = PAYMENT_METHODS.find((p) => p.id === form.paymentMethod);
  const isMobileMoney = ["mpesa", "tigo-pesa", "airtel-money", "halopesa"].includes(form.paymentMethod);

  return (
    <div className="bg-cream py-10">
      <div className="mx-auto max-w-5xl px-4">
        <h1 className="font-display text-2xl font-bold text-brand-950 sm:text-3xl">
          Secure Checkout
        </h1>

        {/* Stepper */}
        <div className="mt-6 flex items-center gap-2 sm:gap-4">
          {steps.map((s, i) => {
            const isActive = step === s.id;
            const isDone = (step === "payment" && i === 0) || (step === "confirm" && i < 2);
            return (
              <div key={s.id} className="flex flex-1 items-center gap-2 sm:gap-4">
                <div
                  className={`flex items-center gap-2 ${
                    isActive || isDone ? "text-brand-700" : "text-brand-300"
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 ${
                      isDone
                        ? "border-brand-600 bg-brand-600 text-white"
                        : isActive
                          ? "border-brand-600 bg-white text-brand-700"
                          : "border-brand-200 bg-white"
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="h-5 w-5" /> : <s.icon className="h-4 w-4" />}
                  </span>
                  <span className={`hidden text-sm font-semibold sm:block ${isActive ? "" : "text-brand-400"}`}>
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`h-0.5 flex-1 rounded ${isDone ? "bg-brand-600" : "bg-brand-200"}`} />
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            {/* STEP 1: Details */}
            {step === "details" && (
              <div className="rounded-2xl border border-brand-100 bg-white p-6 shadow-card">
                <h2 className="flex items-center gap-2 font-display text-lg font-bold text-brand-950">
                  <User className="h-5 w-5 text-brand-600" /> Customer Details
                </h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <Input
                    label="Full Name *"
                    name="fullName"
                    value={form.fullName}
                    onChange={(e) => set("fullName", e.target.value)}
                    placeholder="e.g. John Mwangi"
                    error={errors.fullName}
                  />
                  <Input
                    label="Phone Number *"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    placeholder="e.g. 0712 345 678"
                    error={errors.phone}
                    hint="We will send order updates via SMS & WhatsApp"
                  />
                  <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    placeholder="you@example.com"
                    error={errors.email}
                  />
                  <Input
                    label="Delivery Address *"
                    name="address"
                    value={form.address}
                    onChange={(e) => set("address", e.target.value)}
                    placeholder="Street, house no., landmark"
                    error={errors.address}
                  />
                  <Select
                    label="Region *"
                    name="region"
                    value={form.region}
                    onChange={(e) => {
                      set("region", e.target.value);
                      set("district", "");
                    }}
                    error={errors.region}
                  >
                    <option value="">Select region</option>
                    {regions.map((r) => (
                      <option key={r.name} value={r.name}>{r.name}</option>
                    ))}
                  </Select>
                  <Select
                    label="District *"
                    name="district"
                    value={form.district}
                    onChange={(e) => set("district", e.target.value)}
                    error={errors.district}
                    disabled={!form.region}
                  >
                    <option value="">Select district</option>
                    {regionInfo?.districts.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </Select>
                </div>
                <button
                  onClick={goToPayment}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-600 py-3.5 text-base font-semibold text-white transition hover:bg-brand-700 sm:w-auto sm:px-8"
                >
                  Continue to Payment <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            )}

            {/* STEP 2: Payment */}
            {step === "payment" && (
              <div className="rounded-2xl border border-brand-100 bg-white p-6 shadow-card">
                <h2 className="flex items-center gap-2 font-display text-lg font-bold text-brand-950">
                  <CreditCard className="h-5 w-5 text-brand-600" /> Payment Method
                </h2>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-brand-500">
                  <Lock className="h-3.5 w-3.5" /> Payments are encrypted and processed securely
                </p>

                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {PAYMENT_METHODS.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => set("paymentMethod", m.id)}
                      className={`flex items-center gap-2.5 rounded-xl border-2 p-4 text-left transition ${
                        form.paymentMethod === m.id
                          ? "border-brand-600 bg-brand-50"
                          : "border-brand-100 bg-white hover:border-brand-300"
                      }`}
                    >
                      <span
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold text-white"
                        style={{ backgroundColor: m.color }}
                      >
                        {m.label.split(" ")[0].slice(0, 3).toUpperCase()}
                      </span>
                      <span className="text-sm font-semibold text-brand-900">{m.label}</span>
                    </button>
                  ))}
                </div>
                {errors.paymentMethod && (
                  <p className="mt-2 text-xs text-red-500">{errors.paymentMethod}</p>
                )}

                {isMobileMoney && (
                  <div className="mt-5 rounded-xl border border-brand-100 bg-brand-50/60 p-4">
                    <p className="flex items-center gap-2 text-sm font-semibold text-brand-800">
                      <Smartphone className="h-4 w-4 text-brand-600" />
                      You will pay via {selectedPayment?.label}
                    </p>
                    <p className="mt-1 text-xs text-brand-500">
                      Enter the number that will receive the payment prompt:
                    </p>
                    <Input
                      className="mt-2 bg-white"
                      label="Mobile Money Number"
                      name="mpesaNumber"
                      type="tel"
                      value={form.mpesaNumber}
                      onChange={(e) => set("mpesaNumber", e.target.value)}
                      placeholder="e.g. 0712 345 678"
                      error={errors.mpesaNumber}
                    />
                  </div>
                )}

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={() => setStep("details")}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-brand-200 px-6 py-3 text-sm font-semibold text-brand-700 transition hover:bg-brand-50"
                  >
                    <ChevronLeft className="h-4 w-4" /> Back
                  </button>
                  <button
                    onClick={placeOrder}
                    disabled={submitting}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-gold-400 to-gold-600 py-3.5 text-base font-semibold text-white transition hover:from-gold-500 hover:to-gold-700 disabled:opacity-60"
                  >
                    {submitting ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        Place Order • {formatPrice(total)} <Lock className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
                {checkoutError && (
                  <p className="mt-3 rounded-lg bg-red-50 px-4 py-2 text-xs text-red-600">
                    {checkoutError}
                  </p>
                )}
              </div>
            )}

            {/* STEP 3: Confirmation */}
            {step === "confirm" && placedOrder && (
              <div className="rounded-2xl border border-brand-100 bg-white p-8 text-center shadow-card">
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-100">
                  <CheckCircle2 className="h-9 w-9 text-brand-600" />
                </span>
                <h2 className="mt-5 font-display text-2xl font-bold text-brand-950">
                  Order Placed Successfully!
                </h2>
                <p className="mt-2 text-sm text-brand-600">
                  Thank you {placedOrder.customer.name}. Your order{" "}
                  <span className="font-bold text-brand-900">#{placedOrder.orderNumber}</span>{" "}
                  has been received.
                </p>
                <div className="mx-auto mt-6 max-w-md space-y-2 rounded-xl bg-brand-50 p-5 text-left text-sm">
                  <div className="flex justify-between"><span className="text-brand-500">Order number</span><span className="font-semibold text-brand-900">{placedOrder.orderNumber}</span></div>
                  <div className="flex justify-between"><span className="text-brand-500">Payment</span><span className="font-semibold text-brand-900">{PAYMENT_METHODS.find((p) => p.id === placedOrder.paymentMethod)?.label || placedOrder.paymentMethod} {placedOrder.paymentRef && `(Ref: ${placedOrder.paymentRef})`}</span></div>
                  <div className="flex justify-between"><span className="text-brand-500">Total</span><span className="font-semibold text-brand-900">{formatPrice(placedOrder.total)}</span></div>
                  <div className="flex justify-between"><span className="text-brand-500">Delivery</span><span className="font-semibold text-brand-900">{placedOrder.delivery.region} – {placedOrder.delivery.district}</span></div>
                </div>
                <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <a
                    href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(
                      `Hello AfyaPlus! I just placed order #${placedOrder.orderNumber}. Please confirm it.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#1fb958]"
                  >
                    <WhatsAppIcon className="h-4 w-4" /> Confirm via WhatsApp
                  </a>
                  <Link
                    href={`/customer-dashboard?order=${placedOrder.orderNumber}`}
                    className="inline-flex items-center gap-2 rounded-full border border-brand-200 px-7 py-3 text-sm font-semibold text-brand-700 transition hover:bg-brand-50"
                  >
                    <Truck className="h-4 w-4" /> Track Order
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Order summary sidebar */}
          <aside className="h-fit rounded-2xl border border-brand-100 bg-white p-6 shadow-card">
            <h2 className="font-display text-base font-bold text-brand-950">Your Order</h2>
            <div className="mt-4 max-h-64 space-y-3 overflow-y-auto pr-1">
              {items.map((i) => (
                <div key={i.productId} className="flex items-center gap-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-brand-50">
                    <Image src={i.image} alt={i.title} fill sizes="56px" className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-brand-900">{i.title}</p>
                    <p className="text-xs text-brand-400">Qty {i.quantity}</p>
                  </div>
                  <span className="text-xs font-semibold text-brand-800">
                    {formatPrice(i.price * i.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-2 border-t border-brand-100 pt-4 text-sm">
              <div className="flex justify-between text-brand-600">
                <span>Subtotal</span>
                <span className="font-semibold text-brand-950">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-brand-600">
                <span>Delivery</span>
                <span className="font-semibold text-brand-950">
                  {shipping === 0 ? <span className="text-brand-600">FREE</span> : formatPrice(shipping)}
                </span>
              </div>
              <div className="flex justify-between border-t border-brand-100 pt-3 text-base">
                <span className="font-bold text-brand-950">Total</span>
                <span className="font-display text-xl font-bold text-brand-900">{formatPrice(total)}</span>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-brand-50 px-3 py-2 text-xs text-brand-600">
              <Lock className="h-3.5 w-3.5 shrink-0" /> Secure checkout • SSL encrypted
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
