import type { WeekendSlot } from "@/lib/weekend-availability";

// Presentational Weekend availability strip for a gear detail page. Server
// component — it just renders the slots the page computed. When no datastore is
// configured (local dev) slots are `unlimited` and we skip the calendar so the
// demo storefront looks unchanged.

const fmt = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });

export default function AvailabilityCalendar({
  slots,
  label = "units",
}: {
  slots: WeekendSlot[];
  label?: string;
}) {
  if (slots.length === 0 || slots.every((s) => s.unlimited)) return null;

  return (
    <section className="max-w-6xl mx-auto px-6 py-12 border-t border-[#E8E1D1]">
      <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-[#1E1C18]">
        Weekend availability
      </h2>
      <p className="mt-1 text-sm text-[#5C5850]">
        Fri–Sun stays. Confirmed offline within 24 hours of your enquiry.
      </p>
      <ul className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {slots.map((s) => {
          const out = s.available <= 0;
          const low = !out && s.available <= 2;
          return (
            <li
              key={s.range.start}
              className={`rounded-lg border px-3 py-3 text-center ${
                out
                  ? "border-[#E2D9C6] bg-[#F3EEE2] text-[#A39A86]"
                  : "border-[#DDD6C1] bg-white text-[#1E1C18]"
              }`}
            >
              <div className="text-xs uppercase tracking-wide text-[#9C8B6E]">
                {fmt(s.range.start)} – {fmt(s.range.end)}
              </div>
              <div className="mt-1 text-sm font-medium">
                {out ? (
                  "Booked"
                ) : (
                  <>
                    {s.available} {label}
                    {low && <span className="ml-1 text-[#9C3B2E]">· few left</span>}
                  </>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
