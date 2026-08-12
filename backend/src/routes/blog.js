import { Router } from "express";
import { query } from "../db.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/error.js";

const router = Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { category } = req.query;
    const params = [];
    let where = "status = 'published'";
    if (category) {
      params.push(category);
      where += ` AND category = $${params.length}`;
    }
    const result = await query(
      `SELECT id, slug, title, excerpt, category, author, image, published_at
       FROM blog_posts WHERE ${where} ORDER BY published_at DESC`,
      params
    );
    res.json({ posts: result.rows });
  })
);

router.get(
  "/:slug",
  asyncHandler(async (req, res) => {
    const result = await query("SELECT * FROM blog_posts WHERE slug = $1", [req.params.slug]);
    if (!result.rows[0]) return res.status(404).json({ error: "Post not found" });
    res.json({ post: result.rows[0] });
  })
);

router.post(
  "/",
  requireAuth,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { slug, title, excerpt, body, category, author, image, tags } = req.body;
    if (!slug || !title) return res.status(400).json({ error: "slug and title required" });
    const result = await query(
      `INSERT INTO blog_posts (slug, title, excerpt, body, category, author, image, tags, published_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8, now()) RETURNING *`,
      [slug, title, excerpt || "", JSON.stringify(body || []), category || "Health", author || "AfyaPlus Team", image || null, JSON.stringify(tags || [])]
    );
    res.status(201).json({ post: result.rows[0] });
  })
);

export default router;
