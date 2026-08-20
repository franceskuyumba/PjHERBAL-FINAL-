"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckCircle2, Clock3, XCircle } from "lucide-react";

export default function PaymentSuccessPage() {
  const params = useSearchParams();
  const orderNumber = params.get("reference") || params.get("orderNumber") || "";
  const [status, setStatus] = useState<"loading" | "SUCCESS" | "PENDING" | "FAILED">("loading");

  useEffect(() => {
    if (!orderNumber) {
      setStatus("FAILED");
      return;
    }
    fetch(`/api/payments/verify?orderNumber=${encodeURIComponent(orderNumber)}`)
      .then((response) => response.json())
      .then((data) => setStatus(data.status === "SUCCESS" ? "SUCCESS" : data.status === "FAILED" ? "FAILED" : "PENDING"))
      .catch(() => setStatus("PENDING"));
  }, [orderNumber]);

  const content = {
    loading: { icon: <Clock3 className="h-10 w-10 animate-pulse" />, title: "Verifying your payment", text: "Please wait while we confirm the payment with your provider." },
    SUCCESS: { icon: <CheckCircle2 className="h-10 w-10" />, title: "Payment confirmed", text: "Your order has been confirmed successfully." },
    PENDING: { icon: <Clock3 className="h-10 w-10" />, title: "Payment is pending", text: "We received your order and will update it when the provider confirms payment." },
    FAILED: { icon: <XCircle className="h-10 w-10" />, title: "Payment could not be confirmed", text: "Please contact customer care with your order number." },
  }[status];

  return (
    <div className="min-h-[60vh] bg-cream px-4 py-16">
      <div className="mx-auto max-w-lg rounded-2xl border border-ink/5 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand-50 text-brand-700">{content.icon}</div>
        <h1 className="mt-5 font-display text-2xl font-bold text-brand-950">{content.title}</h1>
        <p className="mt-2 text-sm text-ink/60">{content.text}</p>
        {orderNumber && <p className="mt-4 font-mono text-sm font-semibold text-brand-700">{orderNumber}</p>}
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link href="/customer-dashboard/orders" className="btn-primary btn-md flex-1">View my orders</Link>
          <Link href="/shop" className="btn-outline btn-md flex-1">Continue shopping</Link>
        </div>
      </div>
    </div>
  );
}
