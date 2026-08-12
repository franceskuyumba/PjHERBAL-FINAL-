# PJHERBAL Clinic – API Reference

All routes are Next.js route handlers under `/api`. Requests/responses are JSON.
Auth uses the `pjherbal_session` httpOnly cookie (JWT). Error shape:

```json
{ "error": "message" }
```

| Guard | Meaning |
| ----- | ------- |
| **Public** | No auth required |
| **Auth** | Any signed-in user |
| **Back-office** | ADMIN or STAFF role |
| **Admin** | ADMIN role only |

---

## Auth

| Method | Route | Guard | Description |
| ------ | ----- | ----- | ----------- |
| POST | `/api/auth/register` | Public | Create customer account |
| POST | `/api/auth/login` | Public | Sign in; returns `{ user }` with role |
| POST | `/api/auth/logout` | Auth | Clear session |
| GET | `/api/auth/me` | Auth | Current user profile |

## Catalogue

| Method | Route | Guard | Description |
| ------ | ----- | ----- | ----------- |
| GET | `/api/search?q=…` | Public | Product search by name/slug/description |
| POST | `/api/reviews` | Auth | Submit review `{ productId, rating, title?, comment }` |
| DELETE | `/api/reviews/[id]` | Auth (owner) | Delete own review |
| POST | `/api/wishlist/[productId]` | Auth | Add to wishlist |
| DELETE | `/api/wishlist/[productId]` | Auth | Remove from wishlist |
| GET | `/api/wishlist` | Auth | List wishlist |
| GET | `/api/coupons/validate?code=…&subtotal=…` | Public | Validate coupon |

## Cart / Checkout

| Method | Route | Guard | Description |
| ------ | ----- | ----- | ----------- |
| POST | `/api/checkout` | Public | Place order `{ items, coupon?, customerName, email, phone, region, district, address, notes?, paymentMethod }` → returns `{ orderNumber, reference, redirectUrl?, instructions?, provider, total, paymentMethod, customerName }` |
| GET | `/api/orders` | Auth | Customer's own orders |
| GET | `/api/orders/[orderNumber]` | Auth | Order detail by number |

## Account

| Method | Route | Guard | Description |
| ------ | ----- | ----- | ----------- |
| GET/PUT | `/api/account/profile` | Auth | Read/update name, phone |
| POST | `/api/account/product-view` | Auth | Record product view (recommendations) |
| GET/POST/DELETE | `/api/account/addresses` | Auth | List/create addresses |
| PUT/DELETE | `/api/account/addresses/[id]` | Auth | Update/delete address |
| GET | `/api/account/notifications` | Auth | List notifications |
| POST | `/api/account/notifications` | Auth | Mark read |

## Admin – Products

| Method | Route | Guard | Description |
| ------ | ----- | ----- | ----------- |
| GET | `/api/admin/products?lowStock=1` | Back-office | List products (optionally low-stock only) |
| POST | `/api/admin/products` | Back-office | Create product |
| PUT/DELETE | `/api/admin/products/[id]` | Back-office | Update/delete product |

## Admin – Orders

| Method | Route | Guard | Description |
| ------ | ----- | ----- | ----------- |
| GET | `/api/admin/orders` | Back-office | List all orders (filter by status/search) |
| GET | `/api/admin/orders/[id]` | Back-office | Order detail incl. items, payments, payment logs |
| PUT | `/api/admin/orders/[id]` | Back-office | Update status/payment status; writes PaymentLog; triggers follow-up on DELIVERED |

## Admin – Customers & Team

| Method | Route | Guard | Description |
| ------ | ----- | ----- | ----------- |
| GET | `/api/admin/customers` | Back-office | List customers |
| GET | `/api/admin/stats` | Back-office | Dashboard/report aggregates |
| GET/POST | `/api/admin/team` | Admin | List/create staff |
| PUT/DELETE | `/api/admin/team/[id]` | Admin | Update role / remove staff |
| GET | `/api/admin/activity` | Admin | Activity log |

## Admin – Content & Promotions

| Method | Route | Guard | Description |
| ------ | ----- | ----- | ----------- |
| GET/POST | `/api/admin/coupons` | Back-office | List/create coupons |
| PUT/DELETE | `/api/admin/coupons/[id]` | Back-office | Update/delete coupons |
| GET/POST | `/api/admin/blog` | Back-office | List/create posts |
| PUT/DELETE | `/api/admin/blog/[id]` | Back-office | Update/delete posts |
| GET | `/api/admin/reviews` | Back-office | List reviews |
| PUT/DELETE | `/api/admin/reviews/[id]` | Back-office | Approve/delete reviews |

## Misc

| Method | Route | Guard | Description |
| ------ | ----- | ----- | ----------- |
| POST | `/api/newsletter` | Public | Subscribe to newsletter |
| POST | `/api/contact` | Public | Contact form (log + WhatsApp forward-ready) |
| POST | `/api/analytics/event` | Public | Record analytics event |
| POST | `/api/log` | Public | Client-side error logging |

---

## Checkout flow

1. Client posts validated cart + delivery/payment details.
2. Server recalculates totals (coupon, region-based delivery fee).
3. Order + items created; stock decremented; low-stock alerts raised.
4. Payment attempt created; `PaymentLog` row written.
5. Payment adapter runs; `manual` returns WhatsApp confirmation instructions.
6. Order confirmation email/SMS queued (best-effort, never throws).
