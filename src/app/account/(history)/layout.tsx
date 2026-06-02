import { requireCustomer } from "@/lib/customer-session";
import CustomerTopbar from "@/components/account/CustomerTopbar";

// Auth depends on request cookies — never prerender the account area.
export const dynamic = "force-dynamic";

// Gates the Customer account subtree. /account/login sits outside this route
// group so it stays public.
export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const customer = await requireCustomer();
  return (
    <div className="min-h-[100dvh] bg-[#F9F6F0]">
      <CustomerTopbar email={customer.email} />
      <main id="main-content" tabIndex={-1} className="max-w-4xl mx-auto px-6 py-10">
        {children}
      </main>
    </div>
  );
}
