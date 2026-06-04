import Hero from "@/components/home/Hero";
import FeaturedBundles from "@/components/home/FeaturedBundles";
import EditorialGrid from "@/components/home/EditorialGrid";
import BrandStory from "@/components/home/BrandStory";
import Testimonials from "@/components/home/Testimonials";
import { featuredBundles, featuredItems } from "@/data/catalog";
import { listExperienceReviews } from "@/lib/review-store";

// Refresh periodically so new experience reviews surface without a redeploy.
export const revalidate = 300;

export default async function HomePage() {
  const [bundles, items, testimonials] = await Promise.all([
    featuredBundles(),
    featuredItems(),
    listExperienceReviews(6),
  ]);
  return (
    <>
      <Hero />
      <FeaturedBundles bundles={bundles} />
      <BrandStory />
      <EditorialGrid items={items} />
      <Testimonials reviews={testimonials} />
    </>
  );
}
