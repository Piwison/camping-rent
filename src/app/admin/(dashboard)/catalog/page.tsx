import Link from "next/link";
import { listAllItems, listAllBundles } from "@/data/catalog-write";
import { formatTWD } from "@/lib/pricing";
import type { GearItem, GearBundle } from "@/types/gear";
import {
  toggleItemFlagAction,
  toggleBundleFlagAction,
  deleteItemAction,
  deleteBundleAction,
} from "./actions";

export const dynamic = "force-dynamic";

function FlagButton({
  id,
  flag,
  on,
  action,
  onLabel,
  offLabel,
}: {
  id: string;
  flag: "available" | "featured";
  on: boolean;
  action: (fd: FormData) => Promise<void>;
  onLabel: string;
  offLabel: string;
}) {
  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="flag" value={flag} />
      <input type="hidden" name="value" value={(!on).toString()} />
      <button
        className={`text-xs px-2 py-1 border transition-colors ${
          on
            ? "border-[#1E1C18] text-[#1E1C18]"
            : "border-[#DDD6C1] text-[#9C8B6E] hover:text-[#1E1C18]"
        }`}
      >
        {on ? onLabel : offLabel}
      </button>
    </form>
  );
}

export default async function CatalogAdminPage() {
  const [items, bundles] = await Promise.all([listAllItems(), listAllBundles()]);

  return (
    <div className="flex flex-col gap-12">
      <section>
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-serif text-3xl text-[#1E1C18]">Items</h1>
          <Link
            href="/admin/catalog/items/new"
            className="px-4 py-2 bg-[#1E1C18] text-[#F9F6F0] text-sm hover:bg-[#9C8B6E] transition-colors"
          >
            New item
          </Link>
        </div>
        <CatalogTable rows={items} kind="items" />
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-serif text-3xl text-[#1E1C18]">Bundles</h1>
          <Link
            href="/admin/catalog/bundles/new"
            className="px-4 py-2 bg-[#1E1C18] text-[#F9F6F0] text-sm hover:bg-[#9C8B6E] transition-colors"
          >
            New bundle
          </Link>
        </div>
        <CatalogTable rows={bundles} kind="bundles" />
      </section>
    </div>
  );
}

function CatalogTable({
  rows,
  kind,
}: {
  rows: (GearItem | GearBundle)[];
  kind: "items" | "bundles";
}) {
  const isItems = kind === "items";
  const toggle = isItems ? toggleItemFlagAction : toggleBundleFlagAction;
  const del = isItems ? deleteItemAction : deleteBundleAction;

  if (rows.length === 0) {
    return <p className="text-sm text-[#9C8B6E]">Nothing here yet.</p>;
  }

  return (
    <div className="border border-[#DDD6C1] bg-white divide-y divide-[#EAE5D8]">
      {rows.map((row) => {
        const price = isItems
          ? formatTWD((row as GearItem).dailyPrice) + " / night"
          : formatTWD((row as GearBundle).bundlePrice) + " / weekend";
        return (
          <div key={row.id} className="flex items-center gap-4 px-4 py-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-[#1E1C18] truncate">{row.name}</p>
              <p className="text-xs text-[#9C8B6E]">
                <code>{row.id}</code> · {price}
              </p>
            </div>
            <FlagButton
              id={row.id}
              flag="available"
              on={row.available ?? true}
              action={toggle}
              onLabel="Available"
              offLabel="Hidden"
            />
            <FlagButton
              id={row.id}
              flag="featured"
              on={row.featured ?? false}
              action={toggle}
              onLabel="Featured"
              offLabel="Not featured"
            />
            <Link
              href={`/admin/catalog/${kind}/${row.id}`}
              className="text-sm text-[#9C8B6E] hover:text-[#1E1C18]"
            >
              Edit
            </Link>
            <form action={del}>
              <input type="hidden" name="id" value={row.id} />
              <button className="text-sm text-[#9C3B2E] hover:underline">Delete</button>
            </form>
          </div>
        );
      })}
    </div>
  );
}
