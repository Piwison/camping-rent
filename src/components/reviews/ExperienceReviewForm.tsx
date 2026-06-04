"use client";

import { useState } from "react";

// Lets a signed-in Customer share an overall-experience Review from their
// account. Posts to the same gated endpoint; auto-published (ADR-0013).
export default function ExperienceReviewForm({ defaultName }: { defaultName: string }) {
  const [name, setName] = useState(defaultName);
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetType: "experience", authorName: name, rating, title, body }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(typeof data.error === "string" ? data.error : "Couldn't save your review.");
      setBusy(false);
      return;
    }
    setDone(true);
    setBusy(false);
  }

  if (done) {
    return (
      <div className="border border-[#DDD6C1] bg-white px-5 py-4 text-sm text-[#3E6B4F]">
        Thanks for sharing — your review is live.
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="border border-[#DDD6C1] bg-white px-5 py-5 flex flex-col gap-3">
      <p className="text-sm font-medium text-[#1E1C18]">Share your experience</p>

      <div className="flex items-center gap-1" role="radiogroup" aria-label="Rating">
        {[1, 2, 3, 4, 5].map((i) => (
          <button
            key={i}
            type="button"
            role="radio"
            aria-checked={rating === i}
            aria-label={`${i} star${i === 1 ? "" : "s"}`}
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
        placeholder="How was your weekend with Basecamp & Co.?"
        className="border border-[#DDD6C1] bg-white px-3 py-2 text-sm focus:outline-none focus:border-[#9C8B6E]"
      />

      {error && <p className="text-sm text-[#9C3B2E]">{error}</p>}

      <button type="submit" disabled={busy} className="btn btn-md btn-primary self-start">
        {busy ? "Posting…" : "Post review"}
      </button>
    </form>
  );
}
