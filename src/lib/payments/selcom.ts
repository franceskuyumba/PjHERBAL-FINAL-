import type { PaymentAdapter, PaymentOrder, InitiateResult, VerifyResult } from "./types";

const BASE_URL = process.env.SELCOM_BASE_URL || "https://apigw.selcommobile.com";
const API_KEY = process.env.SELCOM_API_KEY;
const API_SECRET = process.env.SELCOM_API_SECRET;
const MERCHANT_ID = process.env.SELCOM_MERCHANT_ID;

function token(): string {
  return Buffer.from(`${API_KEY}:${API_SECRET}`).toString("base64");
}

/**
 * Selcom Mobile (Tanzania) payment gateway adapter.
 * Requires SELCOM_API_KEY, SELCOM_API_SECRET and SELCOM_MERCHANT_ID in .env.
 */
export const selcomAdapter: PaymentAdapter = {
  id: "SELCOM",
  name: "Selcom",
  async initiate(order: PaymentOrder, method: string): Promise<InitiateResult> {
    if (!API_KEY || !API_SECRET || !MERCHANT_ID) {
      throw new Error("Selcom is not configured. Add SELCOM_API_KEY, SELCOM_API_SECRET and SELCOM_MERCHANT_ID to .env");
    }

    const payload = {
      vendor: MERCHANT_ID,
      order_id: order.orderNumber,
      amount: order.total,
      currency: order.currency,
      buyer_name: order.customerName,
      buyer_email: order.customerEmail,
      buyer_phone: order.customerPhone.replace(/\D/g, ""),
      payment_method: method,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout?cancel=1`,
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?reference={ORDER_ID}`,
    };

    const response = await fetch(`${BASE_URL}/v1/checkout/create-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token()}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Selcom request failed (${response.status})`);
    }

    const data = (await response.json()) as {
      result?: { order_id?: string; redirect_url?: string };
    };

    return {
      provider: "SELCOM",
      reference: data.result?.order_id || order.orderNumber,
      status: "PENDING",
      redirectUrl: data.result?.redirect_url,
    };
  },

  async verify(reference: string): Promise<VerifyResult> {
    const response = await fetch(`${BASE_URL}/v1/checkout/order-status/${reference}`, {
      headers: { Authorization: `Bearer ${token()}` },
    });
    if (!response.ok) return { status: "PENDING", provider: "SELCOM" };

    const data = (await response.json()) as { result?: { status?: string } };
    const status = data.result?.status;
    const success = status === "PAID" || status === "COMPLETED" || status === "SUCCESS";
    return { status: success ? "SUCCESS" : "PENDING", provider: "SELCOM" };
  },
};
