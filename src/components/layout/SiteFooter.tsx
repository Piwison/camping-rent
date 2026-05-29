"use client";

import Link from "next/link";
import { InstagramLogo, FacebookLogo } from "@phosphor-icons/react";

export default function SiteFooter() {
  return (
    <footer className="border-t border-[#DDD6C1] bg-[#F9F6F0] mt-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Brand */}
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold tracking-widest uppercase">
            Basecamp & Co.
          </p>
          <p className="text-xs text-[#5C5850] leading-relaxed max-w-xs">
            Premium camping gear rental for Taiwan's weekend escapists.
            <br />
            <span className="text-[#9C8B6E]">台灣高品質露營裝備租賃服務</span>
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold tracking-widest uppercase text-[#5C5850]">
            Explore
          </p>
          {[
            { href: "/gear", label: "All Gear" },
            { href: "/booking", label: "Make a Booking" },
            { href: "/about", label: "Our Story" },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-[#1E1C18] hover:text-[#9C8B6E] transition-colors w-fit"
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Social + legal */}
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold tracking-widest uppercase text-[#5C5850]">
            Follow
          </p>
          <div className="flex gap-4">
            <a
              href="#"
              aria-label="Instagram"
              className="text-[#1E1C18] hover:text-[#9C8B6E] transition-colors"
            >
              <InstagramLogo size={20} />
            </a>
            <a
              href="#"
              aria-label="Facebook"
              className="text-[#1E1C18] hover:text-[#9C8B6E] transition-colors"
            >
              <FacebookLogo size={20} />
            </a>
          </div>
          <p className="text-xs text-[#5C5850] mt-auto pt-6">
            © {new Date().getFullYear()} Basecamp & Co. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
