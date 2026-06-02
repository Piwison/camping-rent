---
status: accepted
---

# Customer accounts on the same Supabase Auth, Vendor gated by allowlist

Phase 3.2 lets a **Weekend Escapist** create an **Account** to see their booking
history. Rather than a second auth system, Customers share the existing Supabase
Auth user pool (ADR-0006) — a Customer is simply any authenticated user who is
**not** the Vendor.

The Vendor is now identified by the `VENDOR_EMAILS` allowlist (comma-separated)
instead of "any authenticated user", which would otherwise let a freshly
signed-up Customer reach `/admin`. `getVendor` and `getCustomer` both read the
same session and split on that list. Submitted Enquiries carry the Customer's
`user_id` when signed in (guests stay anonymous), which backs the
"my bookings" list.

## Considered options

- **Separate customer auth (e.g. a second provider/table)** — more moving parts
  and secrets for one shared login concept; rejected.
- **A `profiles` table with a role column** — heavier than needed for a single
  Vendor; an env allowlist is enough and keeps role config out of the data.

## Consequences

- **`VENDOR_EMAILS` must be set in any environment with Customer sign-ups**, or
  the Vendor guard falls back to "any authenticated user" (with a server warning)
  for back-compat with the pre-accounts setup.
- Middleware now guards `/account` as well as `/admin`, redirecting to the
  matching login; role separation stays in the server guards.
- Account history reads the Customer's own Enquiries server-side via the
  service-role key filtered by their verified `user_id` — RLS stays deny-all
  (no anon table access), consistent with the rest of the schema.
