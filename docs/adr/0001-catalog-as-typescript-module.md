# Catalog lives in a TypeScript module, not a datastore

For the MVP the **Catalog** (all **Items** and **Bundles**) is a hand-edited
TypeScript module (`src/data/gear.ts`) read directly at build time, rather than
a database. This keeps the catalog version-controlled, type-checked, and
trivially statically rendered while the catalog is small and changes rarely.

## Consequences

- Catalog edits require a code change and redeploy — acceptable while the
  **Vendor** is not yet self-serve.
- Query helpers (`getItemBySlug`, `getBundleBySlug`, `getBundleItems`, …) are
  the seam: when the catalog moves to a datastore (Phase 2 Vendor Dashboard),
  callers should keep using these functions so only their implementation
  changes.
