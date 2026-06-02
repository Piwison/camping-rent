"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase-browser";

// Minimal account-area chrome (ADR-0010), mirroring the Vendor topbar.
export default function CustomerTopbar({ email }: { email: string }) {
  const router = useRouter();

  async function signOut() {
    await createBrowserSupabase().auth.signOut();
    router.replace("/account/login");
    router.refresh();
  }

  return (
    <header className="border-b border-[#DDD6C1] bg-white">
      <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between gap-6">
        <nav className="flex items-center gap-6">
          <Link href="/" className="font-[family-name:var(--font-playfair)] text-[#1E1C18]">
            Basecamp &amp; Co.
          </Link>
          <Link href="/account" className="text-sm text-[#1E1C18]">
            My bookings
          </Link>
          <Link
            href="/gear"
            className="text-sm text-[#9C8B6E] hover:text-[#1E1C18] transition-colors"
          >
            Browse gear
          </Link>
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
