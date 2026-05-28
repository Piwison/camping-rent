import { gearItems, gearBundles } from "@/data/gear";
import GearCatalogClient from "@/components/catalog/GearCatalogClient";
import { pageMeta } from "@/lib/site";

export const metadata = pageMeta({
  title: "Gear",
  description:
    "Browse all camping gear available to rent — curated weekend bundles and individual items, delivered to your campsite.",
  path: "/gear",
});

export default function GearPage() {
  return <GearCatalogClient items={gearItems} bundles={gearBundles} />;
}
