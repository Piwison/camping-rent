import Link from "next/link";

export const dynamic = "force-dynamic";

export default function AdminOverviewPage() {
  return (
    <div>
      <h1 className="font-serif text-3xl text-[#1E1C18] mb-2">Vendor Dashboard</h1>
      <p className="text-sm text-[#5C5850] mb-8">
        Manage the Catalog and work through booking Enquiries.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/admin/catalog"
          className="block border border-[#DDD6C1] bg-white p-6 hover:border-[#9C8B6E] transition-colors"
        >
          <h2 className="font-serif text-xl text-[#1E1C18] mb-1">Catalog</h2>
          <p className="text-sm text-[#9C8B6E]">Add, edit, and retire Items and Bundles.</p>
        </Link>
        <Link
          href="/admin/enquiries"
          className="block border border-[#DDD6C1] bg-white p-6 hover:border-[#9C8B6E] transition-colors"
        >
          <h2 className="font-serif text-xl text-[#1E1C18] mb-1">Enquiries</h2>
          <p className="text-sm text-[#9C8B6E]">Triage and confirm booking Enquiries.</p>
        </Link>
      </div>
    </div>
  );
}
