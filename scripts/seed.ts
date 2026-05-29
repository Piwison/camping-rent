// One-time seed: load the current Catalog from src/data/gear.ts into Postgres
// so the storefront looks identical on cutover (PRD #3, ADR-0006). Idempotent —
// items/bundles are upserted and bundle membership is rebuilt each run.
//
//   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npm run seed
//
// Run the schema first: supabase/migrations/20260529120000_init.sql

import { listItems, listBundles } from "../src/data/gear";
import { getSupabase } from "../src/lib/supabase";
import type { GearItem, GearBundle } from "../src/types/gear";

function toItemRow(i: GearItem) {
  return {
    id: i.id,
    slug: i.slug,
    name: i.name,
    name_chinese: i.nameChinese,
    category: i.category,
    daily_price: i.dailyPrice,
    description: i.description,
    description_chinese: i.descriptionChinese,
    images: i.images,
    specs: i.specs,
    featured: i.featured ?? false,
  };
}

function toBundleRow(b: GearBundle) {
  return {
    id: b.id,
    slug: b.slug,
    name: b.name,
    name_chinese: b.nameChinese,
    tier: b.tier,
    tagline: b.tagline,
    description: b.description,
    bundle_price: b.bundlePrice,
    original_price: b.originalPrice,
    images: b.images,
    featured: b.featured ?? false,
  };
}

async function seed(): Promise<void> {
  const db = getSupabase();
  const items = listItems();
  const bundles = listBundles();

  const { error: itemsErr } = await db.from("items").upsert(items.map(toItemRow));
  if (itemsErr) throw itemsErr;

  const { error: bundlesErr } = await db.from("bundles").upsert(bundles.map(toBundleRow));
  if (bundlesErr) throw bundlesErr;

  // Rebuild ordered membership so positions/duplicates match gear.ts exactly.
  for (const b of bundles) {
    const { error: delErr } = await db.from("bundle_items").delete().eq("bundle_id", b.id);
    if (delErr) throw delErr;

    const rows = b.itemIds.map((item_id, position) => ({
      bundle_id: b.id,
      position,
      item_id,
    }));
    const { error: insErr } = await db.from("bundle_items").insert(rows);
    if (insErr) throw insErr;
  }

  console.log(`Seeded ${items.length} items and ${bundles.length} bundles.`);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
