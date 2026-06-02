---
status: accepted
---

# Online deposits via ECPay (綠界), behind a payment seam

Phase 3.3 adds an online **deposit** to secure a **Booking** — the remaining
balance is still settled offline with the **Vendor**, so the manual
confirmation loop stays. We charge a configurable percent of the total (default
30%) through **ECPay (綠界)**, Taiwan's most common gateway, chosen for local
TWD settlement and local payment methods (credit card, ATM, convenience store).

Payment is a **provider-agnostic seam** (`src/lib/payment.ts`) mirroring the
Enquiry-sink/analytics pattern: the routes call `buildCheckout` /
`verifyCallback`, and ECPay's specifics — the AIO field set and the
`CheckMacValue` integrity hash — live behind it. The MAC's fiddly .NET-style URL
encoding is isolated in `ecpay-mac.ts` and pinned by unit tests.

## Considered options

- **NewebPay / Stripe** — NewebPay is equivalent but the Vendor had no account;
  Stripe has the nicest API but no local methods and slower TW onboarding.
  ECPay was the decision (see the Phase 3 kickoff).
- **Charge the full amount online** — rejected; a deposit keeps the low-friction,
  Vendor-confirmed model of ADR-0002 while reducing no-shows.

## Consequences

- **Partially supersedes ADR-0002** (the "no payment" constraint) — a deposit is
  now taken; full transactional checkout and refunds are still out of scope.
- A `payments` table records each checkout keyed by the ECPay `MerchantTradeNo`;
  the Enquiry carries a coarse `payment_status` for the dashboards. RLS stays
  deny-all (service-role only).
- The authoritative settle happens on ECPay's **server-to-server callback**
  (`/api/payment/ecpay/callback`), which verifies the signature before trusting
  the result and must reply `1|OK`. The shopper's return page is advisory.
- Without credentials the app falls back to ECPay's **sandbox** test merchant so
  the flow is exercisable; real money requires `ECPAY_MODE=production` plus live
  keys. The callback needs a public origin to be received.
