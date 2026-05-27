import BookingPageClient from "@/components/booking/BookingPageClient";
import { pageMeta } from "@/lib/site";

export const metadata = pageMeta({
  title: "Book",
  description:
    "Tell us your dates and the gear you'd like. We'll confirm your glamping rental within 24 hours.",
  path: "/booking",
});

export default function BookingPage() {
  return <BookingPageClient />;
}
