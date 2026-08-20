# PJHERBAL Clinic – Deployment Guide

## 1. Architecture decisions

- **Hosting**: Vercel (recommended, zero-ops) or a VPS (Node + Nginx + PM2).
- **Database**: PostgreSQL through Prisma. Set `DATABASE_URL` for local or production PostgreSQL.
- **Sessions**: stateless JWT cookie — no sticky sessions needed.
- **Static assets**: served from `public/`; images are SVG placeholders today — swap
  for optimized real photography (WebP/AVIF) before launch.

## 2. Prerequisites

1. A domain (e.g. `pjherbal.co.tz`).
2. A PostgreSQL database (Neon, Supabase, Railway, or a VPS Postgres).
3. Git repository with the source (see Source Code Handover below).

## 3. Environment configuration

Copy `.env.example` → `.env` (production). Critical variables:

| Variable | Notes |
| -------- | ----- |
| `DATABASE_URL` | Postgres connection string (`postgresql://user:pass@host:5432/pjherbal?schema=public`) |
| `AUTH_SECRET` | Strong random string — generate with `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"` |
| `NEXT_PUBLIC_SITE_URL` | Final domain, e.g. `https://pjherbal.co.tz` |
| `CORS_ALLOWED_ORIGINS` | Optional comma-separated allowlist of trusted HTTPS frontend origins; never use `*` with cookies |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Digits only, e.g. `2557XXXXXXXX` |
| `WHATSAPP_ACCESS_TOKEN` / `WHATSAPP_PHONE_NUMBER_ID` | Meta WhatsApp Business API credentials |
| `WHATSAPP_APP_SECRET` / `WHATSAPP_WEBHOOK_VERIFY_TOKEN` | Required to verify webhook requests |
| `NEXT_PUBLIC_HEAD_OFFICE_PHONE` / `NEXT_PUBLIC_SPECIALIST_PHONE` / `NEXT_PUBLIC_CUSTOMER_CARE_PHONE` | Public contact numbers in international format |
| `PAYMENT_PROVIDER` | `manual` until gateway credentials are added |
| `SHIPPING_FEE_TZS` / `FREE_SHIPPING_THRESHOLD_TZS` | Delivery calculator defaults |
| `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL` / `NEXT_PUBLIC_GOOGLE_MAPS_URL` | Map embed + Google Business link |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_META_PIXEL_ID`, `NEXT_PUBLIC_TIKTOK_PIXEL_ID` | Analytics/pixels (leave blank to disable) |
| `SMS_PROVIDER`, `INFOBIP_API_KEY`, `INFOBIP_SENDER` | Set `SMS_PROVIDER=infobip` for real SMS; console mode only logs messages |

> **Never** commit the real `.env`. It is git-ignored. In Vercel, set variables in the
> project dashboard; on a VPS, use a secure `.env` file owned by the app user.

## 4. Database deployment

```bash
# PostgreSQL is already the active Prisma provider.
prisma migrate deploy   # applies versioned migrations to Postgres
npm run db:seed         # seed categories, products, coupons, demo accounts
```

## 5. Deploy to Vercel

1. Push the repo to GitHub.
2. In Vercel: **New Project → import repo**.
3. Framework preset: Next.js (auto-detected).
4. Add all environment variables from §3.
5. Deploy. Vercel provisions **HTTPS/SSL automatically** for your domain.

**Custom domain + SSL** (Vercel):
- Project → Settings → Domains → add `pjherbal.co.tz`.
- Add the DNS records Vercel provides; SSL certificate is issued automatically.

## 6. Deploy to a VPS (alternative)

```bash
# server setup
apt update && apt install -y nginx postgresql
# node 20 (or use the bundled .node/)
curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && apt install -y nodejs

# deploy
git clone <repo> /var/www/pjherbal
cd /var/www/pjherbal
npm ci
npx prisma migrate deploy
npm run build
npm run start -- -p 3000   # or PM2: pm2 start "npm run start" --name pjherbal
```

**Nginx reverse proxy + SSL (certbot)**:
```nginx
server {
  listen 80; server_name pjherbal.co.tz;
  location / { proxy_pass http://127.0.0.1:3000; proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade; proxy_set_header Connection "upgrade";
    proxy_set_header Host $host; proxy_set_header X-Real-IP $remote_addr; }
}
```
```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d pjherbal.co.tz   # enables automatic HTTPS
```

## 7. Daily backups (Recovery System)

`npm run backup` snapshots only `prisma/dev.db` into `backups/` (keeps last 14,
tune with `BACKUP_KEEP`). It deliberately never archives `.env` or secrets.

**PostgreSQL daily dump + retention:**
```bash
#!/bin/bash
# /etc/cron.daily/pjherbal-backup
mkdir -p /var/backups/pjherbal
pg_dump "$DATABASE_URL" | gzip > "/var/backups/pjherbal/db-$(date +%F-%H%M).sql.gz"
find /var/backups/pjherbal -name '*.sql.gz' -mtime +14 -delete
```
```bash
chmod +x /etc/cron.daily/pjherbal-backup
```

**Windows (local dev) Task Scheduler:**
```powershell
schtasks /Create /TN "PJHERBAL Backup" /TR "cmd /c \"cd /d C:\path\to\project && npm run backup\"" /SC DAILY /ST 03:00
```

**Recovery:**
- SQLite: unzip the backup to `prisma/dev.db`.
- Postgres: `gunzip -c backups/db-*.sql.gz | psql "$DATABASE_URL"`.

## 8. Post-deployment verification

- [ ] `https://pjherbal.co.tz` loads over HTTPS (lock icon)
- [ ] Homepage, Shop, Product, Cart, Checkout all return 200
- [ ] Test checkout with a real order in `manual` mode
- [ ] `/robots.txt` and `/sitemap.xml` exist; submit sitemap to Google Search Console
- [ ] Claim/verify the **Google Business Profile** and set `NEXT_PUBLIC_GOOGLE_MAPS_URL`
- [ ] WhatsApp number receives order confirmations
- [ ] Backups are running (`/var/backups/pjherbal` has today's file)
- [ ] `/api/health` returns database status 200
- [ ] Analytics pixels fire (GA debug view / Meta Events Manager test)

## 9. Go-live checklist

1. Switch schema provider to `postgresql`; migrate + seed.
2. Set real `AUTH_SECRET` and WhatsApp number.
3. Choose a payment provider; if not `manual`, configure gateway env vars and verify webhooks.
4. Replace placeholder SVGs with optimized product photography.
5. Set `NEXT_PUBLIC_SITE_URL` to the production domain.
6. Configure email/SMS providers (see FUTURE_ROADMAP) or keep console logging.

## 10. Safe load testing

Run only against local/staging systems:

```bash
RATE=10 DURATION=10 npm run load:test
RATE=50 DURATION=10 npm run load:test
RATE=100 DURATION=10 npm run load:test
RATE=200 DURATION=10 npm run load:test
```

Set `BASE_URL` and `ENDPOINT` to test another environment. The script targets
`/api/health` by default and does not create orders or modify data.
