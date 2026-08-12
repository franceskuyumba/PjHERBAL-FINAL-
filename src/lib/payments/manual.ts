import type { PaymentAdapter, PaymentOrder, InitiateResult, VerifyResult } from "./types";

/**
 * MANUAL payment provider.
 * The customer pays via mobile money or bank transfer to the clinic's
 * registered accounts and confirms on WhatsApp. No gateway credentials
 * are required, so the store works out of the box.
 * Swap to SELCOM / FLUTTERWAVE / DPO in production for automated payments.
 */
export const manualAdapter: PaymentAdapter = {
  id: "MANUAL",
  name: "Confirm via WhatsApp",
  async initiate(order: PaymentOrder, method: string): Promise<InitiateResult> {
    const instructions = [
      `Pay TZS ${order.total.toLocaleString()} to the PJHERBAL Clinic ${method} account.`,
      `After paying, send the payment confirmation and your order number (${order.orderNumber}) to us on WhatsApp.`,
      `Our team will confirm your payment and dispatch your order.`,
    ];
    return {
      provider: "MANUAL",
      reference: `MAN-${order.orderNumber}`,
      status: "PENDING",
      instructions,
    };
  },
  async verify(reference: string): Promise<VerifyResult> {
    // For manual payments, verification is completed by staff via the admin panel.
    return { status: "PENDING", provider: "MANUAL" };
  },
};
