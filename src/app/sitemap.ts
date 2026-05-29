import type { MetadataRoute } from "next";
import { allCatalogSlugs } from "@/data/catalog";
import { siteConfig } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { path: "/", priority: 1, changeFrequency: "weekly" },
    { path: "/gear", priority: 0.8, changeFrequency: "weekly" },
    { path: "/booking", priority: 0.6, changeFrequency: "monthly" },
    { path: "/about", priority: 0.5, changeFrequency: "monthly" },
  ].map((r) => ({
    url: `${siteConfig.url}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency as "weekly" | "monthly",
    priority: r.priority,
  }));

  const detailRoutes: MetadataRoute.Sitemap = (await allCatalogSlugs()).map((slug) => ({
    url: `${siteConfig.url}/gear/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticRoutes, ...detailRoutes];
}
