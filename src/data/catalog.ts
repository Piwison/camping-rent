import type { GearItem, GearBundle } from "@/types/gear";
import { isSupabaseConfigured } from "@/lib/supabase";
import * as memory from "./catalog-memory";
import * as supabase from "./catalog-supabase";

// The Catalog store — the one seam the app reads gear through (ADR-0001). It
// picks an adapter by config (ADR-0008): Supabase/Postgres in production,
// the in-memory gear.ts data in local dev and tests. Reads are async so the
// adapter can hit a datastore; storefront callers simply await.

export interface CatalogReader {
  listItems(): Promise<GearItem[]>;
  listBundles(): Promise<GearBundle[]>;
  featuredItems(): Promise<GearItem[]>;
  featuredBundles(): Promise<GearBundle[]>;
  getItemBySlug(slug: string): Promise<GearItem | undefined>;
  getBundleBySlug(slug: string): Promise<GearBundle | undefined>;
  getBundleItems(bundle: GearBundle): Promise<GearItem[]>;
  allCatalogSlugs(): Promise<string[]>;
}

function reader(): CatalogReader {
  return isSupabaseConfigured() ? supabase : memory;
}

export const listItems = (): Promise<GearItem[]> => reader().listItems();
export const listBundles = (): Promise<GearBundle[]> => reader().listBundles();
export const featuredItems = (): Promise<GearItem[]> => reader().featuredItems();
export const featuredBundles = (): Promise<GearBundle[]> => reader().featuredBundles();
export const getItemBySlug = (slug: string): Promise<GearItem | undefined> =>
  reader().getItemBySlug(slug);
export const getBundleBySlug = (slug: string): Promise<GearBundle | undefined> =>
  reader().getBundleBySlug(slug);
export const getBundleItems = (bundle: GearBundle): Promise<GearItem[]> =>
  reader().getBundleItems(bundle);
export const allCatalogSlugs = (): Promise<string[]> => reader().allCatalogSlugs();
