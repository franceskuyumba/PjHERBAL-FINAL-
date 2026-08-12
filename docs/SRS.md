# PJHERBAL Clinic – Software Requirements Specification (SRS)

**Project:** PJHERBAL Clinic e-commerce platform (Segerea Branch)
**Version:** 1.0
**Status:** Baseline
**Last updated:** August 2026

---

## 1. Introduction

### 1.1 Purpose
This Software Requirements Specification (SRS) describes the complete functional and
non-functional requirements of the PJHERBAL Clinic online store and management system.
It is the reference document for development, maintenance, and future expansion.

### 1.2 Scope
The system is a single integrated e-commerce platform comprising:

- Public e-commerce website (catalogue, search, cart, checkout, blog, contact)
- Customer dashboard (orders, wishlist, addresses, profile, notifications)
- Admin dashboard (products, orders, customers, inventory, coupons/promotions,
  blog, reviews, reports, activity log, team & roles)
- Staff role management with role-based access control
- Automation (email/SMS notifications, abandoned-cart recovery, low-stock alerts,
  customer follow-up engine, scheduled promotions)
- Third-party integrations (WhatsApp, payment gateways, Google Maps, social media,
  Google Analytics, Meta Pixel, TikTok Pixel)

### 1.3 Definitions
| Term | Meaning |
| ---- | ------- |
| TZS | Tanzanian Shilling (currency) |
| SKU | Stock Keeping Unit |
| EAT | East Africa Time (site timezone) |
| OTP/2FA | One-time password / two-factor authentication (future) |

### 1.4 References
- README.md (project root) – quick start
- docs/DEPLOYMENT.md – production setup
- docs/ADMIN_MANUAL.md – administration guide

---

## 2. Overall Description

### 2.1 Product Perspective
The system is a Next.js 14 (App Router) application with server-rendered pages,
REST-style route handlers, and a Prisma-managed database (SQLite locally,
PostgreSQL in production). Authentication uses signed httpOnly cookies (JWT via `jose`)
and bcrypt password hashing.

### 2.2 User Roles
| Role | Access |
| ---- | ------ |
| **Guest** | Browse, search, add to cart, checkout, subscribe to newsletter |
| **Customer** | Guest access + dashboard (orders, wishlist, addresses, profile, reviews, notifications) |
| **Staff** | Back-office access: products, orders, customers, inventory, coupons, blog, reviews |
| **Admin (Owner)** | Everything, including reports, activity log, team & role management, settings |

Role-based authorization is enforced at three layers:
1. `src/middleware.ts` – route-level redirects
2. `src/lib/api.ts` (`requireApiAdmin`, `requireBackOffice`) – API-level guards
3. UI-level filtering (`AdminShell` hides admin-only items from staff)

### 2.3 Operating Environment
- Node.js 18+ / 20 (bundled portable runtime in `.node/` for Windows dev)
- Prisma ORM; SQLite (dev) / PostgreSQL (prod)
- Next.js 14.2, React 18, Tailwind CSS, TypeScript

### 2.4 Constraints
- Do not expose secrets in client code. All credentials come from environment variables.
- SQLite does not support enums, so statuses are strings validated in the app layer.
- Single website (no separate landing page manager; no driver/GPS order tracking).

---

## 3. Functional Requirements

### 3.1 Public Website

| ID | Requirement |
| -- | ----------- |
| FR-101 | Homepage with hero, trust bar, flash deals (countdown), featured categories, recommended/best-sellers/new arrivals, story, why-us, how-it-works, testimonials, blog preview, newsletter |
| FR-102 | Shop page with category/sort/search filters (client-side `ShopFilters`) |
| FR-103 | Product page with gallery, description, tabs, reviews, related products, add-to-cart, WhatsApp order |
| FR-104 | Cart (localStorage-backed) with coupon application and delivery-fee preview |
| FR-105 | Checkout: customer details → delivery → payment → confirmation |
| FR-106 | Contact page with form, WhatsApp link, Google Maps embed |
| FR-107 | About page |
| FR-108 | FAQ / help page |
| FR-109 | Blog: list, detail with TOC, markdown rendering, sharing |
| FR-110 | Global chatbot (FAQ) with WhatsApp handoff and live-support widget |

### 3.2 Product & Catalogue

| ID | Requirement |
| -- | ----------- |
| FR-201 | Categories with icons, images, product counts |
| FR-202 | Product search (navbar panel + server `/api/search`) |
| FR-203 | Wishlist (authenticated users only) |
| FR-204 | Reviews & ratings (star rating, moderation approval, rating aggregation) |
| FR-205 | Related products (same category) |
| FR-206 | Stock levels and low-stock thresholds per product |
| FR-207 | Flash-deal pricing (`compareAtPrice`) with daily countdown |
| FR-208 | Personalized recommendations from product-view history |

### 3.3 Transactions

| ID | Requirement |
| -- | ----------- |
| FR-301 | Order placement (guest or customer) |
| FR-302 | Delivery fee calculator: per-region fees (`DELIVERY_ZONES`), free over threshold |
| FR-303 | Invoice and receipt generator (print/PDF via `/order/[orderNumber]/invoice`) |
| FR-304 | Payment status logs: append-only `PaymentLog` history per order |
| FR-305 | Payment adapter pattern: `manual` (WhatsApp-confirmed), `selcom`, `flutterwave`, `dpo` |
| FR-306 | Stock decrement on order + low-stock alert creation |
| FR-307 | Order status lifecycle: PENDING → PAID → PROCESSING → DISPATCHED → DELIVERED (or CANCELLED) |
| FR-308 | Order history for logged-in customers |

> **Excluded by design:** driver/GPS order tracking. Replaced by the delivery fee
> calculator (FR-302) and Google Maps business presence.

### 3.4 Automation

| ID | Requirement |
| -- | ----------- |
| FR-401 | Email notifications (provider abstraction; console by default, SMTP-ready) |
| FR-402 | SMS notifications (provider abstraction; console by default, Infobip/Twilio-ready) |
| FR-403 | Abandoned-cart recovery: in-app reminder after 2h for non-empty carts |
| FR-404 | Low-stock alerts to admins/staff (in-app notification) |
| FR-405 | Scheduled promotions: coupons with `startsAt`/`expiresAt`; scheduled blog posts |
| FR-406 | Customer follow-up engine: delivered-order notification with reorder/review CTA |
| FR-407 | WhatsApp chatbot (FAQ) + WhatsApp live-chat handoff |

### 3.5 Customer Dashboard

| ID | Requirement |
| -- | ----------- |
| FR-501 | My orders with status, payment, invoice link |
| FR-502 | Wishlist |
| FR-503 | Saved addresses (CRUD, default address) |
| FR-504 | Profile (name, phone) |
| FR-505 | Password change |
| FR-506 | Notifications |
| FR-507 | My reviews |
| FR-508 | Personalized recommendations |

### 3.6 Admin Dashboard

| ID | Requirement |
| -- | ----------- |
| FR-601 | Dashboard: total sales, orders, customers, products, sales trend, popular products, status breakdown, low-stock alerts (Reports) |
| FR-602 | Products CRUD (including images, pricing, stock, thresholds, best-seller/featured flags) |
| FR-603 | Orders management: detail, status + payment-status transitions, payment logs |
| FR-604 | Customers list |
| FR-605 | Inventory: stock levels, low-stock filter, restock |
| FR-606 | Coupons/promotions CRUD (scheduled start/end, limits) |
| FR-607 | Blog CRUD with scheduling |
| FR-608 | Reviews moderation (approve/delete) |
| FR-609 | Activity log (admin-only) |
| FR-610 | Team & roles: create staff/admin, toggle role (admin-only) |
| FR-611 | Role-based access: staff cannot access activity log or team management |

### 3.7 Integrations

| ID | Requirement |
| -- | ----------- |
| FR-701 | WhatsApp: `wa.me` chat links, order confirmation, chatbot handoff, Business API-ready |
| FR-702 | Payment gateways via adapters (manual active; selcom/flutterwave/dpo stubs) |
| FR-703 | Email/SMS provider abstraction |
| FR-704 | Google Maps embed + Google Business "Get directions" link |
| FR-705 | Social media links (Facebook, Instagram, TikTok, X) in footer |
| FR-706 | Google Analytics, Meta Pixel, TikTok Pixel via env-configured scripts |

### 3.8 Security

| ID | Requirement |
| -- | ----------- |
| FR-801 | bcrypt password hashing |
| FR-802 | httpOnly signed session cookie (JWT) |
| FR-803 | Role-based access control (see 2.2) |
| FR-804 | Activity logging for admin/system actions |
| FR-805 | Input validation (zod) on all mutation APIs |
| FR-806 | No secrets in client bundles; env-only configuration |
| FR-807 | Daily backup script with retention (`npm run backup`) |

---

## 4. Non-Functional Requirements

| ID | Requirement |
| -- | ----------- |
| NFR-1 | **Performance:** server-rendered pages, optimized images, sub-3s TTFB target |
| NFR-2 | **Responsiveness:** mobile, tablet, desktop; mobile bottom nav |
| NFR-3 | **SEO:** sitemap, robots, metadata, JSON-LD (Product, LocalBusiness, Organization) |
| NFR-4 | **Security:** see 3.8; HTTPS in production (SSL enforced) |
| NFR-5 | **Reliability:** error logging (`logger.ts`), never-throw notification helpers |
| NFR-6 | **Scalability:** stateless app; PostgreSQL production; provider pattern for external services |
| NFR-7 | **Maintainability:** clean structure, typed code, documented API and schema |
| NFR-8 | **Accessibility:** semantic HTML, aria labels on interactive elements |
| NFR-9 | **Analytics:** GA/Meta/TikTok pixel + internal event tracking |

---

## 5. Data Requirements (summary)
Full detail in docs/DATABASE.md. Core entities: `User`, `Address`, `Category`,
`Product`, `Review`, `Order`, `OrderItem`, `Payment`, `PaymentLog`, `ActivityLog`,
`Coupon`, `WishlistItem`, `AnalyticsEvent`, `BlogPost`, `Notification`, `ProductView`.

---

## 6. API Requirements
REST-style route handlers under `/api`. Full reference in docs/API.md. All mutations
validate input; admin routes require ADMIN or STAFF; sensitive admin routes require ADMIN.

---

## 7. Deployment Requirements
See docs/DEPLOYMENT.md. Production targets PostgreSQL, HTTPS/SSL, scheduled backups,
and environment-variable-driven configuration.

---

## 8. Future Improvements
See docs/FUTURE_ROADMAP.md. Highlights:
- Refund management module
- Real SMTP email and SMS gateway providers (Infobip/Twilio)
- WhatsApp Business API (template messages)
- In-browser purchase conversion events for ad platforms
- Advanced reports and analytics export
- Two-factor authentication, rate-limited login, CSRF hardening
