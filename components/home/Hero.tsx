"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";
import { ArrowRight } from "@phosphor-icons/react";

const ease = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  // Only run depth parallax on pointer-capable, large screens.
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  const parallaxOn = isDesktop && !reduce;

  // Scroll-linked parallax: layers drift at three different rates.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 70]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const pillY = useTransform(scrollYProgress, [0, 1], [0, 40]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  // Mouse-linked depth: spring-damped tilt + counter-drift.
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });

  const rotateY = useTransform(springX, [-0.5, 0.5], [-3, 3]);
  const rotateX = useTransform(springY, [-0.5, 0.5], [3, -3]);
  const imgShiftX = useTransform(springX, [-0.5, 0.5], [-10, 10]);
  const imgShiftY = useTransform(springY, [-0.5, 0.5], [-10, 10]);
  const accentX = useTransform(springX, [-0.5, 0.5], [14, -14]);
  const accentY = useTransform(springY, [-0.5, 0.5], [14, -14]);
  const textMouseX = useTransform(springX, [-0.5, 0.5], [6, -6]);

  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    if (!parallaxOn) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  }
  function resetMouse() {
    mouseX.set(0);
    mouseY.set(0);
  }

  const fadeUp = (delay: number, y = 20) => ({
    initial: { opacity: 0, y: reduce ? 0 : y },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease },
  });

  return (
    <motion.section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetMouse}
      className="relative min-h-[100dvh] grid grid-cols-1 lg:grid-cols-2 overflow-hidden"
    >
      {/* Left — text */}
      <motion.div
        style={parallaxOn ? { y: textY, x: textMouseX } : undefined}
        className="flex flex-col justify-end lg:justify-center px-6 lg:px-16 pt-32 pb-16 lg:py-0 z-10 bg-[#F9F6F0]"
      >
        <motion.p
          {...fadeUp(0.1, 16)}
          className="text-xs tracking-[0.25em] uppercase text-[#9C8B6E] mb-4"
        >
          台灣露營裝備租賃 · Taiwan Gear Rental
        </motion.p>

        <motion.h1
          {...fadeUp(0.2, 24)}
          className="font-serif text-5xl md:text-6xl xl:text-7xl tracking-tighter leading-[1.05] text-[#1E1C18] mb-6"
        >
          Camp in
          <br />
          <span className="text-[#9C8B6E] italic">Style.</span>
        </motion.h1>

        <motion.p
          {...fadeUp(0.35)}
          className="text-base text-[#5C5850] leading-relaxed max-w-sm mb-10"
        >
          Premium camping gear, delivered to your campsite. Curated bundles for
          the glamping generation — no gear, no problem.
        </motion.p>

        <motion.div {...fadeUp(0.5, 16)} className="flex flex-col sm:flex-row gap-4">
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
      </motion.div>

      {/* Right — editorial image (parallax depth) */}
      <motion.div
        style={parallaxOn ? { y: imageY } : undefined}
        className="relative lg:h-full h-72 order-first lg:order-last"
      >
        <motion.div
          initial={{ opacity: 0, scale: reduce ? 1 : 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.1, ease }}
          className="absolute inset-0"
        >
          {/* Tilt + shift layer */}
          <motion.div
            style={
              parallaxOn
                ? {
                    rotateX,
                    rotateY,
                    x: imgShiftX,
                    y: imgShiftY,
                    transformPerspective: 800,
                  }
                : undefined
            }
            className="absolute inset-0"
          >
            {/* Overscan so parallax translation never reveals an edge */}
            <div className="absolute top-[-10%] left-[-5%] w-[110%] h-[120%]">
              <Image
                src="https://picsum.photos/seed/hero-camp/1200/1600"
                alt="Glamping setup at a Taiwan campsite"
                fill
                priority
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="object-cover"
              />
            </div>

            {/* Floating accent — drifts opposite for depth */}
            <motion.div
              style={parallaxOn ? { x: accentX, y: accentY } : undefined}
              className="absolute top-6 right-6 px-3 py-2 bg-[#F9F6F0]/80 backdrop-blur-sm"
            >
              <p className="text-[10px] tracking-[0.2em] text-[#9C8B6E]">
                24.1°N · 121.6°E
              </p>
            </motion.div>
          </motion.div>

          {/* Overlay pill — third scroll rate, stays untilted */}
          <motion.div
            style={parallaxOn ? { y: pillY } : undefined}
            className="absolute bottom-6 left-6 bg-[#F9F6F0]/90 backdrop-blur-sm px-4 py-3"
          >
            <p className="text-xs font-semibold tracking-widest uppercase text-[#1E1C18]">
              Weekend Escape
            </p>
            <p className="text-[10px] text-[#9C8B6E]">週末出走</p>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll cue — fades out as the hero scrolls away */}
      <motion.div
        style={parallaxOn ? { opacity: cueOpacity } : undefined}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="hidden lg:flex absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex-col items-center gap-2"
      >
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#9C8B6E]">
          Scroll
        </span>
        <motion.span
          animate={reduce ? undefined : { y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="block w-px h-9 bg-gradient-to-b from-[#9C8B6E] to-transparent"
        />
      </motion.div>
    </motion.section>
  );
}
