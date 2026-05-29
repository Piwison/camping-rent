import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import { BookingProvider } from "@/components/booking/BookingContext";

// Storefront chrome lives here, not in the root layout, so the admin subtree
// (which has its own VendorTopbar) never renders the public header/footer.
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BookingProvider>
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <SiteFooter />
    </BookingProvider>
  );
}
