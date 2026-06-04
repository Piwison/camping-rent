import Link from "next/link";
import { pageMeta } from "@/lib/site";

export const metadata = pageMeta({
  title: "Payment received",
  description: "Your Basecamp & Co. booking deposit.",
  path: "/booking/paid",
});

// Where ECPay returns the shopper after checkout (ClientBackURL). The
// authoritative payment state is set by the server-to-server callback, so this
// page is purely a friendly confirmation.
export default function BookingPaidPage() {
  return (
    <div className="pt-32 pb-20 min-h-[70dvh] flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <h1 className="font-[family-name:var(--font-playfair)] text-4xl text-[#1E1C18] mb-3">
          Thank you
        </h1>
        <p className="text-sm text-[#5C5850] mb-2">
          If your deposit went through, your weekend is secured — we&apos;ll
          confirm the details within 24 hours.
        </p>
        <p className="text-xs text-[#9C8B6E] mb-8">
          押金已收到，我們將在24小時內與您確認預訂細節。
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/account" className="btn btn-sm btn-primary">
            View my bookings
          </Link>
          <Link href="/gear" className="text-sm text-[#7A6B54] hover:text-[#1E1C18]">
            Keep browsing
          </Link>
        </div>
      </div>
    </div>
  );
}
