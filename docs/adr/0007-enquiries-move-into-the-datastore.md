---
status: accepted
---

# Enquiries move into the datastore (supersedes ADR-0003)

With a datastore in place (ADR-0006), submitted **Enquiries** are stored in
Postgres rather than Notion, so the Vendor's inbox and offline-confirmation
workflow can query and update them as first-class records (status, timestamps).

The `deliverEnquiry` seam in `src/lib/enquiry-sink.ts` is unchanged; only its
private adapter swaps from `postToNotion` to a Postgres insert. The seam's role
name (from the #3 rename) is what makes this a drop-in.

## Consequences

- **Supersedes ADR-0003** (Notion as the Enquiry sink). Notion is no longer the
  store; it may remain as an optional secondary notification, but is not required.
- The `skipped`-without-credentials fallback now keys off the datastore
  connection instead of the Notion env vars.
- Enables the Phase 2 "Enquiry management" item: an inbox with status and the
  offline-confirmation loop.
