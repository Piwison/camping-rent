import { describe, it, expect } from "vitest";
import {
  validateEnquiry,
  formatEnquiryItems,
  toEnquiryItems,
  type EnquiryPayload,
} from "@/lib/enquiry";
import type { BookingItem } from "@/types/gear";

const valid: EnquiryPayload = {
  name: "Mei Lin",
  email: "mei@example.com",
  phone: "0912345678",
  notes: "Riverside campsite",
  checkIn: "2026-06-05",
  checkOut: "2026-06-07",
  nights: 2,
  total: 4800,
  items: [
    { name: "Canvas Bell Tent 4m", type: "item", quantity: 1, unitPrice: 800 },
    { name: "Camp Set", type: "bundle", quantity: 1, unitPrice: 3200 },
  ],
};

describe("validateEnquiry", () => {
  it("accepts a complete, well-formed enquiry", () => {
    const { valid: ok, errors } = validateEnquiry(valid);
    expect(ok).toBe(true);
    expect(errors).toEqual({});
  });

  it("requires a name and a valid email", () => {
    const { valid: ok, errors } = validateEnquiry({
      ...valid,
      name: "  ",
      email: "not-an-email",
    });
    expect(ok).toBe(false);
    expect(errors.name).toBeDefined();
    expect(errors.email).toBeDefined();
  });

  it("rejects a check-out on or before check-in", () => {
    const { valid: ok, errors } = validateEnquiry({
      ...valid,
      checkIn: "2026-06-07",
      checkOut: "2026-06-05",
    });
    expect(ok).toBe(false);
    expect(errors.checkOut).toBeDefined();
  });

  it("requires at least one item", () => {
    const { valid: ok, errors } = validateEnquiry({ ...valid, items: [] });
    expect(ok).toBe(false);
    expect(errors.items).toBeDefined();
  });
});

describe("toEnquiryItems", () => {
  it("maps Booking lines to Enquiry lines, renaming price to unitPrice", () => {
    const booking: BookingItem[] = [
      { type: "item", id: "tent-01", name: "Canvas Bell Tent 4m", price: 800, quantity: 1 },
      { type: "bundle", id: "bundle-standard", name: "Camp Set", price: 3200, quantity: 2 },
    ];
    expect(toEnquiryItems(booking)).toEqual([
      { name: "Canvas Bell Tent 4m", type: "item", quantity: 1, unitPrice: 800 },
      { name: "Camp Set", type: "bundle", quantity: 2, unitPrice: 3200 },
    ]);
  });

  it("returns an empty list for an empty cart", () => {
    expect(toEnquiryItems([])).toEqual([]);
  });
});

describe("formatEnquiryItems", () => {
  it("renders a human-readable summary and marks bundles", () => {
    expect(formatEnquiryItems(valid.items)).toBe(
      "Canvas Bell Tent 4m ×1, Camp Set (bundle) ×1"
    );
  });
});
