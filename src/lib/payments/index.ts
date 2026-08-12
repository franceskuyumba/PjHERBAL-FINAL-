import type { PaymentAdapter, InitiateResult, VerifyResult, PaymentOrder } from "./types";
import { manualAdapter } from "./manual";
import { selcomAdapter } from "./selcom";
import { flutterwaveAdapter } from "./flutterwave";
import { dpoAdapter } from "./dpo";

export type { PaymentAdapter, InitiateResult, VerifyResult, PaymentOrder } from "./types";

const adapters: Record<string, PaymentAdapter> = {
  MANUAL: manualAdapter,
  SELCOM: selcomAdapter,
  FLUTTERWAVE: flutterwaveAdapter,
  DPO: dpoAdapter,
};

/**
 * Returns the active payment adapter based on PAYMENT_PROVIDER (.env).
 * Defaults to MANUAL so the store works without any gateway credentials.
 */
export function getPaymentProvider(): PaymentAdapter {
  const provider = (process.env.PAYMENT_PROVIDER || "manual").toUpperCase();
  return adapters[provider] || manualAdapter;
}

export function listPaymentProviders(): PaymentAdapter[] {
  return Object.values(adapters);
}

export async function initiatePayment(order: PaymentOrder, method: string): Promise<InitiateResult> {
  return getPaymentProvider().initiate(order, method);
}

export async function verifyPayment(reference: string): Promise<VerifyResult> {
  return getPaymentProvider().verify(reference);
}
