---
status: accepted
---

# Automated confirmations & reminders behind a notification seam (Resend)

Phase 3.4 automates the emails around a Booking: a confirmation to the Customer
and an alert to the Vendor on submit, a confirmation when the Vendor confirms,
and a reminder a couple of days before the trip. This trims the manual side of
the offline loop without removing the Vendor's control of it.

Notifications are a **provider-agnostic seam** (`src/lib/notify.ts`) — the same
pattern as the Enquiry sink, payment, and analytics. **Resend** is the private
adapter (a plain HTTPS call, no SDK); without `RESEND_API_KEY` messages are
logged and reported `skipped`, so local dev is unaffected. Email *content* is
pure (`notify-content.ts`) and unit-tested; the adapter only sends.

Reminders need a clock, so they run from a **secret-guarded cron route**
(`/api/cron/reminders`) that sweeps confirmed, not-yet-reminded bookings within
N days of check-in. `vercel.json` schedules it daily; Vercel passes
`CRON_SECRET` as a Bearer token.

## Consequences

- A booking is marked `reminded_at` only after a successful send, so reruns and
  a missing Resend key are safe (it'll retry once configured).
- Emails are best-effort: a send failure never fails the booking or the Vendor's
  status change (`notify*` swallow errors).
- New secrets to manage: `RESEND_API_KEY`, optional `NOTIFY_FROM` /
  `NOTIFY_VENDOR_TO`, and `CRON_SECRET`. The Vendor alert defaults to the first
  `VENDOR_EMAILS` entry (ADR-0010).
