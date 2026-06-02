import "server-only";
import type { EnquiryPayload } from "./enquiry";
import { formatEnquiryItems } from "./enquiry";
import { isSupabaseConfigured } from "./supabase";
import { insertEnquiry } from "./enquiry-store";
import { expandReservationLines } from "./booking-reservations";
import { availabilityFor } from "./availability-service";
import { createReservations } from "./reservation-store";
import { getItemById } from "@/data/catalog";

export type EnquiryResult =
  | { status: "sent"; enquiryId: string }
  | { status: "skipped" } // no datastore configured — logged for local dev
  | { status: "unavailable"; items: string[] } // gear short for those dates
  | { status: "error"; message: string };

// The Enquiry sink seam: where a submitted Enquiry goes. With a datastore
// (ADR-0007) it now also enforces real-time availability (ADR-0009) — the
// Booking is rejected if any gear is short for the requested Weekend, otherwise
// it lands as an Enquiry with `held` reservations against the Vendor's stock.
// Without a datastore the Enquiry is logged and reported `skipped`, so the
// booking flow stays usable in local dev without credentials.
export async function deliverEnquiry(
  payload: EnquiryPayload,
  userId?: string | null
): Promise<EnquiryResult> {
  if (!isSupabaseConfigured()) {
    console.info("[enquiry] Supabase not configured — logging enquiry:", {
      name: payload.name,
      email: payload.email,
      checkIn: payload.checkIn,
      checkOut: payload.checkOut,
      total: payload.total,
      items: formatEnquiryItems(payload.items),
    });
    return { status: "skipped" };
  }

  try {
    const range = { start: payload.checkIn, end: payload.checkOut };
    const lines = await expandReservationLines(payload.items);
    const availability = await availabilityFor(
      lines.map((l) => l.itemId),
      range
    );

    const shortIds = lines
      .filter((l) => (availability.get(l.itemId)?.available ?? 0) < l.quantity)
      .map((l) => l.itemId);
    if (shortIds.length > 0) {
      const names = await Promise.all(
        shortIds.map(async (id) => (await getItemById(id))?.name ?? id)
      );
      return { status: "unavailable", items: names };
    }

    const enquiryId = await insertEnquiry(payload, userId);
    await createReservations(enquiryId, lines, range);
    return { status: "sent", enquiryId };
  } catch (err) {
    console.error("[enquiry] Failed to store enquiry", err);
    return { status: "error", message: "Failed to store enquiry." };
  }
}
