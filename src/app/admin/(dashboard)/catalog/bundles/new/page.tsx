import { listAllItems } from "@/data/catalog-write";
import BundleForm from "../../BundleForm";

export const dynamic = "force-dynamic";

export default async function NewBundlePage() {
  const items = await listAllItems();
  return (
    <div>
      <h1 className="font-serif text-3xl text-[#1E1C18] mb-6">New bundle</h1>
      <BundleForm availableItems={items.map((i) => ({ id: i.id, name: i.name }))} />
    </div>
  );
}
