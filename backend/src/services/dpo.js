/**
 * DPO (Direct Pay Online / 3G DirectPay) integration.
 * Reference: https://directpayonline.readme.io
 */

import { parseStringPromise } from "xml2js";

function buildRequest(service, body) {
  return `<?xml version="1.0" encoding="utf-8"?>
<API3G>
  <CompanyToken>${process.env.DPO_TOKEN || ""}</CompanyToken>
  <Request>${service}</Request>
  ${body}
</API3G>`;
}

export async function createToken({ amount, reference, customerEmail, customerName }) {
  const token = process.env.DPO_TOKEN;
  if (!token) {
    throw Object.assign(new Error("DPO credentials not configured"), { status: 503 });
  }

  const xml = buildRequest(
    "createToken",
    `<TransactionType>1</TransactionType>
    <TransactionAmount>${amount}</TransactionAmount>
    <TransactionCurrency>USD</TransactionCurrency>
    <CustomerEmail>${customerEmail || "customer@afyaplus.co.tz"}</CustomerEmail>
    <CustomerName>${customerName || "AfyaPlus Customer"}</CustomerName>
    <Reference>${reference}</Reference>
    <PaymentDescription>AfyaPlus order ${reference}</PaymentDescription>`
  );

  const res = await fetch(`${process.env.DPO_BASE_URL || "https://secure.3gdirectpay.com"}/API/v6/`, {
    method: "POST",
    headers: { "Content-Type": "text/xml" },
    body: xml,
  });

  if (!res.ok) throw Object.assign(new Error(`DPO API error: ${res.status}`), { status: 502 });

  const parsed = await parseStringPromise(await res.text());
  const result = parsed?.API3G?.Result?.[0];
  if (result !== "000") {
    throw Object.assign(new Error(`DPO error: ${result}`), { status: 502 });
  }
  return { token: parsed?.API3G?.TransToken?.[0], reference };
}

export async function verifyPayment(token) {
  const dpoToken = process.env.DPO_TOKEN;
  if (!dpoToken) return { status: "failed" };

  const xml = buildRequest("verifyToken", `<TransToken>${token}</TransToken>`);
  const res = await fetch(`${process.env.DPO_BASE_URL || "https://secure.3gdirectpay.com"}/API/v6/`, {
    method: "POST",
    headers: { "Content-Type": "text/xml" },
    body: xml,
  });

  if (!res.ok) return { status: "failed" };
  const parsed = await parseStringPromise(await res.text());
  const result = parsed?.API3G?.Result?.[0];
  return { status: result === "000" ? "success" : "failed", token };
}
