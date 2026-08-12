# PJHERBAL Clinic – Future Improvements Roadmap

This documents features the business may need as it grows. None are required for the
current launch; each is scoped so it can be added without restructuring the system.

## 1. Refund Management
Status: **Planned (post-launch).**
- Add `Refund` model (orderId, amount, reason, status, method, processedBy).
- Admin "Create refund" action on order detail; sets `PaymentLog` to `REFUNDED` and
  `order.paymentStatus` to `REFUNDED`.
- Customer-facing refund status on My Orders.
- The `PaymentLog` append-only table already supports the audit trail this needs.

## 2. Email Notifications (real provider)
Status: **Ready to configure.**
`src/lib/notify.ts` abstracts email behind `NotifyProvider` (console by default).
To go live: implement an SMTP provider (`nodemailer` or an API provider) and select it
with `EMAIL_PROVIDER`. Send: order confirmation, payment received, dispatched,
delivered + follow-up.

## 3. SMS Notifications (real provider)
Status: **Ready to configure.**
Same abstraction (`SMS_PROVIDER`). Implement Infobip or Twilio. Send: order confirmations,
payment reminders, delivery updates.

## 4. WhatsApp Business API
Status: **Planned.**
- Current: `wa.me` chat links + chatbot handoff (no API credentials needed).
- Upgrade: register with Meta WhatsApp Business API, use template messages for
  order updates, and a webhook for inbound messages. Keep the existing `whatsapp.ts`
  helpers and extend them with API calls behind a provider.

## 5. Payment gateway activation
Status: **Stubs ready.**
Adapters for Selcom, Flutterwave, and DPO exist behind the `PaymentAdapter` interface.
Activate by setting `PAYMENT_PROVIDER`, filling env credentials, and verifying webhooks.

## 6. Advanced reports
Status: **Planned.**
- Export Dashboard/Reports to CSV/PDF.
- Date-range filters, per-product profitability, coupon redemption analysis.

## 7. Account security hardening
- Login rate limiting (e.g. upstash/Redis or DB-based).
- Two-factor authentication for admins.
- Email verification on registration.

## 8. Customer retention extras
- Loyalty points program.
- Post-purchase cross-sell emails ("customers also bought").
- Automated win-back campaign for customers inactive 30+ days (reuses the
  follow-up engine in `src/lib/notifications.ts`).

## 9. Scheduled promotions UI
Coupons already support start/end windows. Add a dedicated **Promotions** page later
with flash-deal scheduling (product + discounted price + window) if the business asks.

## 10. Performance & scale
- Move images to a CDN and serve real optimized photos.
- Add Redis caching for catalogue queries.
- Partition analytics/activity tables in Postgres if they grow large.
