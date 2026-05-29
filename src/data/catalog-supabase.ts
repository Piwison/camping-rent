import type { GearItem, GearBundle } from "@/types/gear";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabase } from "@/lib/supabase";
import { rowToItem, rowToBundle, type ItemRow, type BundleRow } from "./catalog-mappers";

// Supabase/Postgres Catalog adapter (ADR-0006). Reads only — writes land in the
// CRUD slice. Each bundle's ordered itemIds come from the bundle_items join.

async function bundleItemIds(db: SupabaseClient, bundleId: string): Promise<string[]> {
  const { data, error } = await db
    .from("bundle_items")
    .select("item_id, position")
    .eq("bundle_id", bundleId)
    .order("position");
  if (error) throw error;
  return (data ?? []).map((r) => r.item_id as string);
}

async function hydrateBundle(db: SupabaseClient, row: BundleRow): Promise<GearBundle> {
  return rowToBundle(row, await bundleItemIds(db, row.id));
}

export async function listItems(): Promise<GearItem[]> {
  const db = getSupabase();
  const { data, error } = await db.from("items").select("*").eq("available", true).order("id");
  if (error) throw error;
  return (data as ItemRow[]).map(rowToItem);
}

export async function listBundles(): Promise<GearBundle[]> {
  const db = getSupabase();
  const { data, error } = await db.from("bundles").select("*").eq("available", true).order("id");
  if (error) throw error;
  return Promise.all((data as BundleRow[]).map((row) => hydrateBundle(db, row)));
}

export async function featuredItems(): Promise<GearItem[]> {
  return (await listItems()).filter((i) => i.featured);
}

export async function featuredBundles(): Promise<GearBundle[]> {
  return (await listBundles()).filter((b) => b.featured);
}

export async function getItemBySlug(slug: string): Promise<GearItem | undefined> {
  const db = getSupabase();
  const { data, error } = await db
    .from("items")
    .select("*")
    .eq("slug", slug)
    .eq("available", true)
    .maybeSingle();
  if (error) throw error;
  return data ? rowToItem(data as ItemRow) : undefined;
}

export async function getBundleBySlug(slug: string): Promise<GearBundle | undefined> {
  const db = getSupabase();
  const { data, error } = await db
    .from("bundles")
    .select("*")
    .eq("slug", slug)
    .eq("available", true)
    .maybeSingle();
  if (error) throw error;
  return data ? hydrateBundle(db, data as BundleRow) : undefined;
}

export async function getBundleItems(bundle: GearBundle): Promise<GearItem[]> {
  if (bundle.itemIds.length === 0) return [];
  const db = getSupabase();
  const { data, error } = await db
    .from("items")
    .select("*")
    .in("id", [...new Set(bundle.itemIds)]);
  if (error) throw error;
  const byId = new Map((data as ItemRow[]).map((r) => [r.id, rowToItem(r)] as const));
  // Preserve the bundle's order and any duplicates (e.g. two chairs).
  return bundle.itemIds
    .map((id) => byId.get(id))
    .filter((item): item is GearItem => item !== undefined);
}

export async function allCatalogSlugs(): Promise<string[]> {
  const db = getSupabase();
  const [items, bundles] = await Promise.all([
    db.from("items").select("slug").eq("available", true),
    db.from("bundles").select("slug").eq("available", true),
  ]);
  if (items.error) throw items.error;
  if (bundles.error) throw bundles.error;
  return [...items.data, ...bundles.data].map((r) => r.slug as string);
}
