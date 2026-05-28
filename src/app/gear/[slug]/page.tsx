import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getItemBySlug, getBundleBySlug, gearItems, gearBundles, getBundleItems } from "@/data/gear";
import GearDetailClient from "@/components/gear-detail/GearDetailClient";
import BundleDetailClient from "@/components/gear-detail/BundleDetailClient";
import { pageMeta } from "@/lib/site";

export async function generateStaticParams() {
  const itemSlugs = gearItems.map((i) => ({ slug: i.slug }));
  const bundleSlugs = gearBundles.map((b) => ({ slug: b.slug }));
  return [...itemSlugs, ...bundleSlugs];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entity = getItemBySlug(slug) ?? getBundleBySlug(slug);
  if (!entity) return {};

  return pageMeta({
    title: entity.name,
    description: entity.description,
    path: `/gear/${slug}`,
    image: entity.images?.[0],
  });
}

export default async function GearDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const item = getItemBySlug(slug);
  if (item) return <GearDetailClient item={item} />;

  const bundle = getBundleBySlug(slug);
  if (bundle) {
    const bundleItems = getBundleItems(bundle);
    return <BundleDetailClient bundle={bundle} items={bundleItems} />;
  }

  notFound();
}
