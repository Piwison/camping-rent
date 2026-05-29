# CLAUDE.md

Guidance for agents working in this repo. Read `CONTEXT.md` for the domain
language and use those terms exactly; check `docs/adr/` before changing
anything architectural.

## What this is

**Basecamp & Co.** — a glamping gear rental site for Taiwan's **Weekend
Escapist**. Customers browse the **Catalog** (**Items** and **Bundles**), build
a **Booking**, and submit an **Enquiry**; the **Vendor** confirms offline. MVP
has no payment, accounts, or real-time availability (see ADR-0002). Every
product decision is filtered through: _"does this feel glamping?"_

Stack: Next.js 15 (App Router) · React 19 · TypeScript (strict) · Tailwind v4 ·
Framer Motion · Vitest.

## Commands

```bash
npm run dev      # local dev server
npm run build    # production build (also the type/route check)
npm test         # Vitest unit tests
npm run lint     # next lint
```

## Project layout

All application source lives under `src/`. The `@/*` import alias maps to
`./src/*` (set in `tsconfig.json`; mirrored in `vitest.config.ts`).

```
src/
├── app/         # Next.js App Router: routes, layout, api/enquiry, sitemap/robots/OG
├── components/  # React components, grouped by area (home, catalog, booking, …)
├── data/        # gear.ts — the Catalog source of truth + query helpers (ADR-0001)
├── lib/         # pure logic: pricing, enquiry validation, Notion delivery, site meta
└── types/       # shared domain types (GearItem, GearBundle, BookingItem)
tests/           # Vitest specs (kept at repo root; setup in tests/setup.ts)
docs/adr/        # architecture decision records
CONTEXT.md       # domain glossary — the canonical language
ROADMAP.md       # phased build plan
```

## Conventions

- **Speak the domain.** Use `CONTEXT.md` vocabulary in code, tests, and prose
  (Item, Bundle, Booking, Enquiry, Weekend, Tier, Vendor). Don't drift to
  "order", "cart", "product".
- **Catalog is code.** Edit gear in `src/data/gear.ts`; route reads through the
  query helpers, not the raw arrays, so the Phase 2 datastore swap stays behind
  that seam (ADR-0001).
- **Enquiry delivery is seam-able.** `deliverEnquiry` in `src/lib/enquiry-sink.ts`
  is the role-named boundary; the Notion call is a private adapter behind it, and
  without env vars it logs and returns `skipped` (ADR-0003).
- **Pricing rule:** Bundles are a flat **Weekend** price; Items are per night.
  This lives in `src/lib/pricing.ts` and is enforced by `calcBookingTotal`.
- **Pure logic in `lib/`, rendering in `components/`.** Keep `lib/` free of
  React so it stays unit-testable.
- **TWD only**, formatted `NT$X,XXX` via `formatTWD`.

## Working here

- Run `npm test` and `npm run build` before reporting a change complete; the
  build is also the route + type check.
- New architectural decision worth remembering? Add an ADR (`docs/adr/`, next
  sequential number) per `.agents/skills/grill-with-docs/ADR-FORMAT.md`.
- New or sharpened domain term? Update `CONTEXT.md` inline.

## Available skills

Vendored under `.agents/skills/`:

- **grill-with-docs** — stress-test a plan against the glossary/ADRs and update
  docs inline as decisions crystallise.
- **improve-codebase-architecture** — find deepening opportunities; emits an
  HTML report.
- **to-prd** — turn the current context into a PRD for the issue tracker.
- **tdd** — red-green-refactor, one test at a time.
- **prototype** — throwaway prototype for a design/logic question.
- **handoff** — compact the conversation into a handoff doc for the next agent.
