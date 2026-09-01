# PJHERBAL Clinic – Segerea Branch

Premium natural supplement e-commerce platform for the PJHERBAL Clinic (Segerea Branch), Dar es Salaam, Tanzania. Customers browse → search → view product details → add to cart → checkout → pay (mobile money / bank) → confirm on WhatsApp → track orders — with a full customer account system, an admin panel, a wellness blog and SEO/analytics built in.

## Tech stack

- **Next.js 14 (App Router)** + **TypeScript** + **Tailwind CSS** + **framer-motion**
- **Prisma** (SQLite locally, PostgreSQL in production)
- **jose** (JWT) + **bcryptjs** for auth (httpOnly cookie `pjherbal_session`)
- **zod** validation, **lucide-react** icons
- Payment adapter pattern: `manual` (WhatsApp-confirmed), `selcom`, `flutterwave`, `dpo`
- Built-in **ChatBot** (FAQ) + WhatsApp live support, **abandoned-cart reminders**, region-aware **delivery fee calculator**, Google Maps embed and social links

## Documentation

| Doc | Purpose |
| --- | ------- |
| [docs/SRS.md](docs/SRS.md) | Software Requirements Specification (master reference) |
| [docs/USER_MANUAL.md](docs/USER_MANUAL.md) | Customer guide |
| [docs/ADMIN_MANUAL.md](docs/ADMIN_MANUAL.md) | Admin & staff guide |
| [docs/API.md](docs/API.md) | REST API reference |
| [docs/DATABASE.md](docs/DATABASE.md) | Database schema & data dictionary |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | Hosting, SSL, Postgres, backups, go-live |
| [docs/FUTURE_ROADMAP.md](docs/FUTURE_ROADMAP.md) | Refunds, WhatsApp Business API, email/SMS, reports |

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
copy .env.example .env
#   - Set a real AUTH_SECRET (see .env.example)
#   - Set NEXT_PUBLIC_WHATSAPP_NUMBER to the clinic's WhatsApp number (digits only, e.g. 2557XXXXXXXX)
#   - Keep PAYMENT_PROVIDER="manual" until gateway credentials are added

# 3. Create the database and seed it
npx prisma db push
npm run seed

# 4. Generate placeholder images
npm run images

# 5. Run the dev server
npm run dev
```

Open http://localhost:3000.

> Windows note: Node may not be on your PATH. The project bundles a portable runtime in `.node/` — `npm run dev:clean` (and `scripts/dev.cmd`) pick it up automatically. If the dev server ever hangs on `Starting...`, run `npm run dev:clean` to reset the `.next` cache.

## Demo accounts (seeded)

| Role     | Email                    | Password     |
| -------- | ------------------------ | ------------ |
| Admin    | `admin@pjherbal.co.tz`   | `Admin@12345` |
| Customer | `customer@example.com`   | `Customer@123` |

## Common commands

```bash
npm run dev          # start dev server
npm run dev:clean    # clear stale .next cache first, then start dev (fixes a hung "Starting..." server)
npm run build        # production build
npm run start        # start production server
npm run seed         # re-seed the database
npm run images       # regenerate SVG placeholders
npm run backup       # snapshot db + .env into backups/ (keeps last 14)
npm run backup:list  # list existing backups
npx tsc --noEmit     # typecheck
```

## Project structure

```
src/app/                  # App Router pages & API routes
  api/                    # Route handlers (auth, checkout, orders, admin/*, ...)
  admin/                  # Admin panel (products, orders, customers, coupons, blog, reviews)
  customer-dashboard/     # Customer account (orders, tracking, addresses, wishlist, settings)
  blog/                   # Public wellness blog
  product/  shop/  category/  cart/  checkout/  login/  register/  about/  contact/
src/components/           # UI, layout, home, product, shop, blog, auth, dashboard, admin components
src/context/              # CartProvider (localStorage cart + coupon)
src/lib/                  # auth, prisma, constants, utils, payments/*, analytics, seo, validations
prisma/                   # schema.prisma + seed.ts
public/images/            # SVG placeholders (logo, hero, products, categories, blog)
```

## Payments

`PAYMENT_PROVIDER` selects the active gateway:

- `manual` (default) — the order is recorded, and the customer sends payment confirmation via WhatsApp. No gateway credentials needed.
- `selcom` / `flutterwave` / `dpo` — live gateway adapters. Set the credentials in `.env` and implement/verify the webhook to mark payments paid.

All adapters implement the same `PaymentAdapter` interface (`src/lib/payments/types.ts`).

## Database

- Local dev uses SQLite (`prisma/dev.db`) — zero configuration.
- For production, switch the Prisma provider to `postgresql` in `prisma/schema.prisma` and set `DATABASE_URL` to your Postgres connection string.
- Statuses (order, payment, product) are stored as strings and validated in the application layer because SQLite does not support Prisma enums.

## SEO & analytics

- `sitemap.ts`, `robots.ts`, `manifest.ts`, per-page metadata, Open Graph/Twitter cards and JSON-LD product schemas.
- Optional Google Analytics, Meta Pixel and TikTok Pixel via `NEXT_PUBLIC_*` env vars.
- Server-side event tracking (`src/lib/analytics.ts`) records page views, add-to-cart, checkout and purchase events to the `AnalyticsEvent` table.

## Production checklist

1. Use PostgreSQL and set the real `DATABASE_URL`.
2. Set a strong `AUTH_SECRET` and a real WhatsApp number.
3. Configure the payment provider and its webhook.
4. Replace `/public/images/*` SVG placeholders with real product photography.
5. Set `NEXT_PUBLIC_SITE_URL` to the production domain.

## Backups

`npm run backup` snapshots `prisma/dev.db` and `.env` into `backups/` as a timestamped zip (last 14 kept, tune with `BACKUP_KEEP`). Schedule it with cron/Task Scheduler daily:

```bash
# cron example (daily at 3am)
0 3 * * * cd /var/www/pjherbal && npm run backup
```

## Environment variables

Full list in `.env.example`. Notables:

| Variable | Purpose |
| -------- | ------- |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp number used for live support + order confirmation (digits only) |
| `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL` | Embed map shown on the contact page |
| `NEXT_PUBLIC_GOOGLE_MAPS_URL` | "Get directions" link to your Google Business Profile |
| `NEXT_PUBLIC_FACEBOOK_URL` / `INSTAGRAM` / `TIKTOK` / `X` | Footer social links |
| `SHIPPING_FEE_TZS` / `FREE_SHIPPING_THRESHOLD_TZS` | Delivery fee calculator defaults + free-delivery bar |

### WhatsApp chatbot

The FAQ chatbot answers incoming WhatsApp text messages through the Meta WhatsApp
Cloud API at `/api/whatsapp/webhook`. Configure these server-only variables in the
deployment environment:

| Variable | Purpose |
| -------- | ------- |
| `WHATSAPP_ACCESS_TOKEN` | Meta WhatsApp Cloud API access token |
| `WHATSAPP_PHONE_NUMBER_ID` | Phone number ID registered in Meta Business Manager |
| `WHATSAPP_APP_SECRET` | Meta app secret used to validate webhook signatures |
| `WHATSAPP_VERIFY_TOKEN` | Private token entered when configuring the Meta webhook |

Set the Meta callback URL to `https://your-domain.example/api/whatsapp/webhook`,
subscribe to the `messages` field, and use the same value for
`WHATSAPP_VERIFY_TOKEN` in the deployment environment. The existing
`WHATSAPP_WEBHOOK_VERIFY_TOKEN` name remains supported for compatibility.
