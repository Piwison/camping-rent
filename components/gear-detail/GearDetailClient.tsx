"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Check } from "@phosphor-icons/react";
import { formatTWD } from "@/lib/pricing";
import { useBooking } from "@/components/booking/BookingContext";
import type { GearItem } from "@/types/gear";

export default function GearDetailClient({ item }: { item: GearItem }) {
  const [activeImg, setActiveImg] = useState(0);
  const [added, setAdded] = useState(false);
  const { addItem, nights } = useBooking();

  function handleAdd() {
    addItem({
      type: "item",
      id: item.id,
      name: item.name,
      price: item.dailyPrice,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  const total = item.dailyPrice * Math.max(1, nights);

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
              src={item.images[activeImg]}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          </motion.div>
          {item.images.length > 1 && (
            <div className="flex gap-2">
              {item.images.map((src, i) => (
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
          <p className="text-xs tracking-[0.2em] uppercase text-[#9C8B6E] mb-2">
            {item.nameChinese} · {item.category}
          </p>
          <h1 className="font-serif text-4xl md:text-5xl tracking-tight text-[#1E1C18] mb-4">
            {item.name}
          </h1>
          <p className="text-sm text-[#5C5850] leading-relaxed mb-8">
            {item.description}
          </p>

          {/* Pricing */}
          <div className="bg-[#EAE5D8] px-6 py-5 mb-8">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="font-serif text-3xl text-[#1E1C18]">
                {formatTWD(item.dailyPrice)}
              </span>
              <span className="text-sm text-[#5C5850]">/ day</span>
            </div>
            {nights > 1 && (
              <p className="text-xs text-[#9C8B6E]">
                {nights} nights = {formatTWD(total)} total
              </p>
            )}
          </div>

          {/* Add to booking */}
          <button
            onClick={handleAdd}
            className={`w-full flex items-center justify-center gap-2 px-6 py-4 text-sm tracking-wide transition-all ${
              added
                ? "bg-[#9C8B6E] text-[#F9F6F0]"
                : "bg-[#1E1C18] text-[#F9F6F0] hover:bg-[#9C8B6E]"
            }`}
          >
            {added ? (
              <>
                <Check size={16} weight="bold" /> Added to Booking
              </>
            ) : (
              <>
                <ShoppingCart size={16} /> Add to Booking
                <span className="text-[10px] opacity-70">加入預訂</span>
              </>
            )}
          </button>

          {/* Specs */}
          <div className="mt-10">
            <h2 className="text-xs font-semibold tracking-widest uppercase text-[#5C5850] mb-4">
              Specifications 規格
            </h2>
            <div className="divide-y divide-[#DDD6C1]">
              {item.specs.map((spec) => (
                <div
                  key={spec.label}
                  className="flex justify-between py-3 text-sm"
                >
                  <span className="text-[#5C5850]">{spec.label}</span>
                  <span className="text-[#1E1C18] font-medium">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
