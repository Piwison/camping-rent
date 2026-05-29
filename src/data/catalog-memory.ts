import type { GearItem, GearBundle } from "@/types/gear";
import * as data from "./gear";

// In-memory Catalog adapter — backed by the literal data in gear.ts. Serves
// local dev and tests when Supabase is not configured (ADR-0008). Async to
// match the store interface; the data is synchronous underneath.

// Public reads hide gear the Vendor has marked unavailable; absent = available.
const isAvailable = (x: { available?: boolean }) => x.available !== false;

export async function listItems(): Promise<GearItem[]> {
  return data.listItems().filter(isAvailable);
}

export async function listBundles(): Promise<GearBundle[]> {
  return data.listBundles().filter(isAvailable);
}

export async function featuredItems(): Promise<GearItem[]> {
  return data.featuredItems().filter(isAvailable);
}

export async function featuredBundles(): Promise<GearBundle[]> {
  return data.featuredBundles().filter(isAvailable);
}

export async function getItemBySlug(slug: string): Promise<GearItem | undefined> {
  const item = data.getItemBySlug(slug);
  return item && isAvailable(item) ? item : undefined;
}

export async function getBundleBySlug(slug: string): Promise<GearBundle | undefined> {
  const bundle = data.getBundleBySlug(slug);
  return bundle && isAvailable(bundle) ? bundle : undefined;
}

export async function getBundleItems(bundle: GearBundle): Promise<GearItem[]> {
  return data.getBundleItems(bundle);
}

export async function allCatalogSlugs(): Promise<string[]> {
  return data.allCatalogSlugs();
}
