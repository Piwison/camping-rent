---
status: accepted
---

# Reviews — any signed-in Customer, item/bundle/experience, auto-published

Phase 4 opens **Reviews** to bring social proof to the storefront. A **Review**
is a star rating (1–5) plus an optional note from any signed-in **Account**
holder (a fulfilled booking is **not** required), attached to an **Item**, a
**Bundle**, or the **overall experience**. Reviews are **auto-published** — no
Vendor moderation step.

Reuses the existing seams: one `reviews` table (RLS deny-all), storefront reads
server-side with the service-role key, writes through a Customer-gated route
(`/api/reviews`) that stamps the verified `user_id`. Pure logic
(`src/lib/reviews.ts`) does validation and the average/count maths and is
unit-tested.

## Considered options

- **Verified-buyers only / moderation queue** — higher trust, but the chosen
  scope favours volume of social proof and less Vendor overhead. (Both are easy
  to add later: gate the route on a fulfilled booking, or add an `approved`
  column + an admin inbox like Enquiries.)

## Consequences

- Per-gear Reviews + average render on the Catalog detail pages (ISR, so a new
  review shows after revalidation; the submit form also adds it optimistically).
  Experience Reviews render as home-page testimonials and are written from the
  account area.
- The detail pages stay statically/ISR-rendered: viewer auth is detected
  **client-side** (browser Supabase) so reading cookies doesn't force the page
  dynamic; the POST re-checks the session server-side as the authority.
- Without Supabase configured, review reads return empty and the sections render
  nothing — the storefront is unchanged in local dev.
- No new env or third-party service; auto-publish means a spam/abuse review is
  public until manually removed (accepted trade-off for the MVP).
