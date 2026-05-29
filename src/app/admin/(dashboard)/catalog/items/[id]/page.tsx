import { notFound } from "next/navigation";
import { getItemById } from "@/data/catalog-write";
import { itemToInput } from "@/data/catalog-input";
import ItemForm from "../../ItemForm";

export const dynamic = "force-dynamic";

export default async function EditItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getItemById(id);
  if (!item) notFound();

  return (
    <div>
      <h1 className="font-serif text-3xl text-[#1E1C18] mb-6">Edit {item.name}</h1>
      <ItemForm defaultInput={itemToInput(item)} />
    </div>
  );
}
