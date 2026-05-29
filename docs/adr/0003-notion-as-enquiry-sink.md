---
status: superseded by ADR-0007
---

# Notion is the Enquiry sink, with a log fallback

> **Superseded by [ADR-0007](0007-enquiries-move-into-the-datastore.md):** from
> Phase 2 the Enquiry sink is Postgres, not Notion. The `deliverEnquiry` seam
> below is unchanged — only its private adapter swaps. Kept for MVP history.

Submitted **Enquiries** are written as rows in a Notion database via the Notion
API. The delivery seam is `deliverEnquiry` in `src/lib/enquiry-sink.ts` (named
for its role); the Notion call is a private adapter behind it. When the
`NOTION_TOKEN` / `NOTION_ENQUIRIES_DB_ID` env vars are absent (e.g. local dev),
the Enquiry is logged to the server console instead and reported as `skipped`,
so the **Booking** flow stays usable without credentials.

Notion gives the **Vendor** a zero-maintenance, already-familiar inbox for
managing Enquiries, avoiding the cost of building and operating a database and
admin UI at MVP scale.

## Consequences

- Couples Enquiry delivery to Notion's API shape and rate limits; the
  `deliverEnquiry` function is the seam to swap providers behind.
- The `skipped` (no-credentials) path means a green local run does not prove
  real delivery — only that validation and the request shape are correct.
