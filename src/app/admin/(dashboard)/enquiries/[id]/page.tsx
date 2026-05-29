import Link from "next/link";
import { notFound } from "next/navigation";
import { getEnquiry } from "@/lib/enquiry-store";
import { formatTWD } from "@/lib/pricing";
import { ENQUIRY_STATUSES } from "@/lib/enquiry";
import { setEnquiryStatusAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function EnquiryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const e = await getEnquiry(id);
  if (!e) notFound();

  return (
    <div className="max-w-2xl">
      <Link href="/admin/enquiries" className="text-sm text-[#9C8B6E] hover:text-[#1E1C18]">
        ← All enquiries
      </Link>
      <h1 className="font-serif text-3xl text-[#1E1C18] mt-3 mb-1">{e.name}</h1>
      <p className="text-sm text-[#9C8B6E] mb-6">
        Submitted {new Date(e.createdAt).toLocaleString()}
      </p>

      <dl className="grid grid-cols-[8rem_1fr] gap-y-2 text-sm mb-8">
        <dt className="text-[#9C8B6E]">Email</dt>
        <dd className="text-[#1E1C18]">{e.email}</dd>
        <dt className="text-[#9C8B6E]">Phone</dt>
        <dd className="text-[#1E1C18]">{e.phone || "—"}</dd>
        <dt className="text-[#9C8B6E]">Dates</dt>
        <dd className="text-[#1E1C18]">
          {e.checkIn} → {e.checkOut} ({e.nights} night{e.nights !== 1 ? "s" : ""})
        </dd>
        <dt className="text-[#9C8B6E]">Total</dt>
        <dd className="text-[#1E1C18]">{formatTWD(e.total)}</dd>
        <dt className="text-[#9C8B6E]">Notes</dt>
        <dd className="text-[#1E1C18] whitespace-pre-wrap">{e.notes || "—"}</dd>
      </dl>

      <h2 className="text-xs font-semibold tracking-widest uppercase text-[#5C5850] mb-3">
        Items
      </h2>
      <ul className="border border-[#DDD6C1] bg-white divide-y divide-[#EAE5D8] mb-8">
        {e.items.map((it, i) => (
          <li key={i} className="flex justify-between px-4 py-2 text-sm">
            <span className="text-[#1E1C18]">
              {it.name}
              {it.type === "bundle" ? " (bundle)" : ""} ×{it.quantity}
            </span>
            <span className="text-[#9C8B6E]">{formatTWD(it.unitPrice)}</span>
          </li>
        ))}
      </ul>

      <form action={setEnquiryStatusAction} className="flex items-end gap-3">
        <input type="hidden" name="id" value={e.id} />
        <label className="flex flex-col gap-1">
          <span className="text-xs text-[#5C5850]">Status</span>
          <select
            name="status"
            defaultValue={e.status}
            className="border border-[#DDD6C1] bg-white px-3 py-2 text-sm focus:outline-none focus:border-[#9C8B6E]"
          >
            {ENQUIRY_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <button className="px-5 py-2 bg-[#1E1C18] text-[#F9F6F0] text-sm hover:bg-[#9C8B6E] transition-colors">
          Update
        </button>
      </form>
    </div>
  );
}
