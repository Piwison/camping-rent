"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Trash, Check } from "@phosphor-icons/react";
import { useBooking } from "./BookingContext";
import { formatTWD } from "@/lib/pricing";
import { validateEnquiry, toEnquiryItems, type EnquiryPayload } from "@/lib/enquiry";

export default function BookingPageClient() {
  const { items, from, to, nights, total, removeItem, clearCart, setDates } =
    useBooking();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({ name: "", email: "", phone: "", notes: "" });

  function toDateInput(d: Date) {
    return d.toISOString().split("T")[0];
  }

  function clearFieldError(field: string) {
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  function updateForm(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    clearFieldError(field);
  }

  function handleDateChange(field: "from" | "to", value: string) {
    const d = new Date(value);
    if (isNaN(d.getTime())) return;
    if (field === "from") setDates(d, to);
    else setDates(from, d);
    clearFieldError(field === "from" ? "checkIn" : "checkOut");
  }

  function buildPayload(): EnquiryPayload {
    return {
      name: form.name,
      email: form.email,
      phone: form.phone,
      notes: form.notes,
      checkIn: toDateInput(from),
      checkOut: toDateInput(to),
      nights,
      total,
      items: toEnquiryItems(items),
    };
  }

  // Shares the server's validateEnquiry rules, plus a client-only past-date guard.
  function collectErrors(payload: EnquiryPayload): Record<string, string> {
    const { errors } = validateEnquiry(payload);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (!errors.checkIn && from < today)
      errors.checkIn = "Check-in can't be in the past.";
    return errors;
  }

  function inputClass(field: string) {
    return `border bg-[#F9F6F0] px-4 py-3 text-sm text-[#1E1C18] focus:outline-none placeholder:text-[#9C8B6E]/50 ${
      fieldErrors[field]
        ? "border-[#9C3B2E] focus:border-[#9C3B2E]"
        : "border-[#DDD6C1] focus:border-[#9C8B6E]"
    }`;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;

    const payload = buildPayload();
    const errors = collectErrors(payload);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError(null);
      return;
    }

    setSubmitting(true);
    setError(null);
    setFieldErrors({});

    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (data.errors && typeof data.errors === "object") {
          setFieldErrors(data.errors);
        } else {
          setError(
            typeof data.error === "string"
              ? data.error
              : "Something went wrong. Please try again."
          );
        }
        return;
      }

      clearCart();
      setSubmitted(true);
    } catch {
      setError("Network error — please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const hasBundle = items.some((i) => i.type === "bundle");
  const isFriToSun = from.getDay() === 5 && nights === 2;
  const showWeekendHint = hasBundle && !isFriToSun;

  if (submitted) {
    return (
      <div className="pt-32 pb-20 min-h-[100dvh] flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="max-w-md text-center"
        >
          <div className="w-12 h-12 rounded-full bg-[#9C8B6E] flex items-center justify-center mx-auto mb-6">
            <Check size={22} weight="bold" className="text-[#F9F6F0]" />
          </div>
          <h1 className="font-serif text-3xl text-[#1E1C18] mb-3">
            Enquiry Sent
          </h1>
          <p className="text-sm text-[#5C5850] mb-2">
            Thanks, {form.name}. We&apos;ll confirm your booking within 24 hours.
          </p>
          <p className="text-xs text-[#9C8B6E]">預訂申請已送出，我們將在24小時內確認。</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-6 lg:px-10">
      <div className="mb-12">
        <p className="text-xs tracking-[0.2em] uppercase text-[#9C8B6E] mb-2">
          預訂 · Booking
        </p>
        <h1 className="font-serif text-5xl tracking-tight text-[#1E1C18]">
          Your Booking
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 items-start">
        {/* Left: date + form */}
        <div>
          {/* Date selection */}
          <section className="mb-10">
            <h2 className="text-xs font-semibold tracking-widest uppercase text-[#5C5850] mb-5">
              Trip Dates 露營日期
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <label className="flex flex-col gap-1.5">
                <span className="text-xs text-[#5C5850]">Check-in</span>
                <input
                  type="date"
                  value={toDateInput(from)}
                  min={toDateInput(new Date())}
                  onChange={(e) => handleDateChange("from", e.target.value)}
                  aria-invalid={!!fieldErrors.checkIn}
                  aria-describedby={fieldErrors.checkIn ? "checkin-error" : undefined}
                  className={inputClass("checkIn")}
                />
                {fieldErrors.checkIn && (
                  <span id="checkin-error" className="text-xs text-[#9C3B2E]">
                    {fieldErrors.checkIn}
                  </span>
                )}
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs text-[#5C5850]">Check-out</span>
                <input
                  type="date"
                  value={toDateInput(to)}
                  min={toDateInput(from)}
                  onChange={(e) => handleDateChange("to", e.target.value)}
                  aria-invalid={!!fieldErrors.checkOut}
                  aria-describedby={fieldErrors.checkOut ? "checkout-error" : undefined}
                  className={inputClass("checkOut")}
                />
                {fieldErrors.checkOut && (
                  <span id="checkout-error" className="text-xs text-[#9C3B2E]">
                    {fieldErrors.checkOut}
                  </span>
                )}
              </label>
            </div>
            <p className="text-xs text-[#9C8B6E] mt-2">
              {nights} night{nights !== 1 ? "s" : ""} · {nights} 晚
            </p>
            {showWeekendHint && (
              <p className="text-xs text-[#9C8B6E] mt-1">
                Bundles are priced per weekend (Fri–Sun) · 套裝以週末計價
              </p>
            )}
          </section>

          {/* Enquiry form */}
          <section>
            <h2 className="text-xs font-semibold tracking-widest uppercase text-[#5C5850] mb-5">
              Your Details 聯絡資訊
            </h2>
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs text-[#5C5850]">Full Name 姓名</span>
                  <input
                    value={form.name}
                    onChange={(e) => updateForm("name", e.target.value)}
                    placeholder="Your name"
                    aria-invalid={!!fieldErrors.name}
                    aria-describedby={fieldErrors.name ? "name-error" : undefined}
                    className={inputClass("name")}
                  />
                  {fieldErrors.name && (
                    <span id="name-error" className="text-xs text-[#9C3B2E]">
                      {fieldErrors.name}
                    </span>
                  )}
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs text-[#5C5850]">Phone 電話</span>
                  <input
                    value={form.phone}
                    onChange={(e) => updateForm("phone", e.target.value)}
                    placeholder="0912 345 678"
                    className={inputClass("phone")}
                  />
                </label>
              </div>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs text-[#5C5850]">Email</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => updateForm("email", e.target.value)}
                  placeholder="you@example.com"
                  aria-invalid={!!fieldErrors.email}
                  aria-describedby={fieldErrors.email ? "email-error" : undefined}
                  className={inputClass("email")}
                />
                {fieldErrors.email && (
                  <span id="email-error" className="text-xs text-[#9C3B2E]">
                    {fieldErrors.email}
                  </span>
                )}
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs text-[#5C5850]">
                  Campsite / Notes 營地資訊
                </span>
                <textarea
                  rows={3}
                  value={form.notes}
                  onChange={(e) => updateForm("notes", e.target.value)}
                  placeholder="Campsite name, address, or any special requests"
                  className={`${inputClass("notes")} resize-none`}
                />
              </label>

              {(fieldErrors.items || error) && (
                <p role="alert" className="text-sm text-[#9C3B2E]">
                  {fieldErrors.items || error}
                </p>
              )}

              <button
                type="submit"
                disabled={items.length === 0 || submitting}
                className="mt-2 px-6 py-4 bg-[#1E1C18] text-[#F9F6F0] text-sm tracking-wide hover:bg-[#9C8B6E] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {submitting ? "Sending… 送出中" : "Submit Enquiry 送出預訂"}
              </button>
            </form>
          </section>
        </div>

        {/* Right: order summary */}
        <div className="bg-[#EAE5D8] p-6 sticky top-24">
          <h2 className="text-xs font-semibold tracking-widest uppercase text-[#5C5850] mb-5">
            Order Summary 預訂清單
          </h2>

          {items.length === 0 ? (
            <p className="text-sm text-[#9C8B6E] py-4 text-center">
              No items yet — browse gear to add.
              <br />
              <span className="text-xs">尚未選擇裝備</span>
            </p>
          ) : (
            <>
              <div className="divide-y divide-[#DDD6C1] mb-5">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center py-3 gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[#1E1C18] truncate">{item.name}</p>
                      <p className="text-xs text-[#9C8B6E]">
                        {item.type === "bundle"
                          ? "Weekend bundle"
                          : `${formatTWD(item.price)} × ${nights} nights`}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-[#1E1C18]">
                        {item.type === "bundle"
                          ? formatTWD(item.price)
                          : formatTWD(item.price * nights)}
                      </span>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-[#9C8B6E] hover:text-[#1E1C18] transition-colors"
                      >
                        <Trash size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-baseline border-t border-[#DDD6C1] pt-4">
                <span className="text-xs font-semibold tracking-widest uppercase text-[#5C5850]">
                  Total
                </span>
                <span className="font-serif text-2xl text-[#1E1C18]">
                  {formatTWD(total)}
                </span>
              </div>

              <button
                onClick={clearCart}
                className="mt-4 text-xs text-[#9C8B6E] hover:text-[#1E1C18] transition-colors underline underline-offset-2"
              >
                Clear all
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
