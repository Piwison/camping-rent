import type { GearCategory, GearItem, GearBundle } from "@/types/gear";
import type { ItemRow, BundleRow } from "./catalog-mappers";

// Editable shapes for the Vendor CRUD forms, plus pure validation and the
// domain → Postgres row mapping. Kept free of any datastore so it's unit-tested.

const CATEGORIES: GearCategory[] = [
  "shelter",
  "furniture",
  "kitchen",
  "lighting",
  "bedding",
  "other",
];
const TIERS: GearBundle["tier"][] = ["solo", "standard", "deluxe"];
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export interface ItemInput {
  id?: string;
  slug: string;
  name: string;
  nameChinese: string;
  category: string;
  dailyPrice: number;
  description: string;
  descriptionChinese: string;
  images: string[];
  specs: { label: string; value: string }[];
  featured: boolean;
  available: boolean;
}

export interface BundleInput {
  id?: string;
  slug: string;
  name: string;
  nameChinese: string;
  tier: string;
  tagline: string;
  description: string;
  bundlePrice: number;
  originalPrice: number;
  images: string[];
  itemIds: string[];
  featured: boolean;
  available: boolean;
}

export type ValidationResult = { valid: boolean; errors: Record<string, string> };

export function validateItemInput(input: ItemInput): ValidationResult {
  const errors: Record<string, string> = {};
  if (!input.slug?.trim()) errors.slug = "Slug is required.";
  else if (!SLUG_RE.test(input.slug)) errors.slug = "Slug must be lowercase words separated by hyphens.";
  if (!input.name?.trim()) errors.name = "Name is required.";
  if (!input.nameChinese?.trim()) errors.nameChinese = "Chinese name is required.";
  if (!CATEGORIES.includes(input.category as GearCategory))
    errors.category = "Pick a valid category.";
  if (!Number.isFinite(input.dailyPrice) || input.dailyPrice < 0)
    errors.dailyPrice = "Daily price must be zero or more.";
  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateBundleInput(
  input: BundleInput,
  knownItemIds: string[]
): ValidationResult {
  const errors: Record<string, string> = {};
  if (!input.slug?.trim()) errors.slug = "Slug is required.";
  else if (!SLUG_RE.test(input.slug)) errors.slug = "Slug must be lowercase words separated by hyphens.";
  if (!input.name?.trim()) errors.name = "Name is required.";
  if (!input.nameChinese?.trim()) errors.nameChinese = "Chinese name is required.";
  if (!TIERS.includes(input.tier as GearBundle["tier"])) errors.tier = "Pick a valid tier.";
  if (!Number.isFinite(input.bundlePrice) || input.bundlePrice < 0)
    errors.bundlePrice = "Bundle price must be zero or more.";
  if (!Number.isFinite(input.originalPrice) || input.originalPrice < 0)
    errors.originalPrice = "Original price must be zero or more.";
  if (!input.itemIds.length) {
    errors.itemIds = "A bundle needs at least one item.";
  } else {
    const known = new Set(knownItemIds);
    const missing = input.itemIds.filter((id) => !known.has(id));
    if (missing.length) errors.itemIds = `Unknown item(s): ${[...new Set(missing)].join(", ")}.`;
  }
  return { valid: Object.keys(errors).length === 0, errors };
}

// New records default their id to their slug (slugs are unique); edits keep id.
export function itemInputToRow(input: ItemInput): ItemRow {
  return {
    id: input.id ?? input.slug,
    slug: input.slug,
    name: input.name,
    name_chinese: input.nameChinese,
    category: input.category,
    daily_price: input.dailyPrice,
    description: input.description,
    description_chinese: input.descriptionChinese,
    images: input.images,
    specs: input.specs,
    featured: input.featured,
    available: input.available,
  };
}

export function bundleInputToRow(input: BundleInput): BundleRow {
  return {
    id: input.id ?? input.slug,
    slug: input.slug,
    name: input.name,
    name_chinese: input.nameChinese,
    tier: input.tier,
    tagline: input.tagline,
    description: input.description,
    bundle_price: input.bundlePrice,
    original_price: input.originalPrice,
    images: input.images,
    featured: input.featured,
    available: input.available,
  };
}

// Domain → input, for pre-filling the edit forms.
export function itemToInput(item: GearItem): ItemInput {
  return {
    id: item.id,
    slug: item.slug,
    name: item.name,
    nameChinese: item.nameChinese,
    category: item.category,
    dailyPrice: item.dailyPrice,
    description: item.description,
    descriptionChinese: item.descriptionChinese,
    images: item.images,
    specs: item.specs,
    featured: item.featured ?? false,
    available: item.available ?? true,
  };
}

export function bundleToInput(bundle: GearBundle): BundleInput {
  return {
    id: bundle.id,
    slug: bundle.slug,
    name: bundle.name,
    nameChinese: bundle.nameChinese,
    tier: bundle.tier,
    tagline: bundle.tagline,
    description: bundle.description,
    bundlePrice: bundle.bundlePrice,
    originalPrice: bundle.originalPrice,
    images: bundle.images,
    itemIds: bundle.itemIds,
    featured: bundle.featured ?? false,
    available: bundle.available ?? true,
  };
}
