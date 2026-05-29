import { notFound } from "next/navigation";
import { getBundleById, listAllItems } from "@/data/catalog-write";
import { bundleToInput } from "@/data/catalog-input";
import BundleForm from "../../BundleForm";

export const dynamic = "force-dynamic";

export default async function EditBundlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [bundle, items] = await Promise.all([getBundleById(id), listAllItems()]);
  if (!bundle) notFound();

  return (
    <div>
      <h1 className="font-serif text-3xl text-[#1E1C18] mb-6">Edit {bundle.name}</h1>
      <BundleForm
        defaultInput={bundleToInput(bundle)}
        availableItems={items.map((i) => ({ id: i.id, name: i.name }))}
      />
    </div>
  );
}
