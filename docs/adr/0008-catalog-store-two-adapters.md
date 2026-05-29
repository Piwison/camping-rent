# The Catalog store has two adapters, selected by config

The Catalog store (`src/data/catalog.ts`) exposes one async read interface with
two adapters behind it: an **in-memory** adapter backed by `src/data/gear.ts`,
and a **Supabase/Postgres** adapter (ADR-0006). `isSupabaseConfigured()` picks
the Supabase adapter when credentials are present, otherwise the in-memory one.

This keeps the store fully testable and runnable without a live database — local
dev and CI use the in-memory adapter; production uses Postgres — while honouring
ADR-0001's single seam. Two real adapters (not one) is what makes the seam
genuine.

## Consequences

- Catalog reads are **async** (`Promise`-returning) even for the in-memory
  adapter, so the interface is uniform; storefront server components `await`.
- `gear.ts` keeps a second life as the in-memory data source and the seed input,
  so it must stay in sync with the schema until it is retired.
- The Supabase adapter's query code is thin; its correctness rests on the pure,
  unit-tested row mappers (`catalog-mappers.ts`) plus a live-DB smoke test.
