"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const steps = [
  {
    num: "01",
    title: "Browse & Book",
    chinese: "瀏覽預訂",
    desc: "Choose a bundle or pick individual items. Select your dates.",
  },
  {
    num: "02",
    title: "We Deliver",
    chinese: "我們送達",
    desc: "Gear arrives clean and ready at your campsite, ahead of your arrival.",
  },
  {
    num: "03",
    title: "Camp in Style",
    chinese: "風格露營",
    desc: "Set up in under an hour. We handle pick-up when the weekend is done.",
  },
];

export default function BrandStory() {
  return (
    <section className="bg-[#1E1C18] text-[#F9F6F0] py-24 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left text */}
        <div>
          <motion.p
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xs tracking-[0.25em] uppercase text-[#9C8B6E] mb-4"
          >
            Our Story · 我們的故事
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-serif text-4xl md:text-5xl tracking-tight leading-tight mb-6"
          >
            Glamping should be
            <br />
            <span className="text-[#9C8B6E] italic">effortless.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-sm text-[#DDD6C1] leading-relaxed max-w-md mb-8"
          >
            We started Basecamp & Co. because we believe your first camping
            experience should feel like a boutique stay, not a survival exercise.
            Great gear shouldn&apos;t require owning it.
          </motion.p>
          <Link
            href="/about"
            className="text-sm text-[#9C8B6E] hover:text-[#F9F6F0] transition-colors underline underline-offset-4"
          >
            Read our story →
          </Link>
        </div>

        {/* Right — how it works */}
        <div className="flex flex-col gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="flex gap-6 border-b border-[#5C5850]/40 pb-8 last:border-0 last:pb-0"
            >
              <span className="font-serif text-3xl text-[#9C8B6E] leading-none w-10 shrink-0">
                {step.num}
              </span>
              <div>
                <div className="flex items-baseline gap-2 mb-1">
                  <h3 className="font-semibold text-sm tracking-wide">
                    {step.title}
                  </h3>
                  <span className="text-[10px] text-[#9C8B6E]">
                    {step.chinese}
                  </span>
                </div>
                <p className="text-sm text-[#DDD6C1]">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
