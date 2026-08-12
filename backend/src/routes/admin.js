import { Router } from "express";
import { query } from "../db.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/error.js";

const router = Router();

router.use(requireAuth, requireAdmin);

router.get(
  "/stats",
  asyncHandler(async (_req, res) => {
    const revenue = await query(
      `SELECT COALESCE(SUM(total),0) AS revenue FROM orders WHERE status NOT IN ('cancelled')`
    );
    const orders = await query(`SELECT COUNT(*)::int AS n FROM orders`);
    const customers = await query(`SELECT COUNT(*)::int AS n FROM customers`);
    const lowStock = await query(
      `SELECT COUNT(*)::int AS n FROM products WHERE stock <= low_stock_threshold`
    );
    const recent = await query(
      `SELECT order_number, customer_name, total, status, created_at
       FROM orders ORDER BY created_at DESC LIMIT 10`
    );

    res.json({
      revenue: revenue.rows[0].revenue,
      orders: orders.rows[0].n,
      customers: customers.rows[0].n,
      lowStock: lowStock.rows[0].n,
      recentOrders: recent.rows,
    });
  })
);

router.get(
  "/orders",
  asyncHandler(async (_req, res) => {
    const result = await query("SELECT * FROM orders ORDER BY created_at DESC LIMIT 200");
    res.json({ orders: result.rows });
  })
);

router.post(
  "/products",
  asyncHandler(async (req, res) => {
    const { slug, title, price, category, stock, status = "active" } = req.body;
    if (!slug || !title || !price) return res.status(400).json({ error: "slug, title, price required" });

    const cat = await query("SELECT id FROM categories WHERE slug = $1", [category]);
    const result = await query(
      `INSERT INTO products (slug, title, price, category_id, stock, status)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [slug, title, price, cat.rows[0]?.id || null, stock || 0, status]
    );
    res.status(201).json({ product: result.rows[0] });
  })
);

router.patch(
  "/products/:id",
  asyncHandler(async (req, res) => {
    const fields = req.body;
    const allowed = ["title", "price", "stock", "status", "compare_at_price", "featured", "best_seller"];
    const sets = [];
    const params = [req.params.id];
    for (const key of allowed) {
      if (fields[key] !== undefined) {
        params.push(fields[key]);
        sets.push(`${key} = $${params.length}`);
      }
    }
    if (sets.length === 0) return res.status(400).json({ error: "No valid fields" });
    const result = await query(
      `UPDATE products SET ${sets.join(", ")}, updated_at = now() WHERE id = $1 RETURNING *`,
      params
    );
    if (!result.rows[0]) return res.status(404).json({ error: "Product not found" });
    res.json({ product: result.rows[0] });
  })
);

router.get(
  "/customers",
  asyncHandler(async (_req, res) => {
    const result = await query(
      `SELECT c.*, COUNT(o.id) AS order_count, COALESCE(SUM(o.total),0) AS total_spent
       FROM customers c
       LEFT JOIN orders o ON o.customer_id = c.id
       GROUP BY c.id ORDER BY total_spent DESC`
    );
    res.json({ customers: result.rows });
  })
);

router.get(
  "/analytics",
  asyncHandler(async (_req, res) => {
    const byStatus = await query(
      `SELECT status, COUNT(*)::int AS n FROM orders GROUP BY status`
    );
    const topProducts = await query(
      `SELECT p.title, SUM(oi.quantity) AS sold, SUM(oi.unit_price * oi.quantity) AS revenue
       FROM order_items oi JOIN products p ON p.id = oi.product_id
       GROUP BY p.title ORDER BY sold DESC LIMIT 10`
    );
    res.json({ byStatus: byStatus.rows, topProducts: topProducts.rows });
  })
);

export default router;
