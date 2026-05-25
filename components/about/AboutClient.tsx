"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";

const values = [
  {
    title: "Curation over quantity",
    chinese: "精選，而非堆砌",
    desc: "Every item in our inventory is chosen because it's genuinely beautiful, well-made, and worth having at camp.",
  },
  {
    title: "Design-first camping",
    chinese: "設計優先的露營體驗",
    desc: "The campsite is a space. It deserves the same attention to layout, light, and texture as your home does.",
  },
  {
    title: "Gear without the burden",
    chinese: "享受裝備，無需擁有",
    desc: "You don't own a kayak to paddle. You don't need to own a tent to camp beautifully.",
  },
];

export default function AboutClient() {
  return (
    <div className="pt-24 pb-20">
      {/* Hero */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xs tracking-[0.25em] uppercase text-[#9C8B6E] mb-4"
          >
            關於我們 · Our Story
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-serif text-5xl md:text-6xl tracking-tight leading-tight text-[#1E1C18] mb-6"
          >
            We believe
            <br />
            <span className="text-[#9C8B6E] italic">camping</span>
            <br />
            should feel like
            <br />a boutique stay.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-sm text-[#5C5850] leading-relaxed max-w-md"
          >
            Basecamp & Co. started when we realized Taiwan has incredible
            camping terrain but almost nowhere to rent gear that feels as good
            as the landscape deserves. We set out to fix that.
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="aspect-[3/4] overflow-hidden"
        >
          <img
            src="https://picsum.photos/seed/about-hero/900/1200"
            alt="Glamping in Taiwan"
            className="w-full h-full object-cover"
          />
        </motion.div>
      </div>

      {/* Values */}
      <div className="bg-[#EAE5D8] py-20 px-6 lg:px-10 mb-20">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs tracking-[0.2em] uppercase text-[#9C8B6E] mb-10">
            Our Values · 我們的理念
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.1 }}
              >
                <h3 className="font-serif text-xl text-[#1E1C18] mb-1">{v.title}</h3>
                <p className="text-xs text-[#9C8B6E] mb-3">{v.chinese}</p>
                <p className="text-sm text-[#5C5850] leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 text-center">
        <h2 className="font-serif text-3xl md:text-4xl text-[#1E1C18] mb-4">
          Ready for your first glamping trip?
        </h2>
        <p className="text-sm text-[#5C5850] mb-8">準備好你的第一次風格露營了嗎？</p>
        <Link
          href="/gear"
          className="inline-flex items-center gap-2 px-8 py-4 bg-[#1E1C18] text-[#F9F6F0] text-sm tracking-wide hover:bg-[#9C8B6E] transition-colors"
        >
          Browse Gear <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
