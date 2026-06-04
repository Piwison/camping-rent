"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { ArrowRight } from "@phosphor-icons/react";

const ease = [0.22, 1, 0.36, 1] as const;

// Marketing hero photo. Centralised so it's a one-line swap when real
// photography lands; served via next/image (host allowlisted in next.config).
const HERO_IMAGE =
  "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=2400&q=70";

// Staggered entrance for the content block. Adapted from the shadcn animated
// hero, but typed and using our cubic-bezier ease; reduced-motion is handled at
// the call site by skipping the initial ("hidden") state.
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
};

const itemVariants: Variants = {
  hidden: { y: 24, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease } },
};

const stats = [
  { num: "3", label: "Curated bundles", chinese: "套裝組合" },
  { num: "12+", label: "Gear items", chinese: "露營裝備" },
  { num: "NT$1,800", label: "Starting from", chinese: "起" },
];

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  // Gentle scroll parallax on the photo — desktop only, off under reduced motion.
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  const parallaxOn = isDesktop && !reduce;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100dvh] w-full items-center overflow-hidden bg-[#1E1C18]"
    >
      {/* Background photo — full bleed, with overscan so parallax never reveals an edge */}
      <motion.div
        style={parallaxOn ? { y: imageY } : undefined}
        className="absolute inset-0 -z-10"
      >
        <motion.div
          initial={{ scale: reduce ? 1 : 1.06, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease }}
          className="absolute inset-[-6%]"
        >
          <Image
            src={HERO_IMAGE}
            alt="A lantern-lit glamping tent pitched in the mountains at dusk"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>
        {/* Cinematic legibility wash, layered so the darkest corner sits bottom-left
            under the headline + scroll cue while the rest of the photo breathes.
            Tuned to keep the text comfortably above AA contrast. */}
        <div className="absolute inset-0 bg-[#1E1C18]/25" />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#1E1C18]/90 via-[#1E1C18]/35 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1E1C18]/70 via-transparent to-transparent" />
      </motion.div>

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial={reduce ? false : "hidden"}
        animate="visible"
        className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 pt-28 pb-20"
      >
        <div className="max-w-2xl text-[#F9F6F0]">
          <motion.p
            variants={itemVariants}
            className="text-xs tracking-[0.25em] uppercase text-[#D8C9AC] mb-5"
          >
            台灣露營裝備租賃 · Taiwan Gear Rental
          </motion.p>

          <motion.h1
            variants={itemVariants}
            className="font-serif text-5xl md:text-6xl xl:text-7xl tracking-tighter leading-[1.04] mb-6"
          >
            Camp in
            <br />
            <span className="text-[#D8C9AC] italic">Style.</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-base md:text-lg leading-relaxed text-[#F9F6F0]/85 max-w-md mb-10"
          >
            Premium camping gear, delivered to your campsite. Curated bundles for
            the glamping generation — no gear, no problem.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              href="/gear"
              className="group btn btn-lg bg-[#F9F6F0] text-[#1E1C18] font-medium shadow-xl shadow-black/20 hover:bg-white"
            >
              Browse Gear
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
            <Link href="/gear#bundles" className="btn btn-lg btn-glass">
              View Bundles
              <span className="text-[#D8C9AC] text-xs">套裝組合</span>
            </Link>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex gap-8 mt-14 pt-8 border-t border-white/15"
          >
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col">
                <span className="font-serif text-2xl text-[#F9F6F0]">{s.num}</span>
                <span className="text-xs text-[#F9F6F0]/70">{s.label}</span>
                <span className="text-[10px] text-[#D8C9AC]">{s.chinese}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Editorial meta chip — quiet brand detail, desktop only */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.1 }}
        className="hidden lg:flex absolute bottom-8 right-8 z-10 items-center gap-3 px-4 py-2.5 bg-white/10 backdrop-blur-md border border-white/15"
      >
        <span className="text-[10px] tracking-[0.2em] uppercase text-[#F9F6F0]/80">
          週末出走 · Weekend Escape
        </span>
        <span className="text-[10px] text-[#D8C9AC]">24.1°N 121.6°E</span>
      </motion.div>

      {/* Scroll cue — fades out as the hero scrolls away */}
      <motion.div
        style={parallaxOn ? { opacity: cueOpacity } : undefined}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="hidden lg:flex absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex-col items-center gap-2"
      >
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#F9F6F0]/70">
          Scroll
        </span>
        <motion.span
          animate={reduce ? undefined : { y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="block w-px h-9 bg-gradient-to-b from-[#F9F6F0]/70 to-transparent"
        />
      </motion.div>
    </section>
  );
}
