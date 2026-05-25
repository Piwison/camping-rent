"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ShoppingCart, Check } from "@phosphor-icons/react";
import { formatTWD } from "@/lib/pricing";
import { useBooking } from "@/components/booking/BookingContext";
import type { GearBundle, GearItem } from "@/types/gear";

const tierLabel: Record<string, string> = {
  solo: "Solo Escape",
  standard: "Camp Set",
  deluxe: "Full Grounds",
};

export default function BundleDetailClient({
  bundle,
  items,
}: {
  bundle: GearBundle;
  items: GearItem[];
}) {
  const [activeImg, setActiveImg] = useState(0);
  const [added, setAdded] = useState(false);
  const { addItem } = useBooking();

  function handleAdd() {
    addItem({
      type: "bundle",
      id: bundle.id,
      name: bundle.name,
      price: bundle.bundlePrice,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  const savings = bundle.originalPrice - bundle.bundlePrice;

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-6 lg:px-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
        {/* Images */}
        <div className="sticky top-24">
          <motion.div
            key={activeImg}
            initial={{ opacity: 0.7 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="aspect-[4/3] overflow-hidden mb-3"
          >
            <img
              src={bundle.images[activeImg]}
              alt={bundle.name}
              className="w-full h-full object-cover"
            />
          </motion.div>
          {bundle.images.length > 1 && (
            <div className="flex gap-2">
              {bundle.images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`w-16 h-16 overflow-hidden border-2 transition-colors ${
                    i === activeImg ? "border-[#9C8B6E]" : "border-transparent"
                  }`}
                >
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] tracking-widest uppercase bg-[#1E1C18] text-[#F9F6F0] px-2.5 py-1">
              {tierLabel[bundle.tier]}
            </span>
            <span className="text-xs text-[#9C8B6E]">{bundle.nameChinese}</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl tracking-tight text-[#1E1C18] mb-3">
            {bundle.name}
          </h1>
          <p className="text-base italic text-[#9C8B6E] mb-4">{bundle.tagline}</p>
          <p className="text-sm text-[#5C5850] leading-relaxed mb-8">
            {bundle.description}
          </p>

          {/* Pricing */}
          <div className="bg-[#EAE5D8] px-6 py-5 mb-8">
            <div className="flex items-baseline gap-3 mb-1">
              <span className="font-serif text-3xl text-[#1E1C18]">
                {formatTWD(bundle.bundlePrice)}
              </span>
              <span className="text-sm text-[#9C8B6E] line-through">
                {formatTWD(bundle.originalPrice)}
              </span>
            </div>
            <p className="text-xs text-[#5C5850]">
              Per weekend (Fri–Sun) ·{" "}
              <span className="text-[#9C8B6E]">
                Save {formatTWD(savings)}
              </span>
            </p>
          </div>

          <button
            onClick={handleAdd}
            className={`w-full flex items-center justify-center gap-2 px-6 py-4 text-sm tracking-wide transition-all mb-4 ${
              added
                ? "bg-[#9C8B6E] text-[#F9F6F0]"
                : "bg-[#1E1C18] text-[#F9F6F0] hover:bg-[#9C8B6E]"
            }`}
          >
            {added ? (
              <>
                <Check size={16} weight="bold" /> Bundle Added
              </>
            ) : (
              <>
                <ShoppingCart size={16} /> Book This Bundle
                <span className="text-[10px] opacity-70">預訂此套組</span>
              </>
            )}
          </button>

          {/* What's included */}
          <div className="mt-10">
            <h2 className="text-xs font-semibold tracking-widest uppercase text-[#5C5850] mb-5">
              What&apos;s Included 包含內容
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {items.map((item) => (
                <Link
                  key={item.id}
                  href={`/gear/${item.slug}`}
                  className="group flex items-center gap-3 text-sm hover:text-[#9C8B6E] transition-colors"
                >
                  <div className="w-10 h-10 overflow-hidden shrink-0">
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-[#1E1C18] group-hover:text-[#9C8B6E] transition-colors leading-snug">
                      {item.name}
                    </p>
                    <p className="text-[10px] text-[#9C8B6E]">{item.nameChinese}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
