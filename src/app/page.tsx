import Hero from "@/components/home/Hero";
import FeaturedBundles from "@/components/home/FeaturedBundles";
import EditorialGrid from "@/components/home/EditorialGrid";
import BrandStory from "@/components/home/BrandStory";
import { gearBundles, gearItems } from "@/data/gear";

export default function HomePage() {
  const featured = gearBundles.filter((b) => b.featured);
  const featuredItems = gearItems.filter((i) => i.featured);

  return (
    <>
      <Hero />
      <FeaturedBundles bundles={featured} />
      <BrandStory />
      <EditorialGrid items={featuredItems} />
    </>
  );
}
