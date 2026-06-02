import "server-only";
import type { EnquiryRecord } from "./enquiry";
import { parseVendorAllowlist } from "./auth-roles";
import {
  enquiryReceivedEmail,
  bookingConfirmedEmail,
  weekendReminderEmail,
  vendorNewEnquiryEmail,
  type EmailContent,
} from "./notify-content";

// The notification seam (ADR-0012): where lifecycle emails go. Resend is the
// private adapter; without RESEND_API_KEY the message is logged and reported
// `skipped`, so the booking flow works in local dev — the same degradation
// posture as the Enquiry sink and payment seam.

export type NotifyResult = { status: "sent" } | { status: "skipped" } | { status: "error" };

const FROM = process.env.NOTIFY_FROM ?? "Basecamp & Co. <onboarding@resend.dev>";

function vendorRecipient(): string | undefined {
  return process.env.NOTIFY_VENDOR_TO ?? parseVendorAllowlist(process.env.VENDOR_EMAILS)[0];
}

async function sendEmail(to: string, content: EmailContent): Promise<NotifyResult> {
  const key = process.env.RESEND_API_KEY;
  if (!key || !to) {
    console.info("[notify] Resend not configured — logging email:", {
      to,
      subject: content.subject,
    });
    return { status: "skipped" };
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to,
        subject: content.subject,
        text: content.text,
      }),
    });
    if (!res.ok) {
      console.error("[notify] Resend error", res.status, await res.text().catch(() => ""));
      return { status: "error" };
    }
    return { status: "sent" };
  } catch (err) {
    console.error("[notify] Failed to send email", err);
    return { status: "error" };
  }
}

// On submit: confirm to the customer and alert the Vendor. Never throws — a
// failed email must not fail the booking.
export async function notifyEnquiryReceived(e: EnquiryRecord): Promise<void> {
  await Promise.allSettled([
    sendEmail(e.email, enquiryReceivedEmail(e)),
    (async () => {
      const vendor = vendorRecipient();
      if (vendor) await sendEmail(vendor, vendorNewEnquiryEmail(e));
    })(),
  ]);
}

export async function notifyBookingConfirmed(e: EnquiryRecord): Promise<void> {
  await sendEmail(e.email, bookingConfirmedEmail(e));
}

export async function notifyWeekendReminder(e: EnquiryRecord): Promise<NotifyResult> {
  return sendEmail(e.email, weekendReminderEmail(e));
}
