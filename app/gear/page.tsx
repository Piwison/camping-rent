import { gearItems, gearBundles } from "@/data/gear";
import GearCatalogClient from "@/components/catalog/GearCatalogClient";

export const metadata = {
  title: "Gear — Basecamp & Co.",
  description: "Browse all camping gear available to rent. Bundles and individual items.",
};

export default function GearPage() {
  return <GearCatalogClient items={gearItems} bundles={gearBundles} />;
}
