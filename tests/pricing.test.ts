import { describe, it, expect } from "vitest";
import {
  calcNights,
  calcItemTotal,
  calcCartTotal,
  calcBookingTotal,
  formatTWD,
} from "@/lib/pricing";
import type { BookingItem } from "@/types/gear";

describe("calcNights", () => {
  it("returns 2 for a Fri–Sun range", () => {
    const from = new Date("2026-06-05");
    const to = new Date("2026-06-07");
    expect(calcNights(from, to)).toBe(2);
  });

  it("returns minimum 1 for same-day", () => {
    const d = new Date("2026-06-05");
    expect(calcNights(d, d)).toBe(1);
  });
});

describe("calcItemTotal", () => {
  it("multiplies daily price × nights × quantity", () => {
    expect(calcItemTotal(500, 2, 1)).toBe(1000);
    expect(calcItemTotal(300, 2, 2)).toBe(1200);
  });
});

describe("calcCartTotal", () => {
  it("sums all items price × quantity", () => {
    const items: BookingItem[] = [
      { type: "item", id: "a", name: "Tent", price: 800, quantity: 1 },
      { type: "bundle", id: "b", name: "Bundle", price: 3200, quantity: 1 },
    ];
    expect(calcCartTotal(items)).toBe(4000);
  });

  it("returns 0 for empty cart", () => {
    expect(calcCartTotal([])).toBe(0);
  });
});

describe("calcBookingTotal", () => {
  it("charges items per night but bundles at a flat weekend price", () => {
    const items: BookingItem[] = [
      { type: "item", id: "a", name: "Tent", price: 800, quantity: 1 },
      { type: "bundle", id: "b", name: "Bundle", price: 3200, quantity: 1 },
    ];
    // item: 800 × 2 nights = 1600; bundle: flat 3200 → 4800
    expect(calcBookingTotal(items, 2)).toBe(4800);
  });

  it("respects quantity for both items and bundles", () => {
    const items: BookingItem[] = [
      { type: "item", id: "a", name: "Chair", price: 100, quantity: 2 },
      { type: "bundle", id: "b", name: "Bundle", price: 3000, quantity: 2 },
    ];
    // items: 100 × 2 nights × 2 = 400; bundles: 3000 × 2 = 6000 → 6400
    expect(calcBookingTotal(items, 2)).toBe(6400);
  });

  it("returns 0 for empty cart", () => {
    expect(calcBookingTotal([], 2)).toBe(0);
  });
});

describe("formatTWD", () => {
  it("formats with NT$ prefix", () => {
    expect(formatTWD(3200)).toBe("NT$3,200");
    expect(formatTWD(1800)).toBe("NT$1,800");
  });
});
