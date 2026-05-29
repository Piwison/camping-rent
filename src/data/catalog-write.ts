import type { GearItem, GearBundle } from "@/types/gear";
import { getSupabase } from "@/lib/supabase";
import { rowToItem, rowToBundle, type ItemRow, type BundleRow } from "./catalog-mappers";
import {
  itemInputToRow,
  bundleInputToRow,
  type ItemInput,
  type BundleInput,
} from "./catalog-input";

// Admin-side Catalog access (Supabase service role, behind requireVendor).
// Reads here include unavailable records; the public seam (catalog.ts) hides
// them. Writes only exist against Postgres — the in-memory adapter is read-only.

export async function listAllItems(): Promise<GearItem[]> {
  const db = getSupabase();
  const { data, error } = await db.from("items").select("*").order("category").order("id");
  if (error) throw error;
  return (data as ItemRow[]).map(rowToItem);
}

export async function listAllBundles(): Promise<GearBundle[]> {
  const db = getSupabase();
  const { data, error } = await db.from("bundles").select("*").order("id");
  if (error) throw error;
  return Promise.all(
    (data as BundleRow[]).map(async (row) => rowToBundle(row, await bundleItemIds(row.id)))
  );
}

export async function getItemById(id: string): Promise<GearItem | undefined> {
  const db = getSupabase();
  const { data, error } = await db.from("items").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data ? rowToItem(data as ItemRow) : undefined;
}

export async function getBundleById(id: string): Promise<GearBundle | undefined> {
  const db = getSupabase();
  const { data, error } = await db.from("bundles").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data ? rowToBundle(data as BundleRow, await bundleItemIds(id)) : undefined;
}

async function bundleItemIds(bundleId: string): Promise<string[]> {
  const db = getSupabase();
  const { data, error } = await db
    .from("bundle_items")
    .select("item_id, position")
    .eq("bundle_id", bundleId)
    .order("position");
  if (error) throw error;
  return (data ?? []).map((r) => r.item_id as string);
}

export async function saveItem(input: ItemInput): Promise<void> {
  const db = getSupabase();
  const { error } = await db.from("items").upsert(itemInputToRow(input));
  if (error) throw error;
}

export async function deleteItem(id: string): Promise<void> {
  const db = getSupabase();
  const { error } = await db.from("items").delete().eq("id", id);
  if (error) throw error;
}

export async function saveBundle(input: BundleInput): Promise<void> {
  const db = getSupabase();
  const row = bundleInputToRow(input);
  const { error: upErr } = await db.from("bundles").upsert(row);
  if (upErr) throw upErr;

  // Rebuild ordered membership so positions/duplicates match the input exactly.
  const { error: delErr } = await db.from("bundle_items").delete().eq("bundle_id", row.id);
  if (delErr) throw delErr;
  if (input.itemIds.length) {
    const rows = input.itemIds.map((item_id, position) => ({
      bundle_id: row.id,
      position,
      item_id,
    }));
    const { error: insErr } = await db.from("bundle_items").insert(rows);
    if (insErr) throw insErr;
  }
}

export async function deleteBundle(id: string): Promise<void> {
  const db = getSupabase();
  // bundle_items cascade on the FK; remove the bundle row.
  const { error } = await db.from("bundles").delete().eq("id", id);
  if (error) throw error;
}

export async function setItemFlag(
  id: string,
  flag: "available" | "featured",
  value: boolean
): Promise<void> {
  const db = getSupabase();
  const { error } = await db.from("items").update({ [flag]: value }).eq("id", id);
  if (error) throw error;
}

export async function setBundleFlag(
  id: string,
  flag: "available" | "featured",
  value: boolean
): Promise<void> {
  const db = getSupabase();
  const { error } = await db.from("bundles").update({ [flag]: value }).eq("id", id);
  if (error) throw error;
}
