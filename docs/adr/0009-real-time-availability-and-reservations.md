---
status: accepted
---

# Real-time availability via stock counts and Reservations (Phase 3)

Phase 3 removes the MVP's "no real-time availability" constraint (ADR-0002).
Each **Item** now carries a **Stock** count, and a submitted **Booking** places
**Reservations** — held units of an Item for a Weekend — so the storefront can
show, and the Enquiry flow can enforce, what is actually free.

We model availability per Item with quantities (not a single-unit boolean): a
Weekend's availability is `stock − peak concurrent reserved units` over the
requested range, computed in pure logic (`src/lib/availability.ts`) and fed by a
thin datastore read (`availability-service.ts`). A **Bundle**'s availability is
the limiting component — `min(floor(free / needed))` across its Items, honouring
duplicates (a Bundle with two chairs needs two free chairs per set).

## Considered options

- **Single-unit availability (boolean per Weekend)** — simpler, but a Bundle
  that contains two chairs could never coexist with renting a chair separately.
  Quantities reflect the Vendor's real stock and keep Bundles composable.
- **Availability calendar as a separate service** — overkill for one Vendor at
  low volume; a `reservations` table plus the pure peak-overlap calc is enough.

## Consequences

- **Partially supersedes ADR-0002** — only the availability constraint. Online
  payment and customer accounts remain out of scope until their own slices.
- Reservation lifecycle tracks the Enquiry: submit creates `held` units;
  the Vendor confirming the Enquiry promotes them to `confirmed`; cancelling
  `releases` them so stock frees up. Status changes flow through
  `syncReservationsToEnquiryStatus`.
- The authoritative availability check runs server-side at Enquiry submit
  (`deliverEnquiry` returns `unavailable` with the short gear); the storefront
  Weekend strip is ISR (5-minute revalidate) and advisory only.
- Without Supabase (local dev/tests) there are no Reservations, so everything
  reports freely available and the booking flow stays usable, matching the
  degradation posture of the other seams.
