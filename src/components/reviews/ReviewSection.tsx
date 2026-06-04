"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createBrowserSupabase } from "@/lib/supabase-browser";
import { summarize, type Review, type ReviewSummary } from "@/lib/reviews";
import Stars from "./Stars";

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

export default function ReviewSection({
  targetType,
  targetId,
  targetName,
  initialReviews,
  initialSummary,
}: {
  targetType: "item" | "bundle";
  targetId: string;
  targetName: string;
  initialReviews: Review[];
  initialSummary: ReviewSummary;
}) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [summary, setSummary] = useState<ReviewSummary>(initialSummary);

  // Who's viewing — the form only shows for a signed-in Customer.
  const [name, setName] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    createBrowserSupabase()
      .auth.getUser()
      .then(({ data }) => {
        if (data.user) setName((data.user.email ?? "").split("@")[0] || "Guest");
      });
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy || name === null) return;
    setBusy(true);
    setError(null);

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetType, targetId, rating, authorName: name, title, body }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(typeof data.error === "string" ? data.error : "Couldn't save your review.");
      setBusy(false);
      return;
    }

    // Auto-published — show it immediately (optimistic).
    const optimistic: Review = {
      id: `local-${Date.now()}`,
      authorName: name,
      targetType,
      targetId,
      rating,
      title: title.trim() || undefined,
      body: body.trim() || undefined,
      createdAt: new Date().toISOString(),
    };
    const next = [optimistic, ...reviews];
    setReviews(next);
    setSummary(summarize(next.map((r) => r.rating)));
    setTitle("");
    setBody("");
    setRating(5);
    setBusy(false);
  }

  return (
    <section className="max-w-6xl mx-auto px-6 py-12 border-t border-[#E8E1D1]">
      <div className="flex items-baseline gap-3 mb-8">
        <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-[#1E1C18]">
          Reviews
        </h2>
        {summary.count > 0 ? (
          <span className="inline-flex items-baseline gap-2 text-sm text-[#5C5850]">
            <Stars value={summary.average} />
            {summary.average.toFixed(1)} · {summary.count}{" "}
            {summary.count === 1 ? "review" : "reviews"}
          </span>
        ) : (
          <span className="text-sm text-[#7A6B54]">No reviews yet</span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12 items-start">
        {/* List */}
        <ul className="flex flex-col gap-6">
          {reviews.length === 0 && (
            <li className="text-sm text-[#5C5850]">Be the first to review {targetName}.</li>
          )}
          {reviews.map((r) => (
            <li key={r.id} className="border-b border-[#EAE5D8] pb-6 last:border-0">
              <div className="flex items-center gap-3 mb-1">
                <Stars value={r.rating} />
                <span className="text-sm font-medium text-[#1E1C18]">{r.authorName}</span>
                <span className="text-xs text-[#7A6B54]">{fmtDate(r.createdAt)}</span>
              </div>
              {r.title && <p className="text-sm font-medium text-[#1E1C18] mt-1">{r.title}</p>}
              {r.body && <p className="text-sm text-[#5C5850] leading-relaxed mt-1">{r.body}</p>}
            </li>
          ))}
        </ul>

        {/* Form / sign-in prompt */}
        <div className="bg-[#F3EEE2] p-6">
          {name === null ? (
            <div className="text-sm text-[#5C5850]">
              <p className="mb-3">Rented this? Share how it went.</p>
              <Link href="/account/login" className="btn btn-sm btn-primary">
                Sign in to review
              </Link>
            </div>
          ) : (
            <form onSubmit={submit} className="flex flex-col gap-3">
              <p className="text-sm font-medium text-[#1E1C18]">Write a review</p>

              <div className="flex items-center gap-1" role="radiogroup" aria-label="Rating">
                {[1, 2, 3, 4, 5].map((i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={`${i} star${i === 1 ? "" : "s"}`}
                    aria-checked={rating === i}
                    role="radio"
                    onClick={() => setRating(i)}
                    onMouseEnter={() => setHover(i)}
                    onMouseLeave={() => setHover(0)}
                    className={`text-2xl leading-none transition-colors ${
                      i <= (hover || rating) ? "text-[#9C8B6E]" : "text-[#DDD6C1]"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>

              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="border border-[#DDD6C1] bg-white px-3 py-2 text-sm focus:outline-none focus:border-[#9C8B6E]"
              />
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title (optional)"
                className="border border-[#DDD6C1] bg-white px-3 py-2 text-sm focus:outline-none focus:border-[#9C8B6E]"
              />
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={3}
                placeholder="How was it? (optional)"
                className="border border-[#DDD6C1] bg-white px-3 py-2 text-sm focus:outline-none focus:border-[#9C8B6E]"
              />

              {error && <p className="text-sm text-[#9C3B2E]">{error}</p>}

              <button type="submit" disabled={busy} className="btn btn-md btn-primary">
                {busy ? "Posting…" : "Post review"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
