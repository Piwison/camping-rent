import { describe, it, expect } from "vitest";
import {
  listItems,
  listBundles,
  getItemBySlug,
  getBundleBySlug,
  getBundleItems,
  allCatalogSlugs,
} from "@/data/catalog";

// With no Supabase env configured, the store resolves through the in-memory
// adapter (ADR-0008). These assert the async seam behaves like the Catalog.

describe("Catalog store (async seam, in-memory adapter)", () => {
  it("lists items and bundles", async () => {
    expect((await listItems()).length).toBeGreaterThan(0);
    expect(await listBundles()).toHaveLength(3);
  });

  it("looks up by slug and returns undefined when missing", async () => {
    expect((await getItemBySlug("canvas-bell-tent-4m"))?.id).toBe("tent-01");
    expect(await getBundleBySlug("nope")).toBeUndefined();
  });

  it("expands a Bundle preserving order and duplicates", async () => {
    const campSet = (await getBundleBySlug("camp-set"))!;
    const items = await getBundleItems(campSet);
    expect(items.map((i) => i.id)).toEqual(campSet.itemIds);
    expect(items.filter((i) => i.id === "chair-01")).toHaveLength(2);
  });

  it("returns every slug with no duplicates", async () => {
    const slugs = await allCatalogSlugs();
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(slugs).toContain("full-grounds");
  });
});
