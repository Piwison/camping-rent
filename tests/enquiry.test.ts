import { describe, it, expect } from "vitest";
import {
  validateEnquiry,
  formatEnquiryItems,
  toEnquiryItems,
  rowToEnquiry,
  enquiryToInsertRow,
  isEnquiryStatus,
  type EnquiryPayload,
  type EnquiryRow,
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

describe("enquiry persistence mapping", () => {
  it("maps a payload to an insert row (camelCase → snake_case, defaults nulls)", () => {
    const row = enquiryToInsertRow({ ...valid, phone: undefined, notes: undefined });
    expect(row).toMatchObject({
      name: "Mei Lin",
      email: "mei@example.com",
      phone: null,
      notes: null,
      check_in: "2026-06-05",
      check_out: "2026-06-07",
      nights: 2,
      total: 4800,
    });
    expect(row.items).toHaveLength(2);
  });

  it("maps a stored row back to an EnquiryRecord", () => {
    const dbRow: EnquiryRow = {
      id: "abc-123",
      name: "Mei Lin",
      email: "mei@example.com",
      phone: null,
      notes: null,
      check_in: "2026-06-05",
      check_out: "2026-06-07",
      nights: 2,
      total: 4800,
      items: valid.items,
      status: "confirmed",
      created_at: "2026-05-29T10:00:00Z",
    };
    const record = rowToEnquiry(dbRow);
    expect(record.checkIn).toBe("2026-06-05");
    expect(record.phone).toBeUndefined();
    expect(record.status).toBe("confirmed");
    expect(record.createdAt).toBe("2026-05-29T10:00:00Z");
  });
});

describe("isEnquiryStatus", () => {
  it("accepts the four workflow statuses and rejects others", () => {
    expect(isEnquiryStatus("new")).toBe(true);
    expect(isEnquiryStatus("fulfilled")).toBe(true);
    expect(isEnquiryStatus("archived")).toBe(false);
  });
});
