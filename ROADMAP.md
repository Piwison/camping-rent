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
- [ ] Replace placeholder photography (picsum) with real glamping imagery;
      move to `next/image` for optimization
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
- [ ] Basic analytics (page + enquiry-funnel events)
- [ ] Accessibility & performance pass — `prefers-reduced-motion` everywhere,
      keyboard/focus states, Lighthouse, font/image loading

## Phase 2 — Vendor Dashboard & Operations

The PRD's explicit Phase 2: let the gear owner manage the catalog without code.

- [ ] Admin auth for the vendor
- [ ] Catalog CRUD — add/edit/remove items & bundles, photo upload
- [ ] Availability toggles (mark gear in/out of service)
- [ ] Enquiry management — inbox, status, offline-confirmation workflow
- [ ] Migrate catalog source of truth from `/data/gear.ts` to a datastore

## Phase 3 — Real-time & Transactions

Remove the manual offline loop.

- [ ] Real-time availability calendar (per item / bundle, per weekend)
- [ ] Online payment + deposits (TWD)
- [ ] Customer accounts & booking history
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
