/**
 * Flutterwave integration (cards, mobile money, banks).
 * Reference: https://developer.flutterwave.com/docs
 */

export async function initCardPayment({ amount, email, phone, name, reference, redirectUrl }) {
  const secret = process.env.FLUTTERWAVE_SECRET_KEY;
  if (!secret) {
    throw Object.assign(new Error("Flutterwave credentials not configured"), { status: 503 });
  }

  const res = await fetch("https://api.flutterwave.com/v3/payments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${secret}`,
    },
    body: JSON.stringify({
      tx_ref: reference,
      amount: String(amount),
      currency: "TZS",
      redirect_url: redirectUrl,
      customer: { email, phone_number: phone, name },
      customizations: {
        title: "AfyaPlus",
        description: "Premium supplements order",
      },
    }),
  });

  const data = await res.json();
  if (data.status !== "success") {
    throw Object.assign(new Error(data.message || "Flutterwave error"), { status: 502 });
  }
  return data.data;
}

export async function verifyPayment(transactionId) {
  const secret = process.env.FLUTTERWAVE_SECRET_KEY;
  const res = await fetch(`https://api.flutterwave.com/v3/transactions/${transactionId}/verify`, {
    headers: { Authorization: `Bearer ${secret}` },
  });
  return res.json();
}
