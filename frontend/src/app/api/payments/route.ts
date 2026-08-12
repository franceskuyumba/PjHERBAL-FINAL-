import { NextRequest, NextResponse } from "next/server";

/**
 * Payment initiation + verification.
 *
 * In production, enable one provider by configuring its credentials:
 *   - Selcom API:   process.env.SELCOM_API_KEY / SELCOM_API_SECRET / SELCOM_BASE_URL
 *   - Flutterwave:  process.env.FLUTTERWAVE_SECRET_KEY
 *   - DPO:          process.env.DPO_TOKEN
 *
 * Demo mode returns a mock payment reference so the checkout flow is fully testable.
 */

const MOBILE_MONEY = ["mpesa", "tigo-pesa", "airtel-money", "halopesa"];

export async function POST(req: NextRequest) {
  const { amount, method, phone, orderNumber } = await req.json();

  if (!amount || amount <= 0) {
    return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
  }
  if (!method) {
    return NextResponse.json({ error: "Payment method is required" }, { status: 400 });
  }
  if (MOBILE_MONEY.includes(method) && !phone) {
    return NextResponse.json({ error: "Mobile money number required" }, { status: 400 });
  }

  // Production integrations would live here (see backend/src/services/*.js)
  if (process.env.SELCOM_API_KEY) {
    // return await initSelcomPayment(...)
  }
  if (process.env.FLUTTERWAVE_SECRET_KEY) {
    // return await initFlutterwavePayment(...)
  }

  // Demo mode
  const reference = `PAY-${Date.now().toString().slice(-8)}${Math.floor(Math.random() * 100)}`;
  console.log(
    `[Payment DEMO] ${method.toUpperCase()} ${amount} TZS (order ${orderNumber}) → ref ${reference}`
  );

  return NextResponse.json({
    success: true,
    reference,
    status: "success",
    message: "Payment processed successfully (demo mode)",
  });
}
