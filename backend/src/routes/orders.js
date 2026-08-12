import { Router } from "express";
import { query, transaction } from "../db.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/error.js";
import { sendSms } from "../services/sms.js";

const router = Router();

function generateOrderNumber() {
  return `AP-${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 90 + 10)}`;
}

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const result = await query(
      `SELECT * FROM orders ORDER BY created_at DESC LIMIT 100`
    );
    res.json({ orders: result.rows });
  })
);

router.get(
  "/:orderNumber",
  asyncHandler(async (req, res) => {
    const result = await query("SELECT * FROM orders WHERE order_number = $1", [
      req.params.orderNumber,
    ]);
    if (!result.rows[0]) return res.status(404).json({ error: "Order not found" });
    const items = await query("SELECT * FROM order_items WHERE order_id = $1", [
      result.rows[0].id,
    ]);
    res.json({ order: { ...result.rows[0], items: items.rows } });
  })
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { customer, delivery, items, paymentMethod, paymentRef } = req.body;

    if (!customer?.name || !customer?.phone || !delivery?.region || !delivery?.address) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    const order = await transaction(async (client) => {
      const subtotal = items.reduce((s, i) => s + Number(i.price) * Number(i.quantity), 0);
      const shipping = Number(req.body.shipping) || 0;
      const discount = Number(req.body.discount) || 0;
      const total = subtotal + shipping - discount;

      const inserted = await client.query(
        `INSERT INTO orders (order_number, customer_name, customer_phone, customer_email,
          address, region, district, subtotal, shipping, discount, total, payment_method, payment_ref, status)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,'paid')
         RETURNING *`,
        [
          generateOrderNumber(),
          customer.name,
          customer.phone,
          customer.email || null,
          delivery.address,
          delivery.region,
          delivery.district || null,
          subtotal,
          shipping,
          discount,
          total,
          paymentMethod || "mpesa",
          paymentRef || null,
        ]
      );
      const orderRow = inserted.rows[0];

      for (const item of items) {
        await client.query(
          `INSERT INTO order_items (order_id, product_id, product_title, unit_price, quantity, image)
           VALUES ($1,$2,$3,$4,$5,$6)`,
          [orderRow.id, item.productId || null, item.title, item.price, item.quantity, item.image || null]
        );
        // Decrement stock
        if (item.productId) {
          await client.query(
            "UPDATE products SET stock = GREATEST(0, stock - $1) WHERE id = $2",
            [item.quantity, item.productId]
          );
        }
      }

      await client.query(
        `INSERT INTO order_history (order_id, status) VALUES ($1,'paid')`,
        [orderRow.id]
      );

      return orderRow;
    });

    // Notify customer via SMS (optional provider)
    try {
      await sendSms(
        customer.phone,
        `AfyaPlus: Order ${order.order_number} received (${order.total} TZS). We will update you on delivery.`
      );
    } catch {
      /* non-blocking */
    }

    res.status(201).json({ order });
  })
);

router.patch(
  "/:id/status",
  requireAuth,
  asyncHandler(async (req, res) => {
    const { status } = req.body;
    const valid = ["pending", "paid", "processing", "dispatched", "delivered", "cancelled"];
    if (!valid.includes(status)) return res.status(400).json({ error: "Invalid status" });

    const result = await transaction(async (client) => {
      const updated = await client.query(
        "UPDATE orders SET status = $1, updated_at = now() WHERE id = $2 RETURNING *",
        [status, req.params.id]
      );
      if (!updated.rows[0]) return null;
      await client.query(
        "INSERT INTO order_history (order_id, status) VALUES ($1,$2)",
        [req.params.id, status]
      );
      return updated.rows[0];
    });

    if (!result) return res.status(404).json({ error: "Order not found" });

    // Notify customer of dispatch/delivery
    if (status === "dispatched" || status === "delivered") {
      try {
        await sendSms(
          result.customer_phone,
          status === "dispatched"
            ? `AfyaPlus: Order ${result.order_number} has been dispatched!`
            : `AfyaPlus: Order ${result.order_number} delivered. Enjoy your supplements!`
        );
      } catch {
        /* non-blocking */
      }
    }

    res.json({ order: result });
  })
);

export default router;
