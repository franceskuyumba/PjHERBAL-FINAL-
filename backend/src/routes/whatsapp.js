import { Router } from "express";
import { query } from "../db.js";
import { asyncHandler } from "../middleware/error.js";
import * as wa from "../services/whatsapp.js";

const router = Router();

// Webhook verification (GET) — WhatsApp Cloud API
router.get("/webhook", (req, res) => {
  const challenge = wa.verifyWebhook(
    req.query["hub.mode"],
    req.query["hub.verify_token"],
    req.query["hub.challenge"]
  );
  if (challenge) {
    res.status(200).send(challenge);
  } else {
    res.status(403).send("Verification failed");
  }
});

// Inbound messages (POST) — WhatsApp Cloud API
router.post("/webhook", async (req, res) => {
  const incoming = wa.parseInbound(req.body);
  if (!incoming) return res.status(200).json({ ok: true, ignored: true });

  // Simple auto-responder
  const text = incoming.text || "";
  let reply = "Thank you for contacting AfyaPlus! A specialist will reply shortly.";
  const lower = text.toLowerCase();
  if (lower.includes("menu")) {
    reply =
      "Menu:\n1. Products\n2. Prices\n3. Delivery\n4. Payment\n5. Track order\nReply with a number.";
  } else if (lower.includes("delivery")) {
    reply =
      "We deliver nationwide! Same-day in Dar es Salaam, 1-4 days upcountry. Free delivery on orders above 80,000 TZS.";
  } else if (lower.includes("payment") || lower.includes("mpesa")) {
    reply =
      "We accept M-Pesa, Tigo Pesa, Airtel Money, HaloPesa, CRDB and NMB. Pay securely at checkout.";
  }

  await wa.sendText(incoming.from, reply);
  res.status(200).json({ ok: true });
});

// Send a template message (internal/admin use)
router.post(
  "/send",
  asyncHandler(async (req, res) => {
    const { to, template, components } = req.body;
    if (!to || !template) return res.status(400).json({ error: "to and template required" });
    const result = await wa.sendTemplate(to, template, components || []);
    if (result.reason === "not_configured") {
      // Demo fallback
      console.log(`[WhatsApp DEMO → ${to}] template: ${template}`);
      return res.json({ ok: true, demo: true });
    }
    res.json({ ok: true, result });
  })
);

export default router;
