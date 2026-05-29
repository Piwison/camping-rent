"use server";

import { revalidatePath } from "next/cache";
import { requireVendor } from "@/lib/vendor-session";
import { setEnquiryStatus } from "@/lib/enquiry-store";
import { isEnquiryStatus } from "@/lib/enquiry";

export async function setEnquiryStatusAction(fd: FormData): Promise<void> {
  await requireVendor();
  const id = String(fd.get("id"));
  const status = String(fd.get("status"));
  if (!isEnquiryStatus(status)) return;
  await setEnquiryStatus(id, status);
  revalidatePath("/admin/enquiries");
  revalidatePath(`/admin/enquiries/${id}`);
}
