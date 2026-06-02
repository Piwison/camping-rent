import "server-only";
import { getSupabase } from "./supabase";
import type { DateRange } from "./availability";

// Write side of reservations (ADR-0009). A submitted Booking places `held`
// reservations against the Vendor's stock; confirming the Enquiry promotes them
// to `confirmed`; cancelling `releases` them so the stock frees up again.

export interface ReservationLine {
  itemId: string;
  quantity: number;
}

export async function createReservations(
  enquiryId: string,
  lines: ReservationLine[],
  range: DateRange
): Promise<void> {
  if (lines.length === 0) return;
  const db = getSupabase();
  const rows = lines.map((l) => ({
    item_id: l.itemId,
    enquiry_id: enquiryId,
    quantity: l.quantity,
    start_date: range.start,
    end_date: range.end,
    status: "held" as const,
  }));
  const { error } = await db.from("reservations").insert(rows);
  if (error) throw error;
}

// Keep an Enquiry's holds in step with its status: confirmed bookings hold
// stock, cancelled bookings release it. Other statuses leave holds untouched.
export async function syncReservationsToEnquiryStatus(
  enquiryId: string,
  status: "new" | "confirmed" | "fulfilled" | "cancelled"
): Promise<void> {
  const next =
    status === "cancelled" ? "released" : status === "confirmed" ? "confirmed" : null;
  if (!next) return;
  const db = getSupabase();
  const { error } = await db
    .from("reservations")
    .update({ status: next })
    .eq("enquiry_id", enquiryId);
  if (error) throw error;
}
