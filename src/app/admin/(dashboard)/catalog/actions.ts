"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireVendor } from "@/lib/vendor-session";
import {
  saveItem,
  deleteItem,
  saveBundle,
  deleteBundle,
  setItemFlag,
  setBundleFlag,
  listAllItems,
} from "@/data/catalog-write";
import {
  validateItemInput,
  validateBundleInput,
  type ItemInput,
  type BundleInput,
} from "@/data/catalog-input";
import type { FormState } from "./form-state";

function lines(v: FormDataEntryValue | null): string[] {
  return String(v ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseSpecs(v: FormDataEntryValue | null): { label: string; value: string }[] {
  return lines(v)
    .map((line) => {
      const idx = line.indexOf(":");
      if (idx === -1) return { label: line, value: "" };
      return { label: line.slice(0, idx).trim(), value: line.slice(idx + 1).trim() };
    })
    .filter((s) => s.label);
}

// Refresh every surface the Catalog feeds (storefront + admin).
function revalidateCatalog() {
  revalidatePath("/", "layout");
}

export async function saveItemAction(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireVendor();
  const input: ItemInput = {
    id: (fd.get("id") as string) || undefined,
    slug: String(fd.get("slug") ?? "").trim(),
    name: String(fd.get("name") ?? "").trim(),
    nameChinese: String(fd.get("nameChinese") ?? "").trim(),
    category: String(fd.get("category") ?? ""),
    dailyPrice: Number(fd.get("dailyPrice")),
    description: String(fd.get("description") ?? "").trim(),
    descriptionChinese: String(fd.get("descriptionChinese") ?? "").trim(),
    images: lines(fd.get("images")),
    specs: parseSpecs(fd.get("specs")),
    featured: fd.get("featured") === "on",
    available: fd.get("available") === "on",
  };

  const { valid, errors } = validateItemInput(input);
  if (!valid) return { errors };

  await saveItem(input);
  revalidateCatalog();
  redirect("/admin/catalog");
}

export async function saveBundleAction(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireVendor();
  const input: BundleInput = {
    id: (fd.get("id") as string) || undefined,
    slug: String(fd.get("slug") ?? "").trim(),
    name: String(fd.get("name") ?? "").trim(),
    nameChinese: String(fd.get("nameChinese") ?? "").trim(),
    tier: String(fd.get("tier") ?? ""),
    tagline: String(fd.get("tagline") ?? "").trim(),
    description: String(fd.get("description") ?? "").trim(),
    bundlePrice: Number(fd.get("bundlePrice")),
    originalPrice: Number(fd.get("originalPrice")),
    images: lines(fd.get("images")),
    itemIds: lines(fd.get("itemIds")),
    featured: fd.get("featured") === "on",
    available: fd.get("available") === "on",
  };

  const knownItemIds = (await listAllItems()).map((i) => i.id);
  const { valid, errors } = validateBundleInput(input, knownItemIds);
  if (!valid) return { errors };

  await saveBundle(input);
  revalidateCatalog();
  redirect("/admin/catalog");
}

export async function deleteItemAction(fd: FormData): Promise<void> {
  await requireVendor();
  await deleteItem(String(fd.get("id")));
  revalidateCatalog();
}

export async function deleteBundleAction(fd: FormData): Promise<void> {
  await requireVendor();
  await deleteBundle(String(fd.get("id")));
  revalidateCatalog();
}

export async function toggleItemFlagAction(fd: FormData): Promise<void> {
  await requireVendor();
  await setItemFlag(
    String(fd.get("id")),
    fd.get("flag") === "featured" ? "featured" : "available",
    fd.get("value") === "true"
  );
  revalidateCatalog();
}

export async function toggleBundleFlagAction(fd: FormData): Promise<void> {
  await requireVendor();
  await setBundleFlag(
    String(fd.get("id")),
    fd.get("flag") === "featured" ? "featured" : "available",
    fd.get("value") === "true"
  );
  revalidateCatalog();
}
