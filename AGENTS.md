# PJHERBAL Clinic – developer handover notes

This file helps a new developer work efficiently in this repo.

## Quick commands

- Dev server: `npm run dev` (or `npm run dev:clean` if it ever hangs on "Starting...").
- Node is bundled in `.node/` — `npm`/`node` may not be on PATH on Windows; prepend `.node` or use `scripts/dev.cmd`.
- Typecheck: `npm run typecheck` · Build: `npm run build` · Seed: `npm run db:seed` · Backup: `npm run backup`.

## Where things live

- `src/app` — pages + API route handlers (`/api/**`).
- `src/components` — UI: `layout/`, `home/`, `product/`, `shop/`, `cart/`, `admin/`, `dashboard/`, `ui/`.
- `src/lib` — business logic: `auth.ts`, `cart.ts`, `constants.ts` (delivery zones), `payments/*`, `notify.ts` (email/SMS), `notifications.ts` (follow-up engine), `chatbot.ts`, `activity.ts`, `analytics.ts`.
- `src/context` — `CartContext` (localStorage cart + coupon), `SearchContext`.
- `prisma` — `schema.prisma` + `seed.ts`.
- `docs/` — SRS, manuals, API/DB/deployment references. **Read SRS.md first.**
- `backend/`, `frontend/`, `database/` — legacy prototypes; the active app is `src/`.

## Conventions

- Statuses are strings (SQLite has no enums); validate in the app layer.
- Admin API routes use `requireApiAdmin()`/`requireBackOffice()`; middleware guards pages.
- Add new delivery zones in `DELIVERY_ZONES` (`src/lib/constants.ts`).
- Secrets come from env vars only — never hard-code credentials.
- Server logic logs via `src/lib/logger.ts`; client errors POST to `/api/log`.

## Verification before finishing a task

```bash
npm run typecheck
npm run build
```

The dev server is at http://localhost:3000. See docs/DEPLOYMENT.md for production.
