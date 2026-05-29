"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase-browser";

const navItems = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/catalog", label: "Catalog" },
  { href: "/admin/enquiries", label: "Enquiries" },
];

export default function VendorTopbar({ email }: { email: string }) {
  const router = useRouter();
  const pathname = usePathname();

  async function signOut() {
    await createBrowserSupabase().auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <header className="border-b border-[#DDD6C1] bg-white">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between gap-6">
        <nav className="flex items-center gap-6">
          <span className="font-serif text-[#1E1C18]">Basecamp &amp; Co.</span>
          {navItems.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm transition-colors ${
                  active ? "text-[#1E1C18]" : "text-[#9C8B6E] hover:text-[#1E1C18]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-4">
          <span className="text-xs text-[#9C8B6E] hidden sm:inline">{email}</span>
          <button
            onClick={signOut}
            className="text-sm text-[#9C8B6E] hover:text-[#1E1C18] transition-colors underline underline-offset-2"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
