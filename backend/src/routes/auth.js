import { Router } from "express";
import bcrypt from "bcryptjs";
import { query } from "../db.js";
import { signToken } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/error.js";

const router = Router();

function publicUser(row) {
  return { id: row.id, name: row.name, phone: row.phone, email: row.email, role: row.role };
}

router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { name, phone, email, password } = req.body;
    if (!name || !phone || !password) {
      return res.status(400).json({ error: "Name, phone and password are required" });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters" });
    }
    const existing = await query("SELECT id FROM users WHERE phone = $1", [phone]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: "An account with this phone already exists" });
    }
    const hash = await bcrypt.hash(password, 10);
    const result = await query(
      `INSERT INTO users (name, phone, email, password_hash, role)
       VALUES ($1,$2,$3,$4,'customer') RETURNING *`,
      [name, phone, email || null, hash]
    );
    const user = result.rows[0];
    const token = signToken({ id: user.id, role: user.role });
    res.status(201).json({ user: publicUser(user), token });
  })
);

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ error: "Identifier and password are required" });
    }
    const result = await query(
      "SELECT * FROM users WHERE phone = $1 OR email = $1",
      [identifier]
    );
    const user = result.rows[0];
    if (!user || !user.password_hash || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = signToken({ id: user.id, role: user.role });
    res.json({ user: publicUser(user), token });
  })
);

router.get(
  "/me",
  asyncHandler(async (req, res) => {
    const token = req.headers.authorization?.slice(7);
    if (!token) return res.status(401).json({ error: "Authentication required" });
    try {
      const { jwt } = await import("jsonwebtoken");
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      const result = await query("SELECT * FROM users WHERE id = $1", [payload.id]);
      if (!result.rows[0]) return res.status(404).json({ error: "User not found" });
      res.json({ user: publicUser(result.rows[0]) });
    } catch {
      res.status(401).json({ error: "Invalid token" });
    }
  })
);

export default router;
