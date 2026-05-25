"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "@phosphor-icons/react";

export default function Hero() {
  return (
    <section className="relative min-h-[100dvh] grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
      {/* Left — text */}
      <div className="flex flex-col justify-end lg:justify-center px-6 lg:px-16 pt-32 pb-16 lg:py-0 z-10 bg-[#F9F6F0]">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-xs tracking-[0.25em] uppercase text-[#9C8B6E] mb-4"
        >
          台灣露營裝備租賃 · Taiwan Gear Rental
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="font-serif text-5xl md:text-6xl xl:text-7xl tracking-tighter leading-[1.05] text-[#1E1C18] mb-6"
        >
          Camp in
          <br />
          <span className="text-[#9C8B6E] italic">Style.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="text-base text-[#5C5850] leading-relaxed max-w-sm mb-10"
        >
          Premium camping gear, delivered to your campsite. Curated bundles for
          the glamping generation — no gear, no problem.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link
            href="/gear"
            className="group inline-flex items-center gap-2 px-6 py-3.5 bg-[#1E1C18] text-[#F9F6F0] text-sm tracking-wide hover:bg-[#9C8B6E] transition-colors"
          >
            Browse Gear
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
          <Link
            href="/gear#bundles"
            className="inline-flex items-center gap-2 px-6 py-3.5 border border-[#DDD6C1] text-[#1E1C18] text-sm tracking-wide hover:border-[#9C8B6E] transition-colors"
          >
            View Bundles
            <span className="text-[#9C8B6E] text-xs">套裝組合</span>
          </Link>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex gap-8 mt-16 pt-8 border-t border-[#DDD6C1]"
        >
          {[
            { num: "3", label: "Curated bundles", chinese: "套裝組合" },
            { num: "12+", label: "Gear items", chinese: "露營裝備" },
            { num: "NT$1,800", label: "Starting from", chinese: "起" },
          ].map((s) => (
            <div key={s.label} className="flex flex-col">
              <span className="font-serif text-2xl text-[#1E1C18]">{s.num}</span>
              <span className="text-xs text-[#5C5850]">{s.label}</span>
              <span className="text-[10px] text-[#9C8B6E]">{s.chinese}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Right — editorial image */}
      <motion.div
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.1 }}
        className="relative lg:h-full h-72 order-first lg:order-last"
      >
        <img
          src="https://picsum.photos/seed/hero-camp/1200/1600"
          alt="Glamping setup at a Taiwan campsite"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Overlay pill */}
        <div className="absolute bottom-6 left-6 bg-[#F9F6F0]/90 backdrop-blur-sm px-4 py-3">
          <p className="text-xs font-semibold tracking-widest uppercase text-[#1E1C18]">
            Weekend Escape
          </p>
          <p className="text-[10px] text-[#9C8B6E]">週末出走</p>
        </div>
      </motion.div>
    </section>
  );
}
