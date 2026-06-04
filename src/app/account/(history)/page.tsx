import Link from "next/link";
import { requireCustomer } from "@/lib/customer-session";
import { listEnquiriesForUser } from "@/lib/enquiry-store";
import { formatEnquiryItems, type EnquiryStatus } from "@/lib/enquiry";
import { formatTWD } from "@/lib/pricing";
import ExperienceReviewForm from "@/components/reviews/ExperienceReviewForm";

export const dynamic = "force-dynamic";

// Customer-facing language for the Vendor's offline workflow statuses.
const statusLabel: Record<EnquiryStatus, string> = {
  new: "Pending confirmation",
  confirmed: "Confirmed",
  fulfilled: "Completed",
  cancelled: "Cancelled",
};

const statusColor: Record<EnquiryStatus, string> = {
  new: "bg-[#9C8B6E] text-[#F9F6F0]",
  confirmed: "bg-[#2f5d3a] text-[#F9F6F0]",
  fulfilled: "bg-[#1E1C18] text-[#F9F6F0]",
  cancelled: "bg-[#DDD6C1] text-[#5C5850]",
};

const fmtDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

export default async function BookingHistoryPage() {
  const customer = await requireCustomer();
  const bookings = await listEnquiriesForUser(customer.id);

  return (
    <div>
      <h1 className="font-[family-name:var(--font-playfair)] text-3xl text-[#1E1C18] mb-1">
        My bookings
      </h1>
      <p className="text-sm text-[#5C5850] mb-8">
        Each enquiry is confirmed offline within 24 hours.
      </p>

      {bookings.length === 0 ? (
        <div className="border border-[#DDD6C1] bg-white px-6 py-10 text-center">
          <p className="text-sm text-[#5C5850]">No bookings yet.</p>
          <Link href="/gear" className="btn btn-sm btn-primary mt-4">
            Browse the catalog
          </Link>
        </div>
      ) : (
        <ul className="flex flex-col gap-4">
          {bookings.map((b) => (
            <li key={b.id} className="border border-[#DDD6C1] bg-white px-5 py-4">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-medium text-[#1E1C18]">
                  {fmtDate(b.checkIn)} – {fmtDate(b.checkOut)}
                </span>
                <span className={`text-xs px-2 py-1 ${statusColor[b.status]}`}>
                  {statusLabel[b.status]}
                </span>
              </div>
              <p className="mt-2 text-sm text-[#5C5850]">{formatEnquiryItems(b.items)}</p>
              <p className="mt-1 text-sm text-[#7A6B54]">
                {b.nights} night{b.nights === 1 ? "" : "s"} · {formatTWD(b.total)}
                {b.paymentStatus === "deposit_paid" && b.depositAmount
                  ? ` · ${formatTWD(b.depositAmount)} deposit paid`
                  : ""}
              </p>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-12 pt-10 border-t border-[#DDD6C1]">
        <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-[#1E1C18] mb-4">
          Tell us how it went
        </h2>
        <ExperienceReviewForm defaultName={customer.email.split("@")[0] || "Guest"} />
      </div>
    </div>
  );
}
