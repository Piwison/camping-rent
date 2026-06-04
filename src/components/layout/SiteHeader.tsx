"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { List, X } from "@phosphor-icons/react";

const navLinks = [
  { href: "/gear", label: "Gear", chinese: "裝備" },
  { href: "/booking", label: "Book", chinese: "預訂" },
  { href: "/about", label: "About", chinese: "關於" },
  { href: "/account", label: "Account", chinese: "帳戶" },
];

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The homepage hero is a dark full-bleed photo, so the transparent header
  // needs light text while it floats over it. Everywhere else (and once
  // scrolled onto the ivory page) the header keeps its dark text.
  const solid = scrolled || menuOpen;
  const overHero = pathname === "/" && !solid;
  const primaryText = overHero ? "text-[#F9F6F0]" : "text-[#1E1C18]";
  const accentText = overHero ? "text-[#D8C9AC]" : "text-[#7A6B54]";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        solid
          ? "bg-[#F9F6F0]/90 backdrop-blur-md border-b border-[#DDD6C1]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex flex-col leading-none">
          <span className={`text-sm font-semibold tracking-widest uppercase transition-colors ${primaryText}`}>
            Basecamp & Co.
          </span>
          <span className={`text-[10px] tracking-wider transition-colors ${accentText}`}>
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
              <span className={`text-sm tracking-wide group-hover:text-[#7A6B54] transition-colors ${primaryText}`}>
                {link.label}
              </span>
              <span className={`text-[9px] opacity-0 group-hover:opacity-100 transition-opacity ${accentText}`}>
                {link.chinese}
              </span>
            </Link>
          ))}
          <Link
            href="/booking"
            className={`btn btn-xs ${overHero ? "btn-glass" : "btn-primary"}`}
          >
            Rent Now
          </Link>
        </nav>

        {/* Mobile menu toggle */}
        <button
          type="button"
          className={`md:hidden transition-colors ${primaryText}`}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          {menuOpen ? <X size={22} /> : <List size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div id="mobile-menu" className="md:hidden bg-[#F9F6F0] border-t border-[#DDD6C1] px-6 py-6 flex flex-col gap-5">
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
