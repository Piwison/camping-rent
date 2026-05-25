"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { List, X } from "@phosphor-icons/react";

const navLinks = [
  { href: "/gear", label: "Gear", chinese: "裝備" },
  { href: "/booking", label: "Book", chinese: "預訂" },
  { href: "/about", label: "About", chinese: "關於" },
];

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#F9F6F0]/90 backdrop-blur-md border-b border-[#DDD6C1]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex flex-col leading-none">
          <span className="text-sm font-semibold tracking-widest uppercase text-[#1E1C18]">
            Basecamp & Co.
          </span>
          <span className="text-[10px] tracking-wider text-[#9C8B6E]">
            露營裝備租賃
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group flex flex-col items-center leading-none"
            >
              <span className="text-sm tracking-wide text-[#1E1C18] group-hover:text-[#9C8B6E] transition-colors">
                {link.label}
              </span>
              <span className="text-[9px] text-[#9C8B6E] opacity-0 group-hover:opacity-100 transition-opacity">
                {link.chinese}
              </span>
            </Link>
          ))}
          <Link
            href="/booking"
            className="px-4 py-2 bg-[#1E1C18] text-[#F9F6F0] text-sm tracking-wide hover:bg-[#9C8B6E] transition-colors"
          >
            Rent Now
          </Link>
        </nav>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden text-[#1E1C18]"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} /> : <List size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#F9F6F0] border-t border-[#DDD6C1] px-6 py-6 flex flex-col gap-5">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="flex items-baseline gap-2 text-base text-[#1E1C18]"
            >
              {link.label}
              <span className="text-xs text-[#9C8B6E]">{link.chinese}</span>
            </Link>
          ))}
          <Link
            href="/booking"
            onClick={() => setMenuOpen(false)}
            className="mt-2 w-full text-center px-4 py-3 bg-[#1E1C18] text-[#F9F6F0] text-sm tracking-wide"
          >
            Rent Now 預訂
          </Link>
        </div>
      )}
    </header>
  );
}
