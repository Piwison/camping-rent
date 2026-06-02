"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase-browser";

type Mode = "signin" | "register";

export default function CustomerLoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    setNotice(null);

    const supabase = createBrowserSupabase();
    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
        setBusy(false);
        return;
      }
      router.replace("/account");
      router.refresh();
    } else {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message);
        setBusy(false);
        return;
      }
      // Projects with email confirmation on return no session until verified.
      if (!data.session) {
        setNotice("Check your email to confirm your account, then sign in.");
        setMode("signin");
        setBusy(false);
        return;
      }
      router.replace("/account");
      router.refresh();
    }
  }

  return (
    <div className="min-h-[100dvh] flex items-center justify-center px-6 bg-[#F9F6F0]">
      <div className="w-full max-w-sm">
        <Link href="/" className="text-xs tracking-[0.2em] uppercase text-[#9C8B6E]">
          Basecamp &amp; Co.
        </Link>
        <h1 className="font-[family-name:var(--font-playfair)] text-3xl text-[#1E1C18] mt-2 mb-1">
          {mode === "signin" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="text-sm text-[#5C5850] mb-8">
          {mode === "signin"
            ? "Sign in to see your bookings."
            : "Save your trips and track each enquiry."}
        </p>

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
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              className="border border-[#DDD6C1] bg-white px-4 py-3 text-sm focus:outline-none focus:border-[#9C8B6E]"
            />
          </label>

          {error && (
            <p role="alert" className="text-sm text-[#9C3B2E]">
              {error}
            </p>
          )}
          {notice && <p className="text-sm text-[#3E6B4F]">{notice}</p>}

          <button
            type="submit"
            disabled={busy}
            className="mt-2 px-6 py-3 bg-[#1E1C18] text-[#F9F6F0] text-sm tracking-wide hover:bg-[#9C8B6E] transition-colors disabled:opacity-40"
          >
            {busy
              ? "Please wait…"
              : mode === "signin"
                ? "Sign In"
                : "Create Account"}
          </button>
        </form>

        <button
          onClick={() => {
            setMode(mode === "signin" ? "register" : "signin");
            setError(null);
            setNotice(null);
          }}
          className="mt-6 text-sm text-[#9C8B6E] hover:text-[#1E1C18] transition-colors"
        >
          {mode === "signin"
            ? "New here? Create an account"
            : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}
