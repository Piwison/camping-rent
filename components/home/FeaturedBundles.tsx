"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "@phosphor-icons/react";
import { formatTWD } from "@/lib/pricing";
import type { GearBundle } from "@/types/gear";

const tierLabel: Record<string, string> = {
  solo: "Solo · 一人",
  standard: "Standard · 標準",
  deluxe: "Deluxe · 完整",
};

export default function FeaturedBundles({ bundles }: { bundles: GearBundle[] }) {
  return (
    <section className="py-24 px-6 lg:px-10 max-w-7xl mx-auto" id="bundles">
      {/* Section header */}
      <div className="flex items-end justify-between mb-14">
        <div>
          <p className="text-xs tracking-[0.2em] uppercase text-[#9C8B6E] mb-2">
            套裝組合 · Curated Bundles
          </p>
          <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-[#1E1C18]">
            Everything you need,
            <br />
            <span className="italic text-[#9C8B6E]">in one booking.</span>
          </h2>
        </div>
        <Link
          href="/gear#bundles"
          className="hidden md:flex items-center gap-1 text-sm text-[#5C5850] hover:text-[#9C8B6E] transition-colors"
        >
          All bundles <ArrowRight size={14} />
        </Link>
      </div>

      {/* Bundle cards — asymmetric 3-column */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-start">
        {bundles.map((bundle, i) => (
          <motion.div
            key={bundle.id}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, delay: i * 0.1 }}
            className={i === 1 ? "md:mt-10" : ""}
          >
            <Link href={`/gear/${bundle.slug}`} className="group block">
              {/* Image */}
              <div className="relative overflow-hidden aspect-[3/4] mb-5">
                <img
                  src={bundle.images[0]}
                  alt={bundle.name}
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-[#F9F6F0]/90 backdrop-blur-sm px-3 py-1.5">
                  <span className="text-[10px] tracking-widest uppercase text-[#5C5850]">
                    {tierLabel[bundle.tier]}
                  </span>
                </div>
              </div>

              {/* Info */}
              <p className="text-xs tracking-widest uppercase text-[#9C8B6E] mb-1">
                {bundle.nameChinese}
              </p>
              <h3 className="font-serif text-2xl text-[#1E1C18] mb-2 group-hover:text-[#9C8B6E] transition-colors">
                {bundle.name}
              </h3>
              <p className="text-sm text-[#5C5850] mb-4 leading-relaxed">
                {bundle.tagline}
              </p>

              <div className="flex items-baseline gap-2">
                <span className="font-semibold text-[#1E1C18]">
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
  );
}
