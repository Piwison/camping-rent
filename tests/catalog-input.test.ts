import { describe, it, expect } from "vitest";
import {
  validateItemInput,
  validateBundleInput,
  itemInputToRow,
  bundleInputToRow,
  type ItemInput,
  type BundleInput,
} from "@/data/catalog-input";

const item: ItemInput = {
  slug: "canvas-bell-tent-4m",
  name: "Canvas Bell Tent 4m",
  nameChinese: "帆布鐘形帳篷",
  category: "shelter",
  dailyPrice: 800,
  description: "Roomy.",
  descriptionChinese: "寬敞。",
  images: [],
  specs: [],
  featured: false,
  available: true,
};

const bundle: BundleInput = {
  slug: "camp-set",
  name: "Camp Set",
  nameChinese: "標準營地組",
  tier: "standard",
  tagline: "Equipped.",
  description: "Popular.",
  bundlePrice: 3200,
  originalPrice: 4120,
  images: [],
  itemIds: ["tent-01", "chair-01", "chair-01"],
  featured: true,
  available: true,
};

describe("validateItemInput", () => {
  it("accepts a well-formed item", () => {
    expect(validateItemInput(item).valid).toBe(true);
  });

  it("rejects a bad slug, missing names, unknown category, negative price", () => {
    const { valid, errors } = validateItemInput({
      ...item,
      slug: "Not A Slug",
      name: "",
      nameChinese: "",
      category: "spaceship",
      dailyPrice: -5,
    });
    expect(valid).toBe(false);
    expect(errors).toHaveProperty("slug");
    expect(errors).toHaveProperty("name");
    expect(errors).toHaveProperty("nameChinese");
    expect(errors).toHaveProperty("category");
    expect(errors).toHaveProperty("dailyPrice");
  });
});

describe("validateBundleInput", () => {
  const known = ["tent-01", "chair-01", "kitchen-01"];

  it("accepts a bundle whose items all exist", () => {
    expect(validateBundleInput(bundle, known).valid).toBe(true);
  });

  it("rejects a bundle referencing an unknown item (story 9)", () => {
    const { valid, errors } = validateBundleInput(
      { ...bundle, itemIds: ["tent-01", "ghost-99"] },
      known
    );
    expect(valid).toBe(false);
    expect(errors.itemIds).toContain("ghost-99");
  });

  it("requires at least one item", () => {
    const { errors } = validateBundleInput({ ...bundle, itemIds: [] }, known);
    expect(errors.itemIds).toBeDefined();
  });
});

describe("input → row mapping", () => {
  it("defaults a new item's id to its slug and maps to snake_case", () => {
    const row = itemInputToRow(item);
    expect(row.id).toBe("canvas-bell-tent-4m");
    expect(row.name_chinese).toBe("帆布鐘形帳篷");
    expect(row.daily_price).toBe(800);
  });

  it("keeps an existing item's id on edit", () => {
    expect(itemInputToRow({ ...item, id: "tent-01" }).id).toBe("tent-01");
  });

  it("maps a bundle input to a row", () => {
    const row = bundleInputToRow(bundle);
    expect(row.id).toBe("camp-set");
    expect(row.bundle_price).toBe(3200);
    expect(row.original_price).toBe(4120);
  });
});
