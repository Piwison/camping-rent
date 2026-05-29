"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { formatTWD } from "@/lib/pricing";
import type { GearItem, GearBundle, GearCategory } from "@/types/gear";

const categories: { value: GearCategory | "all"; label: string; chinese: string }[] = [
  { value: "all", label: "All", chinese: "全部" },
  { value: "shelter", label: "Shelter", chinese: "遮蔽" },
  { value: "furniture", label: "Furniture", chinese: "家具" },
  { value: "kitchen", label: "Kitchen", chinese: "廚房" },
  { value: "lighting", label: "Lighting", chinese: "燈具" },
  { value: "bedding", label: "Bedding", chinese: "寢具" },
  { value: "other", label: "Other", chinese: "其他" },
];

const tierLabel: Record<string, string> = {
  solo: "Solo · 一人",
  standard: "Standard · 標準",
  deluxe: "Deluxe · 完整",
};

export default function GearCatalogClient({
  items,
  bundles,
}: {
  items: readonly GearItem[];
  bundles: readonly GearBundle[];
}) {
  const [activeCategory, setActiveCategory] = useState<GearCategory | "all">("all");

  const filteredItems =
    activeCategory === "all"
      ? items
      : items.filter((i) => i.category === activeCategory);

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-6 lg:px-10">
      {/* Page header */}
      <div className="mb-14">
        <p className="text-xs tracking-[0.2em] uppercase text-[#9C8B6E] mb-2">
          所有裝備 · All Gear
        </p>
        <h1 className="font-serif text-5xl md:text-6xl tracking-tight text-[#1E1C18]">
          The Full Range
        </h1>
      </div>

      {/* Bundles section */}
      <section className="mb-20" id="bundles">
        <div className="flex items-baseline gap-3 mb-8 border-b border-[#DDD6C1] pb-4">
          <h2 className="font-serif text-2xl text-[#1E1C18]">Curated Bundles</h2>
          <span className="text-sm text-[#9C8B6E]">套裝組合</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {bundles.map((bundle, i) => (
            <motion.div
              key={bundle.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
            >
              <Link href={`/gear/${bundle.slug}`} className="group block">
                <div className="relative overflow-hidden aspect-[4/3] mb-4">
                  <Image
                    src={bundle.images[0]}
                    alt={bundle.name}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-[#1E1C18] text-[#F9F6F0] text-[10px] tracking-widest uppercase px-2.5 py-1">
                    {tierLabel[bundle.tier]}
                  </div>
                </div>
                <h3 className="font-serif text-xl text-[#1E1C18] group-hover:text-[#9C8B6E] transition-colors mb-1">
                  {bundle.name}
                </h3>
                <p className="text-xs text-[#5C5850] mb-3">{bundle.tagline}</p>
                <div className="flex items-baseline gap-2">
                  <span className="font-semibold text-sm text-[#1E1C18]">
                    {formatTWD(bundle.bundlePrice)}
                  </span>
                  <span className="text-xs text-[#9C8B6E] line-through">
                    {formatTWD(bundle.originalPrice)}
                  </span>
                  <span className="text-xs text-[#5C5850]">/ weekend</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Individual items */}
      <section>
        <div className="flex items-baseline gap-3 mb-8 border-b border-[#DDD6C1] pb-4">
          <h2 className="font-serif text-2xl text-[#1E1C18]">Individual Items</h2>
          <span className="text-sm text-[#9C8B6E]">單品租借</span>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`px-4 py-2 text-xs tracking-wide transition-colors border ${
                activeCategory === cat.value
                  ? "bg-[#1E1C18] text-[#F9F6F0] border-[#1E1C18]"
                  : "bg-transparent text-[#5C5850] border-[#DDD6C1] hover:border-[#9C8B6E]"
              }`}
            >
              {cat.label}
              <span className="ml-1 opacity-60">{cat.chinese}</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
            >
              <Link href={`/gear/${item.slug}`} className="group block">
                <div className="relative overflow-hidden aspect-square mb-3">
                  <Image
                    src={item.images[0]}
                    alt={item.name}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                    className="object-cover group-hover:scale-[1.04] transition-transform duration-500"
                  />
                </div>
                <p className="text-[10px] tracking-widest uppercase text-[#9C8B6E] mb-0.5">
                  {item.nameChinese}
                </p>
                <h3 className="text-sm font-medium text-[#1E1C18] group-hover:text-[#9C8B6E] transition-colors mb-1 leading-snug">
                  {item.name}
                </h3>
                <p className="text-xs text-[#5C5850]">
                  {formatTWD(item.dailyPrice)}
                  <span className="text-[#9C8B6E] ml-1">/ day</span>
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
