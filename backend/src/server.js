import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { pool } from "./db.js";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import orderRoutes from "./routes/orders.js";
import paymentRoutes from "./routes/payments.js";
import whatsappRoutes from "./routes/whatsapp.js";
import adminRoutes from "./routes/admin.js";
import blogRoutes from "./routes/blog.js";
import { errorHandler } from "./middleware/error.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(helmet());
app.use(
  cors({
    origin: process.env.NODE_ENV === "production" ? process.env.FRONTEND_URL : true,
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

app.get("/api/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok", db: "connected", time: new Date().toISOString() });
  } catch {
    res.status(503).json({ status: "error", db: "disconnected" });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/whatsapp", whatsappRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/blog", blogRoutes);

app.use((_req, res) => res.status(404).json({ error: "Not found" }));
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`[server] AfyaPlus API running on http://localhost:${PORT}`);
});
