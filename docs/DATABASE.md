# PJHERBAL Clinic – Database Documentation

ORM: Prisma 5. Provider: **SQLite** (dev) / **PostgreSQL** (prod).
Statuses are stored as strings (SQLite has no enums) and validated in the app layer.

## Entity map

| Model | Purpose | Key relations |
| ----- | ------- | ------------- |
| `User` | Customer/admin/staff account | addresses, orders, reviews, wishlist, notifications, productViews |
| `Address` | Saved delivery addresses | → User |
| `Category` | Product taxonomy | → Product[] |
| `Product` | Catalogue item with stock/thresholds | → Category, reviews, orderItems, wishlist, productViews |
| `Review` | Customer review + rating | → Product, → User |
| `Order` | Sales order (guest or customer) | → User, items, payments, paymentLogs |
| `OrderItem` | Line item snapshot | → Order, → Product |
| `Payment` | Payment attempt | → Order, logs |
| `PaymentLog` | Append-only payment status history | → Order, → Payment |
| `ActivityLog` | Admin/system audit trail | – |
| `Coupon` | Discount/promotion with scheduling | – |
| `WishlistItem` | Customer wishlist (unique user+product) | → User, → Product |
| `AnalyticsEvent` | Internal event tracking | – |
| `BlogPost` | Wellness articles with scheduling | – |
| `Notification` | In-app notifications | → User |
| `ProductView` | View history for recommendations | → User, → Product |

## Key fields & semantics

### Product
- `status`: `ACTIVE` | `INACTIVE` | `DRAFT` | `OUT_OF_STOCK`
- `price` / `compareAtPrice`: compareAtPrice > price = on flash deal
- `stock` / `lowStockThreshold`: low-stock when `stock <= lowStockThreshold`
- `images`: comma-separated paths
- `rating` / `ratingCount`: aggregated from approved reviews

### Order
- `status`: `PENDING` → `PAID` → `PROCESSING` → `DISPATCHED` → `DELIVERED` | `CANCELLED`
- `paymentStatus`: `UNPAID` | `PAID` | `FAILED` | `REFUNDED`
- `subtotal`/`discount`/`shipping`/`total`; `currency` = TZS
- `orderNumber`: human-friendly unique reference

### Coupon
- `type`: `PERCENTAGE` | `FIXED`
- `startsAt` / `expiresAt`: scheduled promotions window
- `maxUses` / `usedCount`; `minOrder`; `maxDiscount`

### PaymentLog (audit)
- One or more rows per order describing every transition:
  `CREATED` → `PENDING` → `SUCCESS` | `FAILED` | `REFUNDED`, with provider, reference, message, timestamp.

## Indexes
- `PaymentLog(orderId, createdAt)` – chronological payment history
- `ActivityLog(createdAt)` – audit queries
- `Notification(userId, read)` – unread badge
- `ProductView(userId, createdAt)` – recommendation recency
- `WishlistItem(userId, productId)` – unique constraint

## Migrations
- Dev: `npm run db:push` (schema-sync) or `npm run db:migrate` (versioned).
- Prod: `prisma migrate deploy` after pushing the generated migrations.
- Seed: `npm run db:seed` (`prisma/seed.ts`) creates categories, products, blog posts,
  coupons, and the demo accounts.

## Changing the schema
1. Edit `prisma/schema.prisma`.
2. `npm run db:generate` to regenerate the client.
3. `npm run db:migrate -- --name <change>` for a versioned migration (or `db:push` for dev).
4. Update this document to match.
