import type { PaymentAdapter, PaymentOrder, InitiateResult, VerifyResult } from "./types";

const BASE_URL = process.env.FLUTTERWAVE_BASE_URL || "https://api.flutterwave.com/v3";
const SECRET_KEY = process.env.FLUTTERWAVE_SECRET_KEY;

/**
 * Flutterwave payment gateway adapter (supports M-Pesa and other mobile money).
 * Requires FLUTTERWAVE_SECRET_KEY and FLUTTERWAVE_PUBLIC_KEY in .env.
 */
export const flutterwaveAdapter: PaymentAdapter = {
  id: "FLUTTERWAVE",
  name: "Flutterwave",
  async initiate(order: PaymentOrder, method: string): Promise<InitiateResult> {
    if (!SECRET_KEY) {
      throw new Error("Flutterwave is not configured. Add FLUTTERWAVE_SECRET_KEY to .env");
    }

    const payload = {
      tx_ref: order.orderNumber,
      amount: order.total,
      currency: order.currency,
      payment_options: method,
      redirect_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?reference=${order.orderNumber}`,
      customer: {
        email: order.customerEmail,
        name: order.customerName,
        phone_number: order.customerPhone.replace(/\D/g, ""),
      },
      customizations: {
        title: "PJHERBAL Clinic",
        description: `Order ${order.orderNumber}`,
      },
    };

    const response = await fetch(`${BASE_URL}/payments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SECRET_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Flutterwave request failed (${response.status})`);
    }

    const data = (await response.json()) as {
      data?: { link?: string; id?: number };
      status?: string;
    };

    if (data.status !== "success") {
      throw new Error("Flutterwave could not create the payment");
    }

    return {
      provider: "FLUTTERWAVE",
      reference: String(data.data?.id || order.orderNumber),
      status: "PENDING",
      redirectUrl: data.data?.link,
    };
  },

  async verify(reference: string): Promise<VerifyResult> {
    if (!SECRET_KEY) return { status: "PENDING", provider: "FLUTTERWAVE" };

    const response = await fetch(`${BASE_URL}/transactions/${reference}/verify`, {
      headers: { Authorization: `Bearer ${SECRET_KEY}` },
    });
    if (!response.ok) return { status: "PENDING", provider: "FLUTTERWAVE" };

    const data = (await response.json()) as {
      data?: { status?: string };
      status?: string;
    };

    const status = data.data?.status || data.status;
    const success = status === "successful" || status === "success";
    return { status: success ? "SUCCESS" : "PENDING", provider: "FLUTTERWAVE" };
  },
};
