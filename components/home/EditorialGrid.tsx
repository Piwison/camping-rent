"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { formatTWD } from "@/lib/pricing";
import type { GearItem } from "@/types/gear";

export default function EditorialGrid({ items }: { items: GearItem[] }) {
  return (
    <section className="py-24 px-6 lg:px-10 max-w-7xl mx-auto">
      <div className="flex items-end justify-between mb-14">
        <div>
          <p className="text-xs tracking-[0.2em] uppercase text-[#9C8B6E] mb-2">
            精選裝備 · Featured Gear
          </p>
          <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-[#1E1C18]">
            The essentials,
            <br />
            <span className="italic">beautifully made.</span>
          </h2>
        </div>
        <Link
          href="/gear"
          className="hidden md:inline-flex text-sm text-[#5C5850] hover:text-[#9C8B6E] transition-colors"
        >
          View all gear →
        </Link>
      </div>

      {/* Masonry-style grid: 2 cols with varying heights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {items.map((item, i) => {
          const tall = i === 0 || i === 3;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className={`group ${tall ? "lg:row-span-2" : ""}`}
            >
              <Link href={`/gear/${item.slug}`} className="block">
                <div
                  className={`relative overflow-hidden mb-4 ${
                    tall ? "aspect-[3/4]" : "aspect-square"
                  }`}
                >
                  <img
                    src={item.images[0]}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[#1E1C18]/30 to-transparent" />
                </div>
                <p className="text-[10px] tracking-widest uppercase text-[#9C8B6E] mb-0.5">
                  {item.nameChinese}
                </p>
                <h3 className="text-sm font-medium text-[#1E1C18] group-hover:text-[#9C8B6E] transition-colors mb-1">
                  {item.name}
                </h3>
                <p className="text-xs text-[#5C5850]">
                  {formatTWD(item.dailyPrice)}
                  <span className="ml-1 text-[#9C8B6E]">/ day</span>
                </p>
              </Link>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-12 text-center md:hidden">
        <Link
          href="/gear"
          className="inline-flex px-6 py-3 border border-[#DDD6C1] text-sm text-[#1E1C18] hover:border-[#9C8B6E] transition-colors"
        >
          View all gear 所有裝備
        </Link>
      </div>
    </section>
  );
}
