"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Trash, Check } from "@phosphor-icons/react";
import { useBooking } from "./BookingContext";
import { formatTWD } from "@/lib/pricing";

export default function BookingPageClient() {
  const { items, from, to, nights, total, removeItem, clearCart, setDates } =
    useBooking();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", notes: "" });

  function handleDateChange(field: "from" | "to", value: string) {
    const d = new Date(value);
    if (isNaN(d.getTime())) return;
    if (field === "from") setDates(d, to);
    else setDates(from, d);
  }

  function toDateInput(d: Date) {
    return d.toISOString().split("T")[0];
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

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
                  onChange={(e) => handleDateChange("from", e.target.value)}
                  className="border border-[#DDD6C1] bg-[#F9F6F0] px-4 py-3 text-sm text-[#1E1C18] focus:outline-none focus:border-[#9C8B6E]"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs text-[#5C5850]">Check-out</span>
                <input
                  type="date"
                  value={toDateInput(to)}
                  onChange={(e) => handleDateChange("to", e.target.value)}
                  className="border border-[#DDD6C1] bg-[#F9F6F0] px-4 py-3 text-sm text-[#1E1C18] focus:outline-none focus:border-[#9C8B6E]"
                />
              </label>
            </div>
            <p className="text-xs text-[#9C8B6E] mt-2">
              {nights} night{nights !== 1 ? "s" : ""} · {nights} 晚
            </p>
          </section>

          {/* Enquiry form */}
          <section>
            <h2 className="text-xs font-semibold tracking-widest uppercase text-[#5C5850] mb-5">
              Your Details 聯絡資訊
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs text-[#5C5850]">Full Name 姓名</span>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Your name"
                    className="border border-[#DDD6C1] bg-[#F9F6F0] px-4 py-3 text-sm text-[#1E1C18] focus:outline-none focus:border-[#9C8B6E] placeholder:text-[#9C8B6E]/50"
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs text-[#5C5850]">Phone 電話</span>
                  <input
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    placeholder="0912 345 678"
                    className="border border-[#DDD6C1] bg-[#F9F6F0] px-4 py-3 text-sm text-[#1E1C18] focus:outline-none focus:border-[#9C8B6E] placeholder:text-[#9C8B6E]/50"
                  />
                </label>
              </div>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs text-[#5C5850]">Email</span>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="you@example.com"
                  className="border border-[#DDD6C1] bg-[#F9F6F0] px-4 py-3 text-sm text-[#1E1C18] focus:outline-none focus:border-[#9C8B6E] placeholder:text-[#9C8B6E]/50"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs text-[#5C5850]">
                  Campsite / Notes 營地資訊
                </span>
                <textarea
                  rows={3}
                  value={form.notes}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  placeholder="Campsite name, address, or any special requests"
                  className="border border-[#DDD6C1] bg-[#F9F6F0] px-4 py-3 text-sm text-[#1E1C18] focus:outline-none focus:border-[#9C8B6E] placeholder:text-[#9C8B6E]/50 resize-none"
                />
              </label>

              <button
                type="submit"
                disabled={items.length === 0}
                className="mt-2 px-6 py-4 bg-[#1E1C18] text-[#F9F6F0] text-sm tracking-wide hover:bg-[#9C8B6E] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Submit Enquiry 送出預訂
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
