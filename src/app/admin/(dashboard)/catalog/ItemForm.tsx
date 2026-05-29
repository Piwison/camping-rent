"use client";

import { useActionState } from "react";
import Link from "next/link";
import { saveItemAction } from "./actions";
import { emptyFormState } from "./form-state";
import type { ItemInput } from "@/data/catalog-input";

const CATEGORIES = ["shelter", "furniture", "kitchen", "lighting", "bedding", "other"];
const field = "border border-[#DDD6C1] bg-white px-3 py-2 text-sm focus:outline-none focus:border-[#9C8B6E]";

export default function ItemForm({ defaultInput }: { defaultInput?: ItemInput }) {
  const [state, formAction, pending] = useActionState(saveItemAction, emptyFormState);
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
          <span className="text-xs text-[#5C5850]">Category</span>
          <select name="category" defaultValue={d?.category ?? "shelter"} className={field}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {e.category && <span className="text-xs text-[#9C3B2E]">{e.category}</span>}
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
          <span className="text-xs text-[#5C5850]">Daily price (TWD)</span>
          <input
            name="dailyPrice"
            type="number"
            min={0}
            defaultValue={d?.dailyPrice ?? 0}
            className={field}
          />
          {e.dailyPrice && <span className="text-xs text-[#9C3B2E]">{e.dailyPrice}</span>}
        </label>
      </div>

      <label className="flex flex-col gap-1">
        <span className="text-xs text-[#5C5850]">Description (EN)</span>
        <textarea name="description" rows={2} defaultValue={d?.description} className={field} />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-xs text-[#5C5850]">Description (中文)</span>
        <textarea
          name="descriptionChinese"
          rows={2}
          defaultValue={d?.descriptionChinese}
          className={field}
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-xs text-[#5C5850]">Image URLs (one per line)</span>
        <textarea name="images" rows={3} defaultValue={d?.images.join("\n")} className={field} />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-xs text-[#5C5850]">Specs (one &quot;label: value&quot; per line)</span>
        <textarea
          name="specs"
          rows={4}
          defaultValue={d?.specs.map((s) => `${s.label}: ${s.value}`).join("\n")}
          className={field}
        />
      </label>

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
          {pending ? "Saving…" : "Save item"}
        </button>
        <Link href="/admin/catalog" className="text-sm text-[#9C8B6E] hover:text-[#1E1C18]">
          Cancel
        </Link>
      </div>
    </form>
  );
}
