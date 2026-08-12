import "dotenv/config";
import bcrypt from "bcryptjs";
import { query } from "../db.js";
import { runMigrations } from "./migrate.js";

async function seed() {
  await runMigrations();

  const count = await query("SELECT COUNT(*)::int AS n FROM products");
  if (count.rows[0].n > 0) {
    console.log("[seed] Products already exist, skipping seed");
    process.exit(0);
  }

  // Admin user
  const adminHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || "Admin123!", 10);
  await query(
    `INSERT INTO users (name, phone, email, password_hash, role)
     VALUES ($1, $2, $3, $4, 'admin')
     ON CONFLICT (email) DO NOTHING`,
    ["AfyaPlus Admin", "255712345678", process.env.ADMIN_EMAIL || "admin@afyaplus.co.tz", adminHash]
  );

  // Categories
  const categories = [
    ["mens-health", "Men's Health", "Strength, stamina & vitality", "shield"],
    ["weight-management", "Weight Management", "Reach your healthy weight", "scale"],
    ["energy-immunity", "Energy & Immunity", "Stay energized all day", "zap"],
    ["womens-wellness", "Women's Wellness", "Care for every stage", "flower"],
    ["brain-focus", "Brain & Focus", "Sharper mind, better memory", "brain"],
    ["detox-digestion", "Detox & Digestion", "Gut health & natural cleanse", "leaf"],
  ];
  for (const [slug, name, tagline, icon] of categories) {
    await query(
      "INSERT INTO categories (slug, name, tagline, icon) VALUES ($1,$2,$3,$4) ON CONFLICT (slug) DO NOTHING",
      [slug, name, tagline, icon]
    );
  }

  // Sample products
  const products = [
    {
      slug: "vital-man-herbal-capsules",
      title: "Vital Man Herbal Capsules",
      short_benefits: "Boosts stamina, strength and natural vitality for men.",
      description: "Scientifically selected herbs to support male vitality and energy.",
      price: 45000,
      compare_at_price: 55000,
      category: "mens-health",
      stock: 86,
      best_seller: true,
      featured: true,
      rating: 4.8,
      review_count: 214,
    },
    {
      slug: "gluco-trim-weight-loss-capsules",
      title: "GlucoTrim Weight Loss Capsules",
      short_benefits: "Burn fat, control appetite and boost metabolism naturally.",
      description: "A powerful natural weight management formula.",
      price: 50000,
      compare_at_price: 60000,
      category: "weight-management",
      stock: 54,
      best_seller: true,
      featured: true,
      rating: 4.7,
      review_count: 189,
    },
    {
      slug: "immuno-guard-vitamin-c-zinc",
      title: "ImmunoGuard Vitamin C & Zinc",
      short_benefits: "Daily immune defense with high-dose vitamin C and zinc.",
      description: "Your daily shield against colds, flu and seasonal illness.",
      price: 25000,
      category: "energy-immunity",
      stock: 120,
      best_seller: false,
      featured: true,
      rating: 4.9,
      review_count: 342,
    },
    {
      slug: "royal-women-collagen-glow",
      title: "Royal Women Collagen + Glow",
      short_benefits: "Radiant skin, stronger hair and nails from within.",
      description: "Beauty-from-within with marine collagen, biotin and hyaluronic acid.",
      price: 48000,
      category: "womens-wellness",
      stock: 42,
      best_seller: false,
      featured: true,
      rating: 4.6,
      review_count: 156,
    },
    {
      slug: "mind-zen-nootropic-brain-boost",
      title: "MindZen Nootropic Brain Boost",
      short_benefits: "Sharper focus, better memory and calm mental clarity.",
      description: "Premium nootropic stack for focus, memory and performance.",
      price: 55000,
      category: "brain-focus",
      stock: 12,
      best_seller: false,
      featured: false,
      rating: 4.5,
      review_count: 98,
    },
  ];

  for (const p of products) {
    const cat = await query("SELECT id FROM categories WHERE slug = $1", [p.category]);
    const categoryId = cat.rows[0]?.id;
    await query(
      `INSERT INTO products (slug, title, short_benefits, description, price, compare_at_price,
        category_id, stock, best_seller, featured, rating, review_count, images)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,'[]')`,
      [
        p.slug, p.title, p.short_benefits, p.description, p.price, p.compare_at_price ?? null,
        categoryId, p.stock, p.best_seller, p.featured, p.rating, p.review_count,
      ]
    );
  }

  // Coupons
  await query(
    `INSERT INTO coupons (code, discount_type, value, min_order, active) VALUES
     ('WELCOME10', 'percent', 10, 30000, true),
     ('AFYA20', 'percent', 20, 100000, true),
     ('FREESHIP', 'fixed', 3000, 80000, true)
     ON CONFLICT (code) DO NOTHING`
  );

  console.log(`[seed] Seeded ${categories.length} categories, ${products.length} products, coupons, and admin user`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("[seed] Failed:", err.message);
  process.exit(1);
});
