import { describe, it, expect } from "vitest";
import {
  listItems,
  listBundles,
  featuredItems,
  featuredBundles,
  getItemBySlug,
  getBundleBySlug,
  getBundleItems,
  allCatalogSlugs,
} from "@/data/gear";

describe("Catalog — listing", () => {
  it("lists every Item and Bundle", () => {
    expect(listItems().length).toBeGreaterThan(0);
    expect(listBundles()).toHaveLength(3); // solo, standard, deluxe Tiers
  });

  it("featured selections are a subset that are all flagged featured", () => {
    const fi = featuredItems();
    const fb = featuredBundles();
    expect(fi.length).toBeGreaterThan(0);
    expect(fi.every((i) => i.featured)).toBe(true);
    expect(fb.every((b) => b.featured)).toBe(true);
    expect(fi.length).toBeLessThanOrEqual(listItems().length);
  });
});

describe("Catalog — lookup by slug", () => {
  it("finds an Item by its slug", () => {
    expect(getItemBySlug("canvas-bell-tent-4m")?.id).toBe("tent-01");
  });

  it("finds a Bundle by its slug", () => {
    expect(getBundleBySlug("camp-set")?.tier).toBe("standard");
  });

  it("returns undefined for an unknown slug", () => {
    expect(getItemBySlug("does-not-exist")).toBeUndefined();
    expect(getBundleBySlug("does-not-exist")).toBeUndefined();
  });
});

describe("Catalog — expanding a Bundle into its Items", () => {
  it("expands itemIds in order, preserving duplicates", () => {
    const campSet = getBundleBySlug("camp-set")!;
    const items = getBundleItems(campSet);
    // Camp Set lists chair-01 twice — the expansion must keep both.
    expect(items.map((i) => i.id)).toEqual(campSet.itemIds);
    const chairs = items.filter((i) => i.id === "chair-01");
    expect(chairs).toHaveLength(2);
  });

  it("drops itemIds that reference no known Item", () => {
    const phantom = { ...getBundleBySlug("solo-escape")!, itemIds: ["ghost-99", "tent-02"] };
    expect(getBundleItems(phantom).map((i) => i.id)).toEqual(["tent-02"]);
  });
});

describe("Catalog — slugs for routing", () => {
  it("returns every Item and Bundle slug with no duplicates", () => {
    const slugs = allCatalogSlugs();
    expect(slugs).toContain("canvas-bell-tent-4m"); // an Item
    expect(slugs).toContain("full-grounds"); // a Bundle
    expect(slugs).toHaveLength(listItems().length + listBundles().length);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});
