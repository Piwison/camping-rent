"use server";

import { revalidatePath } from "next/cache";
import { requireVendor } from "@/lib/vendor-session";
import { setEnquiryStatus, getEnquiry } from "@/lib/enquiry-store";
import { syncReservationsToEnquiryStatus } from "@/lib/reservation-store";
import { notifyBookingConfirmed } from "@/lib/notify";
import { isEnquiryStatus } from "@/lib/enquiry";

export async function setEnquiryStatusAction(fd: FormData): Promise<void> {
  await requireVendor();
  const id = String(fd.get("id"));
  const status = String(fd.get("status"));
  if (!isEnquiryStatus(status)) return;
  await setEnquiryStatus(id, status);
  // Confirming holds stock; cancelling releases it (ADR-0009).
  await syncReservationsToEnquiryStatus(id, status);
  // Email the customer their confirmation (ADR-0012, best-effort).
  if (status === "confirmed") {
    const enquiry = await getEnquiry(id);
    if (enquiry) await notifyBookingConfirmed(enquiry);
  }
  revalidatePath("/admin/enquiries");
  revalidatePath(`/admin/enquiries/${id}`);
}
