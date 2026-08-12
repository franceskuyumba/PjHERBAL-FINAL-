import type { PaymentAdapter, PaymentOrder, InitiateResult, VerifyResult } from "./types";

const BASE_URL = process.env.DPO_BASE_URL || "https://secure.3gdirectpay.com/API/v6/";
const COMPANY_TOKEN = process.env.DPO_COMPANY_TOKEN;
const SERVICE_TYPE = process.env.DPO_SERVICE_TYPE || "";

/**
 * DPO Pay (Direct Pay Online) payment gateway adapter.
 * Requires DPO_COMPANY_TOKEN in .env.
 */
export const dpoAdapter: PaymentAdapter = {
  id: "DPO",
  name: "DPO Pay",
  async initiate(order: PaymentOrder, method: string): Promise<InitiateResult> {
    if (!COMPANY_TOKEN) {
      throw new Error("DPO is not configured. Add DPO_COMPANY_TOKEN to .env");
    }

    const paymentAmount = order.total.toString();
    const form = new URLSearchParams({
      CompanyToken: COMPANY_TOKEN,
      Services: SERVICE_TYPE,
      PaymentAmount: paymentAmount,
      PaymentCurrency: order.currency,
      CompanyRef: order.orderNumber,
      RedirectURL: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?reference=${order.orderNumber}`,
      BackURL: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout?cancel=1`,
      customer_email: order.customerEmail,
      customer_phone: order.customerPhone.replace(/\D/g, ""),
    });

    const response = await fetch(`${BASE_URL}TokeniseDirectCard`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form.toString(),
    });

    if (!response.ok) {
      throw new Error(`DPO request failed (${response.status})`);
    }

    const text = await response.text();
    const match = /TransToken\s*=\s*([^\r\n]+)/i.exec(text);
    const token = match?.[1]?.trim();

    if (!token) {
      throw new Error("DPO did not return a transaction token");
    }

    return {
      provider: "DPO",
      reference: token,
      status: "PENDING",
      redirectUrl: `https://secure.3gdirectpay.com/payv2.php?ID=${token}`,
    };
  },

  async verify(reference: string): Promise<VerifyResult> {
    if (!COMPANY_TOKEN) return { status: "PENDING", provider: "DPO" };

    const form = new URLSearchParams({
      CompanyToken: COMPANY_TOKEN,
      TransToken: reference,
    });

    const response = await fetch(`${BASE_URL}QueryToken`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form.toString(),
    });

    if (!response.ok) return { status: "PENDING", provider: "DPO" };

    const text = await response.text();
    const approved = /Approved\s*=\s*Yes/i.test(text);
    return { status: approved ? "SUCCESS" : "PENDING", provider: "DPO" };
  },
};
