import type { EnquiryRecord } from "./enquiry";
import { formatEnquiryItems } from "./enquiry";
import { formatTWD } from "./pricing";

// Pure email composition (ADR-0012): turn an Enquiry into the subject/body for
// each lifecycle message. No I/O, so it's unit-tested; the notify adapter just
// sends what these return.

export interface EmailContent {
  subject: string;
  text: string;
}

const BRAND = "Basecamp & Co.";

function tripLine(e: EnquiryRecord): string {
  const nights = `${e.nights} night${e.nights === 1 ? "" : "s"}`;
  return `${e.checkIn} → ${e.checkOut} (${nights})`;
}

// Customer: "we've got your enquiry" (sent on submit).
export function enquiryReceivedEmail(e: EnquiryRecord): EmailContent {
  return {
    subject: `${BRAND} — we received your booking enquiry`,
    text: [
      `Hi ${e.name},`,
      ``,
      `Thanks for your enquiry with ${BRAND}. We'll confirm availability and the`,
      `details within 24 hours.`,
      ``,
      `Trip: ${tripLine(e)}`,
      `Gear: ${formatEnquiryItems(e.items)}`,
      `Estimated total: ${formatTWD(e.total)}`,
      ``,
      `— ${BRAND}`,
    ].join("\n"),
  };
}

// Customer: "your booking is confirmed" (sent when the Vendor confirms).
export function bookingConfirmedEmail(e: EnquiryRecord): EmailContent {
  const deposit =
    e.paymentStatus === "deposit_paid" && e.depositAmount
      ? `Deposit received: ${formatTWD(e.depositAmount)}. Balance due on pickup.`
      : `No deposit on file — we'll arrange payment with you directly.`;
  return {
    subject: `${BRAND} — your booking is confirmed`,
    text: [
      `Hi ${e.name},`,
      ``,
      `Good news — your weekend is confirmed.`,
      ``,
      `Trip: ${tripLine(e)}`,
      `Gear: ${formatEnquiryItems(e.items)}`,
      `Total: ${formatTWD(e.total)}`,
      deposit,
      ``,
      `See you out there.`,
      `— ${BRAND}`,
    ].join("\n"),
  };
}

// Customer: a nudge a couple of days before the trip.
export function weekendReminderEmail(e: EnquiryRecord): EmailContent {
  return {
    subject: `${BRAND} — your camping weekend is almost here`,
    text: [
      `Hi ${e.name},`,
      ``,
      `Your booking is coming up: ${tripLine(e)}.`,
      `Gear: ${formatEnquiryItems(e.items)}`,
      ``,
      `We'll be in touch about pickup/drop-off. Reply with any questions.`,
      ``,
      `— ${BRAND}`,
    ].join("\n"),
  };
}

// Vendor: a new enquiry has landed (sent on submit).
export function vendorNewEnquiryEmail(e: EnquiryRecord): EmailContent {
  return {
    subject: `New enquiry — ${e.name}, ${tripLine(e)}`,
    text: [
      `New booking enquiry:`,
      ``,
      `Name: ${e.name}`,
      `Email: ${e.email}`,
      `Phone: ${e.phone ?? "—"}`,
      `Trip: ${tripLine(e)}`,
      `Gear: ${formatEnquiryItems(e.items)}`,
      `Total: ${formatTWD(e.total)}`,
      e.notes ? `Notes: ${e.notes}` : ``,
    ]
      .filter(Boolean)
      .join("\n"),
  };
}
