import { notFound } from "next/navigation";
import { getItemBySlug, getBundleBySlug, gearItems, gearBundles, getBundleItems } from "@/data/gear";
import GearDetailClient from "@/components/gear-detail/GearDetailClient";
import BundleDetailClient from "@/components/gear-detail/BundleDetailClient";

export async function generateStaticParams() {
  const itemSlugs = gearItems.map((i) => ({ slug: i.slug }));
  const bundleSlugs = gearBundles.map((b) => ({ slug: b.slug }));
  return [...itemSlugs, ...bundleSlugs];
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
