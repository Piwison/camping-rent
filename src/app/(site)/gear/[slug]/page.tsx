import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getItemBySlug, getBundleBySlug, getBundleItems, allCatalogSlugs } from "@/data/catalog";
import GearDetailClient from "@/components/gear-detail/GearDetailClient";
import BundleDetailClient from "@/components/gear-detail/BundleDetailClient";
import AvailabilityCalendar from "@/components/availability/AvailabilityCalendar";
import {
  itemWeekendAvailability,
  bundleWeekendAvailability,
} from "@/lib/weekend-availability";
import { pageMeta } from "@/lib/site";

export async function generateStaticParams() {
  return (await allCatalogSlugs()).map((slug) => ({ slug }));
}

// Re-render periodically so the Weekend availability strip reflects recent
// bookings; the authoritative stock check still runs at enquiry submit.
export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entity = (await getItemBySlug(slug)) ?? (await getBundleBySlug(slug));
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

  const item = await getItemBySlug(slug);
  if (item) {
    const slots = await itemWeekendAvailability(item.id);
    return (
      <>
        <GearDetailClient item={item} />
        <AvailabilityCalendar slots={slots} />
      </>
    );
  }

  const bundle = await getBundleBySlug(slug);
  if (bundle) {
    const [bundleItems, slots] = await Promise.all([
      getBundleItems(bundle),
      bundleWeekendAvailability(bundle),
    ]);
    return (
      <>
        <BundleDetailClient bundle={bundle} items={bundleItems} />
        <AvailabilityCalendar slots={slots} label="sets" />
      </>
    );
  }

  notFound();
}
