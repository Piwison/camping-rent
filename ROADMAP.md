# Basecamp & Co. — Product Roadmap

> Glamping gear rental for Taiwan's **Weekend Escapist**. Every item on this
> roadmap is filtered through one question from the PRD: **"does this feel
> glamping?"** — aesthetic comfort and lifestyle appeal over survival utility.

Derived from `CONTEXT.md` (domain glossary / PRD) and the current codebase
(Next.js 15, React 19, Tailwind v4, Framer Motion).

---

## Guiding constraints (from the PRD)

- **MVP has no payment, no accounts, no real-time availability.** A Booking
  ends at "Submit Enquiry"; confirmation happens offline within 24 hours.
- **Catalog lives in `/data/gear.ts`** until the Vendor Dashboard (Phase 2).
- **Bundles** are fixed weekend (Fri–Sun) prices; **Items** are per-day.
- All pricing in **TWD (NT$)**; all surfaces bilingual **EN / 中文**.

---

## Phase 0 — Foundation _(largely complete)_

The design system and core browsing experience.

- [x] Design tokens, typography (Playfair Display + DM Sans), warm palette
- [x] Catalog data model — 3 bundle tiers + 12+ items in `/data/gear.ts`
- [x] Home page — Hero, Featured Bundles, Brand Story, Editorial Grid
- [x] Gear catalog with category filtering + gear detail pages
- [x] About page
- [x] Booking enquiry flow (dates, items/bundles, contact) — no payment

## Phase 1 — MVP Polish & Launch _(current)_

Make it _feel_ glamping and get it ship-ready for real enquiries.

- [x] **Hero depth-parallax animations** + scroll cue (this iteration)
- [x] Migrate all imagery to `next/image` — responsive `sizes`, lazy-loading,
      `priority` on LCP images, picsum allowlisted via `remotePatterns`
- [ ] Replace placeholder picsum photos with real glamping photography
      (self-host under `/public`, or add the CDN host to `remotePatterns`)
- [x] Wire enquiry submission to a real channel — booking enquiries POST to a
      validated `/api/enquiry` route that writes a row to a Notion database
      (with a dev/log fallback when no credentials are set); UI has
      submitting + error states
- [x] Form validation on the booking flow — inline per-field errors (name,
      email, dates), past-date guard + native date `min`, a Fri–Sun weekend
      hint for bundles, sharing the server's validateEnquiry rules
- [x] SEO + Open Graph metadata per page; dynamic sitemap.xml + robots.txt,
      metadataBase + title template, a branded OG image, and per-item OG tags
      on gear detail pages (set `NEXT_PUBLIC_SITE_URL` for production URLs)
- [x] Basic analytics — provider-agnostic `track()` seam (ADR-0005) emitting
      page views + the enquiry funnel (added → submitted → succeeded/failed);
      default sink logs in dev / pushes to `dataLayer`, pluggable provider later
- [x] Accessibility pass — global `prefers-reduced-motion` (MotionConfig + CSS),
      skip-to-content link, focusable `<main>`, mobile-nav `aria-expanded`/
      `aria-controls`, labelled image-thumbnail buttons, `theme-color`
- [x] Deeper perf — fonts migrated to `next/font/google` (Playfair Display +
      DM Sans now self-hosted as woff2 and preloaded; the external Google Fonts
      `<link>`/preconnect are gone). _Still to do: a Lighthouse audit on deploy._

## Phase 2 — Vendor Dashboard & Operations

The PRD's explicit Phase 2 (see issue #3): let the gear owner manage the
catalog without code. Backed by Supabase (ADR-0006/0007/0008).

- [x] Admin auth for the vendor — Supabase email+password, `/admin` gated by
      middleware + `requireVendor`
- [x] Catalog CRUD — add/edit/remove items & bundles (photo upload deferred:
      image URLs for now, per the post-Phase-2 photography plan)
- [x] Availability toggles (mark gear in/out of service) — public reads hide
      unavailable gear
- [x] Enquiry management — inbox, status (new → confirmed → fulfilled /
      cancelled), offline-confirmation workflow
- [x] Migrate catalog source of truth from `/data/gear.ts` to a datastore —
      Catalog store reads Postgres in production, the in-memory `gear.ts` in
      dev/tests, behind one async seam (ADR-0008); `npm run seed` loads it

## Phase 3 — Real-time & Transactions

Remove the manual offline loop.

- [x] Real-time availability calendar (per item / bundle, per weekend) — Items
      carry a **Stock** count; a submitted Booking places **Reservations** and
      the Enquiry is rejected if gear is short for those dates. Availability is
      pure logic (`src/lib/availability.ts`); the gear detail page shows a
      Weekend strip (ISR). Holds follow the Enquiry: confirm → held, cancel →
      released (ADR-0009).
- [x] Online payment + deposits (TWD) — a deposit (default 30%) secures a
      Booking via ECPay (綠界); balance still settled offline. Provider-agnostic
      payment seam with ECPay as the adapter; the `CheckMacValue` hash is pinned
      by tests; settle happens on ECPay's verified server callback. Falls back to
      ECPay sandbox without credentials (ADR-0011).
- [x] Customer accounts & booking history — Customers share Supabase Auth; a
      signed-in **Account** links its Bookings via `user_id` and sees them at
      `/account`. The Vendor is gated by the `VENDOR_EMAILS` allowlist so a
      Customer can't reach `/admin` (ADR-0010).
- [ ] Automated booking confirmation + reminders

## Phase 4 — Growth & Retention

Deepen the brand and bring people back.

- [ ] Reviews / user-generated content from real trips
- [ ] Editorial lookbook & content (campsite guides, styling)
- [ ] Loyalty / repeat-booking incentives
- [ ] Bundle recommendations based on trip type / party size
- [ ] Expand beyond the initial region / campsite network

---

### Near-term suggestion

Phase 1's highest-leverage items are **real photography** and a **working
enquiry submission** — together they turn the site from a polished demo into
something that can take a real Weekend Escapist's booking.
