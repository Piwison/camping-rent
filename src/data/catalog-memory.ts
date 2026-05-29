import type { GearItem, GearBundle } from "@/types/gear";
import * as data from "./gear";

// In-memory Catalog adapter — backed by the literal data in gear.ts. Serves
// local dev and tests when Supabase is not configured (ADR-0008). Async to
// match the store interface; the data is synchronous underneath.

export async function listItems(): Promise<GearItem[]> {
  return [...data.listItems()];
}

export async function listBundles(): Promise<GearBundle[]> {
  return [...data.listBundles()];
}

export async function featuredItems(): Promise<GearItem[]> {
  return data.featuredItems();
}

export async function featuredBundles(): Promise<GearBundle[]> {
  return data.featuredBundles();
}

export async function getItemBySlug(slug: string): Promise<GearItem | undefined> {
  return data.getItemBySlug(slug);
}

export async function getBundleBySlug(slug: string): Promise<GearBundle | undefined> {
  return data.getBundleBySlug(slug);
}

export async function getBundleItems(bundle: GearBundle): Promise<GearItem[]> {
  return data.getBundleItems(bundle);
}

export async function allCatalogSlugs(): Promise<string[]> {
  return data.allCatalogSlugs();
}
