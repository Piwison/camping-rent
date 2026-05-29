import { requireVendor } from "@/lib/vendor-session";
import VendorTopbar from "@/components/admin/VendorTopbar";

// Auth depends on request cookies — never prerender the dashboard.
export const dynamic = "force-dynamic";

// Gates the whole protected dashboard subtree. /admin/login sits outside this
// route group so it stays public.
export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const vendor = await requireVendor();
  return (
    <div className="min-h-[100dvh] bg-[#F9F6F0]">
      <VendorTopbar email={vendor.email} />
      <main id="main-content" tabIndex={-1} className="max-w-6xl mx-auto px-6 py-10">
        {children}
      </main>
    </div>
  );
}
