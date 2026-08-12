import { Router } from "express";
import { query } from "../db.js";
import { asyncHandler } from "../middleware/error.js";

const router = Router();

const SELECT = `
  SELECT p.*, c.slug AS category
  FROM products p
  LEFT JOIN categories c ON c.id = p.category_id
`;

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { q, category, status = "active", limit = 100 } = req.query;
    const params = [];
    const clauses = ["p.status = $1"];
    params.push(status);
    if (q) {
      params.push(`%${q}%`);
      clauses.push(`(p.title ILIKE $${params.length} OR p.short_benefits ILIKE $${params.length} OR p.description ILIKE $${params.length})`);
    }
    if (category) {
      params.push(category);
      clauses.push(`c.slug = $${params.length}`);
    }
    params.push(Number(limit));
    const result = await query(
      `${SELECT} WHERE ${clauses.join(" AND ")} ORDER BY p.best_seller DESC, p.featured DESC LIMIT $${params.length}`,
      params
    );
    res.json({ products: result.rows });
  })
);

router.get(
  "/:slug",
  asyncHandler(async (req, res) => {
    const result = await query(`${SELECT} WHERE p.slug = $1`, [req.params.slug]);
    if (!result.rows[0]) return res.status(404).json({ error: "Product not found" });
    res.json({ product: result.rows[0] });
  })
);

export default router;
