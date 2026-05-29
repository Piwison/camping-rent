import { describe, it, expect } from "vitest";
import { rowToItem, rowToBundle, type ItemRow, type BundleRow } from "@/data/catalog-mappers";

const itemRow: ItemRow = {
  id: "tent-01",
  slug: "canvas-bell-tent-4m",
  name: "Canvas Bell Tent 4m",
  name_chinese: "帆布鐘形帳篷 4公尺",
  category: "shelter",
  daily_price: 800,
  description: "A spacious bell tent.",
  description_chinese: "寬敞的鐘形帳篷。",
  images: ["a.jpg"],
  specs: [{ label: "Diameter", value: "4 m" }],
  featured: true,
  available: true,
};

const bundleRow: BundleRow = {
  id: "bundle-standard",
  slug: "camp-set",
  name: "Camp Set",
  name_chinese: "標準營地組",
  tier: "standard",
  tagline: "A full weekend, fully equipped.",
  description: "Our most popular bundle.",
  bundle_price: 3200,
  original_price: 4120,
  images: ["b.jpg"],
  featured: true,
  available: false,
};

describe("rowToItem", () => {
  it("maps a Postgres item row to a GearItem (snake_case → camelCase)", () => {
    expect(rowToItem(itemRow)).toEqual({
      id: "tent-01",
      slug: "canvas-bell-tent-4m",
      name: "Canvas Bell Tent 4m",
      nameChinese: "帆布鐘形帳篷 4公尺",
      category: "shelter",
      dailyPrice: 800,
      description: "A spacious bell tent.",
      descriptionChinese: "寬敞的鐘形帳篷。",
      images: ["a.jpg"],
      specs: [{ label: "Diameter", value: "4 m" }],
      featured: true,
      available: true,
    });
  });
});

describe("rowToBundle", () => {
  it("maps a bundle row plus its ordered itemIds to a GearBundle", () => {
    const bundle = rowToBundle(bundleRow, ["tent-01", "chair-01", "chair-01"]);
    expect(bundle.nameChinese).toBe("標準營地組");
    expect(bundle.bundlePrice).toBe(3200);
    expect(bundle.originalPrice).toBe(4120);
    expect(bundle.available).toBe(false);
    // itemIds come from the join and preserve order + duplicates.
    expect(bundle.itemIds).toEqual(["tent-01", "chair-01", "chair-01"]);
  });
});
