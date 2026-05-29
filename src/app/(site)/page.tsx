import Hero from "@/components/home/Hero";
import FeaturedBundles from "@/components/home/FeaturedBundles";
import EditorialGrid from "@/components/home/EditorialGrid";
import BrandStory from "@/components/home/BrandStory";
import { featuredBundles, featuredItems } from "@/data/catalog";

export default async function HomePage() {
  const [bundles, items] = await Promise.all([featuredBundles(), featuredItems()]);
  return (
    <>
      <Hero />
      <FeaturedBundles bundles={bundles} />
      <BrandStory />
      <EditorialGrid items={items} />
    </>
  );
}
