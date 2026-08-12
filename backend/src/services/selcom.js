/**
 * Selcom / SelcomAPI integration (Tanzania mobile money aggregator).
 * Reference: https://developers.selcomapigw.com
 */

import { createHmac } from "crypto";

function sign(payload, secret) {
  return createHmac("sha256", secret)
    .update(JSON.stringify(payload))
    .digest("hex");
}

export async function initMobilePayment({ amount, msisdn, reference, description }) {
  const apiKey = process.env.SELCOM_API_KEY;
  const apiSecret = process.env.SELCOM_API_SECRET;
  const baseUrl = process.env.SELCOM_BASE_URL || "https://apicore.selcommobile.com";

  if (!apiKey || !apiSecret) {
    throw Object.assign(new Error("Selcom credentials not configured"), { status: 503 });
  }

  const payload = {
    vendor: apiKey,
    msisdn,
    amount: String(amount),
    reference,
    description: description || "AfyaPlus order payment",
    transid: `${Date.now()}`,
    currency: "TZS",
  };

  const signature = sign(payload, apiSecret);

  const res = await fetch(`${baseUrl}/v1/checkout/create-order`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `SELCOM ${apiKey}:${signature}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw Object.assign(new Error(`Selcom API error: ${res.status}`), { status: 502 });
  }

  const data = await res.json();
  return { reference: data.reference || data.data?.reference, status: data.status, data };
}

export async function verifyPayment(reference) {
  const apiKey = process.env.SELCOM_API_KEY;
  const apiSecret = process.env.SELCOM_API_SECRET;
  const baseUrl = process.env.SELCOM_BASE_URL || "https://apicore.selcommobile.com";

  const signature = sign({}, apiSecret);
  const res = await fetch(`${baseUrl}/v1/checkout/verify-payment/${reference}`, {
    method: "GET",
    headers: {
      Authorization: `SELCOM ${apiKey}:${signature}`,
    },
  });

  if (!res.ok) return { status: "failed" };
  const data = await res.json();
  return data;
}
