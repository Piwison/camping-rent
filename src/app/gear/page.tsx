import { listItems, listBundles } from "@/data/catalog";
import GearCatalogClient from "@/components/catalog/GearCatalogClient";
import { pageMeta } from "@/lib/site";

export const metadata = pageMeta({
  title: "Gear",
  description:
    "Browse all camping gear available to rent — curated weekend bundles and individual items, delivered to your campsite.",
  path: "/gear",
});

export default async function GearPage() {
  const [items, bundles] = await Promise.all([listItems(), listBundles()]);
  return <GearCatalogClient items={items} bundles={bundles} />;
}
