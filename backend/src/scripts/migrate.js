import { query } from "../db.js";

export async function runMigrations() {
  const schema = `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(160) UNIQUE,
    password_hash TEXT,
    role VARCHAR(20) NOT NULL DEFAULT 'customer',
    created_at TIMESTAMPTZ DEFAULT now()
  );

  CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(80) UNIQUE NOT NULL,
    name VARCHAR(120) NOT NULL,
    tagline VARCHAR(200),
    description TEXT,
    icon VARCHAR(40),
    image TEXT
  );

  CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(160) UNIQUE NOT NULL,
    title VARCHAR(200) NOT NULL,
    short_benefits TEXT,
    description TEXT,
    price NUMERIC(12,2) NOT NULL,
    compare_at_price NUMERIC(12,2),
    category_id INTEGER REFERENCES categories(id),
    images JSONB DEFAULT '[]',
    rating NUMERIC(3,1) DEFAULT 5.0,
    review_count INTEGER DEFAULT 0,
    best_seller BOOLEAN DEFAULT false,
    featured BOOLEAN DEFAULT false,
    stock INTEGER DEFAULT 0,
    low_stock_threshold INTEGER DEFAULT 10,
    status VARCHAR(20) DEFAULT 'active',
    ingredients JSONB DEFAULT '[]',
    usage_instructions JSONB DEFAULT '[]',
    benefits JSONB DEFAULT '[]',
    warnings JSONB DEFAULT '[]',
    meta_title TEXT,
    meta_description TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
  );

  CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    name VARCHAR(120) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(160),
    region VARCHAR(80),
    district VARCHAR(80),
    address TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
  );

  CREATE TABLE IF NOT EXISTS saved_addresses (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE,
    label VARCHAR(40),
    line1 VARCHAR(200),
    line2 VARCHAR(200),
    region VARCHAR(80),
    district VARCHAR(80),
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
  );

  CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(30) UNIQUE NOT NULL,
    customer_id INTEGER REFERENCES customers(id) ON DELETE SET NULL,
    customer_name VARCHAR(120) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_email VARCHAR(160),
    address TEXT,
    region VARCHAR(80),
    district VARCHAR(80),
    subtotal NUMERIC(12,2) NOT NULL,
    shipping NUMERIC(12,2) DEFAULT 0,
    discount NUMERIC(12,2) DEFAULT 0,
    total NUMERIC(12,2) NOT NULL,
    payment_method VARCHAR(30),
    payment_ref VARCHAR(80),
    status VARCHAR(20) DEFAULT 'pending',
    courier VARCHAR(80),
    estimated_delivery TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id),
    product_title VARCHAR(200) NOT NULL,
    unit_price NUMERIC(12,2) NOT NULL,
    quantity INTEGER NOT NULL,
    image TEXT
  );

  CREATE TABLE IF NOT EXISTS order_history (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL,
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
  );

  CREATE TABLE IF NOT EXISTS coupons (
    id SERIAL PRIMARY KEY,
    code VARCHAR(40) UNIQUE NOT NULL,
    discount_type VARCHAR(10) NOT NULL,
    value NUMERIC(12,2) NOT NULL,
    min_order NUMERIC(12,2) DEFAULT 0,
    active BOOLEAN DEFAULT true,
    expires_at TIMESTAMPTZ
  );

  CREATE TABLE IF NOT EXISTS cart_items (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(100) NOT NULL,
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(session_id, product_id)
  );

  CREATE TABLE IF NOT EXISTS wishlist (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(customer_id, product_id)
  );

  CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    customer_id INTEGER REFERENCES customers(id) ON DELETE SET NULL,
    customer_name VARCHAR(120),
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    title VARCHAR(200),
    body TEXT,
    verified BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
  );

  CREATE TABLE IF NOT EXISTS blog_posts (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(200) UNIQUE NOT NULL,
    title VARCHAR(200) NOT NULL,
    excerpt TEXT,
    body JSONB DEFAULT '[]',
    category VARCHAR(80),
    author VARCHAR(120),
    image TEXT,
    tags JSONB DEFAULT '[]',
    status VARCHAR(20) DEFAULT 'published',
    meta_title TEXT,
    meta_description TEXT,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
  );

  CREATE TABLE IF NOT EXISTS whatsapp_campaigns (
    id SERIAL PRIMARY KEY,
    name VARCHAR(160) NOT NULL,
    audience JSONB DEFAULT '{}',
    message TEXT,
    template VARCHAR(80),
    status VARCHAR(20) DEFAULT 'draft',
    sent_count INTEGER DEFAULT 0,
    reply_count INTEGER DEFAULT 0,
    conversion_count INTEGER DEFAULT 0,
    scheduled_at TIMESTAMPTZ,
    sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
  );

  CREATE TABLE IF NOT EXISTS payment_logs (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE SET NULL,
    provider VARCHAR(40),
    reference VARCHAR(120),
    amount NUMERIC(12,2),
    status VARCHAR(30),
    payload JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
  );

  CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
  CREATE INDEX IF NOT EXISTS idx_orders_phone ON orders(customer_phone);
  CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
  CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
  CREATE INDEX IF NOT EXISTS idx_cart_session ON cart_items(session_id);
  `;

  await query(schema);
  console.log("[migrate] Schema is up to date");
}

if (process.argv[1]?.endsWith("migrate.js")) {
  runMigrations()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("[migrate] Failed:", err.message);
      process.exit(1);
    });
}
