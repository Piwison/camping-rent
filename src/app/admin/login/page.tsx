"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase-browser";

export default function VendorLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);

    const supabase = createBrowserSupabase();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setBusy(false);
      return;
    }
    router.replace("/admin");
    router.refresh();
  }

  return (
    <div className="min-h-[100dvh] flex items-center justify-center px-6 bg-[#F9F6F0]">
      <div className="w-full max-w-sm">
        <p className="text-xs tracking-[0.2em] uppercase text-[#9C8B6E] mb-2">
          Basecamp &amp; Co.
        </p>
        <h1 className="font-serif text-3xl text-[#1E1C18] mb-8">Vendor Sign In</h1>
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs text-[#5C5850]">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="border border-[#DDD6C1] bg-white px-4 py-3 text-sm focus:outline-none focus:border-[#9C8B6E]"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs text-[#5C5850]">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="border border-[#DDD6C1] bg-white px-4 py-3 text-sm focus:outline-none focus:border-[#9C8B6E]"
            />
          </label>

          {error && (
            <p role="alert" className="text-sm text-[#9C3B2E]">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="mt-2 px-6 py-3 bg-[#1E1C18] text-[#F9F6F0] text-sm tracking-wide hover:bg-[#9C8B6E] transition-colors disabled:opacity-40"
          >
            {busy ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
