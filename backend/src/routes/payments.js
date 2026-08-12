import { Router } from "express";
import { query } from "../db.js";
import { asyncHandler } from "../middleware/error.js";
import * as selcom from "../services/selcom.js";
import * as flutterwave from "../services/flutterwave.js";

const router = Router();

// Initiate a payment
router.post(
  "/initiate",
  asyncHandler(async (req, res) => {
    const { amount, method, phone, email, orderNumber } = req.body;

    if (!amount || amount <= 0) return res.status(400).json({ error: "Invalid amount" });

    let result;
    let provider = "demo";

    if (process.env.SELCOM_API_KEY) {
      provider = "selcom";
      result = await selcom.initMobilePayment({
        amount,
        msisdn: phone,
        reference: orderNumber,
        description: `AfyaPlus order ${orderNumber}`,
      });
    } else if (process.env.FLUTTERWAVE_SECRET_KEY) {
      provider = "flutterwave";
      result = await flutterwave.initCardPayment({
        amount,
        email,
        phone,
        reference: orderNumber,
        redirectUrl: `${req.protocol}://${req.get("host")}/order-success`,
      });
    } else {
      // Demo mode
      result = { reference: `PAY-${Date.now().toString().slice(-8)}`, status: "success" };
    }

    await query(
      `INSERT INTO payment_logs (order_id, provider, reference, amount, status, payload)
       VALUES ($1,$2,$3,$4,$5,$6)`,
      [null, provider, result.reference, amount, result.status || "initiated", JSON.stringify(result)]
    );

    res.json({ success: true, provider, ...result });
  })
);

// Verify a payment
router.post(
  "/verify",
  asyncHandler(async (req, res) => {
    const { provider, reference } = req.body;
    let status = "success";
    let data = null;

    if (provider === "selcom" && process.env.SELCOM_API_KEY) {
      data = await selcom.verifyPayment(reference);
      status = data.status === "success" ? "success" : "failed";
    } else if (provider === "flutterwave" && process.env.FLUTTERWAVE_SECRET_KEY) {
      data = await flutterwave.verifyPayment(reference);
      status = data.status === "success" ? "success" : "failed";
    } else {
      // Demo mode auto-verifies
      status = "success";
      data = { reference, status: "success", demo: true };
    }

    await query(
      `UPDATE payment_logs SET status = $1, payload = $2 WHERE reference = $3`,
      [status, JSON.stringify(data), reference]
    );

    res.json({ status, verified: status === "success", data });
  })
);

export default router;
