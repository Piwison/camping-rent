"use client";

import { useActionState } from "react";
import Link from "next/link";
import { saveBundleAction } from "./actions";
import { emptyFormState } from "./form-state";
import type { BundleInput } from "@/data/catalog-input";

const TIERS = ["solo", "standard", "deluxe"];
const field = "border border-[#DDD6C1] bg-white px-3 py-2 text-sm focus:outline-none focus:border-[#9C8B6E]";

export default function BundleForm({
  defaultInput,
  availableItems,
}: {
  defaultInput?: BundleInput;
  availableItems: { id: string; name: string }[];
}) {
  const [state, formAction, pending] = useActionState(saveBundleAction, emptyFormState);
  const d = defaultInput;
  const e = state.errors;

  return (
    <form action={formAction} className="flex flex-col gap-4 max-w-2xl">
      {d?.id && <input type="hidden" name="id" value={d.id} />}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-xs text-[#5C5850]">Slug</span>
          <input name="slug" defaultValue={d?.slug} className={field} />
          {e.slug && <span className="text-xs text-[#9C3B2E]">{e.slug}</span>}
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs text-[#5C5850]">Tier</span>
          <select name="tier" defaultValue={d?.tier ?? "standard"} className={field}>
            {TIERS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          {e.tier && <span className="text-xs text-[#9C3B2E]">{e.tier}</span>}
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs text-[#5C5850]">Name (EN)</span>
          <input name="name" defaultValue={d?.name} className={field} />
          {e.name && <span className="text-xs text-[#9C3B2E]">{e.name}</span>}
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs text-[#5C5850]">Name (中文)</span>
          <input name="nameChinese" defaultValue={d?.nameChinese} className={field} />
          {e.nameChinese && <span className="text-xs text-[#9C3B2E]">{e.nameChinese}</span>}
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs text-[#5C5850]">Bundle price (TWD / weekend)</span>
          <input name="bundlePrice" type="number" min={0} defaultValue={d?.bundlePrice ?? 0} className={field} />
          {e.bundlePrice && <span className="text-xs text-[#9C3B2E]">{e.bundlePrice}</span>}
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs text-[#5C5850]">Original price (TWD)</span>
          <input name="originalPrice" type="number" min={0} defaultValue={d?.originalPrice ?? 0} className={field} />
          {e.originalPrice && <span className="text-xs text-[#9C3B2E]">{e.originalPrice}</span>}
        </label>
      </div>

      <label className="flex flex-col gap-1">
        <span className="text-xs text-[#5C5850]">Tagline</span>
        <input name="tagline" defaultValue={d?.tagline} className={field} />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-xs text-[#5C5850]">Description</span>
        <textarea name="description" rows={2} defaultValue={d?.description} className={field} />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-xs text-[#5C5850]">Image URLs (one per line)</span>
        <textarea name="images" rows={2} defaultValue={d?.images.join("\n")} className={field} />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-xs text-[#5C5850]">
          Member item ids (one per line, order matters, repeat for duplicates)
        </span>
        <textarea name="itemIds" rows={4} defaultValue={d?.itemIds.join("\n")} className={field} />
        {e.itemIds && <span className="text-xs text-[#9C3B2E]">{e.itemIds}</span>}
      </label>
      <details className="text-xs text-[#9C8B6E]">
        <summary className="cursor-pointer">Available item ids</summary>
        <ul className="mt-2 grid grid-cols-2 gap-x-4">
          {availableItems.map((i) => (
            <li key={i.id}>
              <code>{i.id}</code> — {i.name}
            </li>
          ))}
        </ul>
      </details>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm text-[#5C5850]">
          <input type="checkbox" name="featured" defaultChecked={d?.featured ?? false} /> Featured
        </label>
        <label className="flex items-center gap-2 text-sm text-[#5C5850]">
          <input type="checkbox" name="available" defaultChecked={d?.available ?? true} /> Available
        </label>
      </div>

      <div className="flex items-center gap-4 mt-2">
        <button
          type="submit"
          disabled={pending}
          className="px-5 py-2.5 bg-[#1E1C18] text-[#F9F6F0] text-sm hover:bg-[#9C8B6E] transition-colors disabled:opacity-40"
        >
          {pending ? "Saving…" : "Save bundle"}
        </button>
        <Link href="/admin/catalog" className="text-sm text-[#9C8B6E] hover:text-[#1E1C18]">
          Cancel
        </Link>
      </div>
    </form>
  );
}
