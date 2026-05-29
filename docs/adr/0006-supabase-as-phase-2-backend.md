---
status: accepted
---

# Supabase backs the Phase 2 datastore, vendor auth, and media

Phase 2 (Vendor Dashboard) needs persistence for the **Catalog**, authentication
for the **Vendor**, and somewhere to keep photos. We use **Supabase** for all
three — Postgres for the datastore, Supabase Auth for the single vendor login,
and Supabase Storage when photo upload arrives — rather than assembling a
separate database, auth library, and blob store.

One managed service covers the whole phase, runs on serverless/Vercel, and keeps
the Catalog/Enquiry read paths fast where Notion-as-a-database could not.

## Consequences

- Introduces a hosting dependency and a connection/secret to manage; the
  Catalog query functions (ADR-0001) become **async** when they read Postgres,
  which ripples into the routes/components that call them.
- Vendor auth is a single admin account, not customer accounts (still out of
  scope per ADR-0002).
