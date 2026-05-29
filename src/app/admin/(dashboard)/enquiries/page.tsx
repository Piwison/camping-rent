import Link from "next/link";
import { listEnquiries } from "@/lib/enquiry-store";
import { formatTWD } from "@/lib/pricing";
import type { EnquiryStatus } from "@/lib/enquiry";

export const dynamic = "force-dynamic";

const statusColor: Record<EnquiryStatus, string> = {
  new: "bg-[#9C8B6E] text-[#F9F6F0]",
  confirmed: "bg-[#2f5d3a] text-[#F9F6F0]",
  fulfilled: "bg-[#1E1C18] text-[#F9F6F0]",
  cancelled: "bg-[#DDD6C1] text-[#5C5850]",
};

export default async function EnquiriesPage() {
  const enquiries = await listEnquiries();

  return (
    <div>
      <h1 className="font-serif text-3xl text-[#1E1C18] mb-6">Enquiries</h1>
      {enquiries.length === 0 ? (
        <p className="text-sm text-[#9C8B6E]">No enquiries yet.</p>
      ) : (
        <div className="border border-[#DDD6C1] bg-white divide-y divide-[#EAE5D8]">
          {enquiries.map((e) => (
            <Link
              key={e.id}
              href={`/admin/enquiries/${e.id}`}
              className="flex items-center gap-4 px-4 py-3 hover:bg-[#FBF8F2]"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[#1E1C18] truncate">{e.name}</p>
                <p className="text-xs text-[#9C8B6E]">
                  {e.checkIn} → {e.checkOut} · {formatTWD(e.total)}
                </p>
              </div>
              <span className={`text-xs px-2 py-1 ${statusColor[e.status]}`}>{e.status}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
