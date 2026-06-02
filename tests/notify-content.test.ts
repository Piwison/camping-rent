import { describe, it, expect } from "vitest";
import {
  enquiryReceivedEmail,
  bookingConfirmedEmail,
  weekendReminderEmail,
  vendorNewEnquiryEmail,
} from "@/lib/notify-content";
import type { EnquiryRecord } from "@/lib/enquiry";

const enquiry: EnquiryRecord = {
  id: "e1",
  name: "Mei",
  email: "mei@example.com",
  phone: "0912345678",
  notes: "Late arrival",
  checkIn: "2026-07-10",
  checkOut: "2026-07-12",
  nights: 2,
  total: 4800,
  items: [
    { id: "tent-01", name: "Canvas Bell Tent 4m", type: "item", quantity: 1, unitPrice: 800 },
    { id: "camp-set", name: "Camp Set", type: "bundle", quantity: 1, unitPrice: 3200 },
  ],
  status: "new",
  createdAt: "2026-06-02T10:00:00Z",
  paymentStatus: "unpaid",
};

describe("enquiryReceivedEmail", () => {
  it("greets the customer and summarises the trip + total", () => {
    const { subject, text } = enquiryReceivedEmail(enquiry);
    expect(subject).toMatch(/received your booking enquiry/i);
    expect(text).toContain("Hi Mei,");
    expect(text).toContain("2026-07-10 → 2026-07-12 (2 nights)");
    expect(text).toContain("NT$4,800");
  });
});

describe("bookingConfirmedEmail", () => {
  it("notes the deposit when one was paid", () => {
    const { text } = bookingConfirmedEmail({
      ...enquiry,
      paymentStatus: "deposit_paid",
      depositAmount: 1440,
    });
    expect(text).toContain("Deposit received: NT$1,440");
  });

  it("falls back when no deposit is on file", () => {
    expect(bookingConfirmedEmail(enquiry).text).toMatch(/No deposit on file/i);
  });
});

describe("weekendReminderEmail", () => {
  it("references the upcoming trip dates", () => {
    expect(weekendReminderEmail(enquiry).text).toContain("2026-07-10 → 2026-07-12");
  });
});

describe("vendorNewEnquiryEmail", () => {
  it("includes contact details and omits an empty notes line", () => {
    const withNotes = vendorNewEnquiryEmail(enquiry).text;
    expect(withNotes).toContain("mei@example.com");
    expect(withNotes).toContain("Notes: Late arrival");

    const noNotes = vendorNewEnquiryEmail({ ...enquiry, notes: undefined }).text;
    expect(noNotes).not.toMatch(/Notes:/);
  });
});
