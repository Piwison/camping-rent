import Hero from "@/components/home/Hero";
import FeaturedBundles from "@/components/home/FeaturedBundles";
import EditorialGrid from "@/components/home/EditorialGrid";
import BrandStory from "@/components/home/BrandStory";
import { featuredBundles, featuredItems } from "@/data/gear";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedBundles bundles={featuredBundles()} />
      <BrandStory />
      <EditorialGrid items={featuredItems()} />
    </>
  );
}
