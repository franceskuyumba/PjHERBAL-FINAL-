# PJHERBAL Clinic – Admin Manual

Covers the back-office for **Admin (Owner)** and **Staff** users.

## 1. Roles

| Role | Access |
| ---- | ------ |
| **Staff** | Products, Orders, Customers, Inventory, Coupons, Blog, Reviews |
| **Admin** | Everything above **plus** Reports/Dashboard, Activity Log, Team & Roles |

Only the Owner (Admin) can manage team members and view the activity log.
Pages and APIs enforce these limits automatically; the sidebar hides what you can't use.

## 2. Dashboard (Reports)

- Total sales, orders, customers, products, pending orders
- **Sales trend** (last 14 days)
- **Popular products** (by quantity sold)
- **Orders by status**
- **Low-stock alerts** (products at/below their threshold) — click to restock

## 3. Products

- **List**: search, filter, low-stock view, active/draft flags, best-seller/featured toggles
- **New/Edit**: name, slug, SKU, category, description, ingredients/usage/benefits/precautions,
  prices (`compareAtPrice` enables flash deals), **stock** and **low-stock threshold**,
  status, images (comma-separated paths)
- Deleting a product cascades categories/reviews and is generally discouraged —
  set status to `INACTIVE` or `OUT_OF_STOCK` instead.

## 4. Inventory

- Dedicated stock view: every product with quantity and threshold
- Quick **restock** action, low-stock highlighting
- Stock also decrements automatically when orders are placed

## 5. Orders

- List by status; open an order for full detail
- **Update status**: PENDING → PAID → PROCESSING → DISPATCHED → DELIVERED (or CANCELLED)
- **Update payment status** (UNPAID/PAID/FAILED/REFUNDED) — each change is written
  to the **Payment Log** (timeline shown on the order page)
- Marking an order **Delivered** triggers the follow-up notification to the customer
  (thank-you + review/reorder CTA)
- Download **Invoice / Receipt (PDF)** from the order detail

## 6. Customers

- List of registered customers (name, email, phone, orders)
- Manage/customer support happens from the order and product data

## 7. Coupons & Promotions (Scheduled)

- Create percentage or fixed coupons
- Set **Start** / **End** dates for scheduled promotions — coupons are only valid
  inside their window (server-validated)
- Optional minimum order, max discount, and max uses

## 8. Blog

- Write/edit posts with Markdown content, cover image, category, author
- Publish immediately or **schedule** a future publish date (`scheduledFor`)

## 9. Reviews

- Moderate: approve or delete customer reviews before they appear on product pages

## 10. Activity Log (Admin)

- Audit trail of admin/system actions: order updates, product create/update,
  staff create/update, logins, and more

## 11. Team & Roles (Admin)

- Add staff members (name, email, phone, password, role)
- Promote staff → Admin or demote Admin → Staff
- You cannot demote yourself

## 12. Notifications

Staff and Admin receive in-app notifications for:
- **Low-stock alerts** (raised during checkout)
- Order-related follow-ups

## 13. Everyday operations checklist

1. Check **Dashboard** each morning for pending orders and low stock.
2. Process **Orders**: confirm payment on WhatsApp → mark Paid → dispatch → deliver.
3. Restock products flagged in **Inventory**.
4. Approve new **Reviews**.
5. Run `npm run backup` (or the scheduled task) at least daily — see DEPLOYMENT.md.
