import "server-only";
import type { EnquiryPayload } from "./enquiry";
import { formatEnquiryItems } from "./enquiry";
import { isSupabaseConfigured } from "./supabase";
import { insertEnquiry } from "./enquiry-store";

export type EnquiryResult =
  | { status: "sent" }
  | { status: "skipped" } // no datastore configured — logged for local dev
  | { status: "error"; message: string };

// The Enquiry sink seam: where a submitted Enquiry goes. The adapter is now
// Postgres (ADR-0007, superseding ADR-0003). Without a datastore configured the
// Enquiry is logged and reported `skipped`, so the booking flow stays usable in
// local dev without credentials.
export async function deliverEnquiry(
  payload: EnquiryPayload
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
    await insertEnquiry(payload);
    return { status: "sent" };
  } catch (err) {
    console.error("[enquiry] Failed to store enquiry", err);
    return { status: "error", message: "Failed to store enquiry." };
  }
}
