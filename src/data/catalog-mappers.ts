import type { GearItem, GearBundle, GearCategory } from "@/types/gear";

// Postgres row shapes (snake_case) ↔ domain types (camelCase). Pure functions,
// unit-tested, so the supabase adapter's read path is just "query + map".

export interface ItemRow {
  id: string;
  slug: string;
  name: string;
  name_chinese: string;
  category: string;
  daily_price: number;
  description: string;
  description_chinese: string;
  images: string[];
  specs: { label: string; value: string }[];
  featured: boolean;
  available: boolean;
}

export interface BundleRow {
  id: string;
  slug: string;
  name: string;
  name_chinese: string;
  tier: string;
  tagline: string;
  description: string;
  bundle_price: number;
  original_price: number;
  images: string[];
  featured: boolean;
  available: boolean;
}

export function rowToItem(r: ItemRow): GearItem {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    nameChinese: r.name_chinese,
    category: r.category as GearCategory,
    dailyPrice: r.daily_price,
    description: r.description,
    descriptionChinese: r.description_chinese,
    images: r.images ?? [],
    specs: r.specs ?? [],
    featured: r.featured,
    available: r.available,
  };
}

// itemIds come from the ordered bundle_items join, not the bundle row itself.
export function rowToBundle(r: BundleRow, itemIds: string[]): GearBundle {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    nameChinese: r.name_chinese,
    tier: r.tier as GearBundle["tier"],
    tagline: r.tagline,
    description: r.description,
    itemIds,
    bundlePrice: r.bundle_price,
    originalPrice: r.original_price,
    images: r.images ?? [],
    featured: r.featured,
    available: r.available,
  };
}
