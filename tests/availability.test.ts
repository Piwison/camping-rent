import { describe, it, expect } from "vitest";
import {
  rangeNights,
  rangesOverlap,
  peakReservedUnits,
  unitsAvailable,
  isAvailable,
  upcomingWeekends,
  type DateRange,
  type Reservation,
} from "@/lib/availability";

const range = (start: string, end: string): DateRange => ({ start, end });
const res = (quantity: number, start: string, end: string): Reservation => ({
  quantity,
  start,
  end,
});

describe("rangeNights", () => {
  it("counts the nights in a half-open range", () => {
    expect(rangeNights(range("2026-07-10", "2026-07-12"))).toBe(2);
    expect(rangeNights(range("2026-07-10", "2026-07-11"))).toBe(1);
  });
});

describe("rangesOverlap", () => {
  it("is true when ranges share a night", () => {
    expect(rangesOverlap(range("2026-07-10", "2026-07-12"), range("2026-07-11", "2026-07-13"))).toBe(true);
  });
  it("is false when one ends the day the other begins (no shared night)", () => {
    expect(rangesOverlap(range("2026-07-10", "2026-07-12"), range("2026-07-12", "2026-07-14"))).toBe(false);
  });
});

describe("peakReservedUnits", () => {
  it("is zero with no reservations", () => {
    expect(peakReservedUnits([], range("2026-07-10", "2026-07-12"))).toBe(0);
  });

  it("sums concurrent reservations on the busiest night within the window", () => {
    const reservations = [
      res(2, "2026-07-10", "2026-07-12"), // covers 10, 11
      res(3, "2026-07-11", "2026-07-13"), // covers 11, 12
    ];
    // Night of the 11th has both → 5.
    expect(peakReservedUnits(reservations, range("2026-07-10", "2026-07-13"))).toBe(5);
  });

  it("ignores reservations outside the window", () => {
    const reservations = [res(4, "2026-08-01", "2026-08-03")];
    expect(peakReservedUnits(reservations, range("2026-07-10", "2026-07-12"))).toBe(0);
  });

  it("clips a reservation to the window when only part overlaps", () => {
    const reservations = [res(2, "2026-07-09", "2026-07-11")]; // covers 9, 10
    // Window starts on the 10th, so only the 10th counts → 2.
    expect(peakReservedUnits(reservations, range("2026-07-10", "2026-07-12"))).toBe(2);
  });
});

describe("unitsAvailable / isAvailable", () => {
  const stock = 5;
  const reservations = [res(2, "2026-07-10", "2026-07-12"), res(1, "2026-07-11", "2026-07-13")];

  it("subtracts the peak reserved units from stock", () => {
    // Peak within window is night of 11th: 2 + 1 = 3 → 5 − 3 = 2 free.
    expect(unitsAvailable(stock, reservations, range("2026-07-10", "2026-07-13"))).toBe(2);
  });

  it("never reports negative availability", () => {
    expect(unitsAvailable(1, reservations, range("2026-07-11", "2026-07-12"))).toBe(0);
  });

  it("isAvailable checks the requested quantity fits", () => {
    expect(isAvailable(stock, reservations, range("2026-07-10", "2026-07-13"), 2)).toBe(true);
    expect(isAvailable(stock, reservations, range("2026-07-10", "2026-07-13"), 3)).toBe(false);
  });

  it("defaults the requested quantity to 1", () => {
    expect(isAvailable(stock, reservations, range("2026-07-10", "2026-07-13"))).toBe(true);
  });
});

describe("upcomingWeekends", () => {
  it("returns Friday→Sunday ranges, starting from the next Friday", () => {
    // 2026-06-02 is a Tuesday; the next Friday is the 5th.
    const weekends = upcomingWeekends("2026-06-02", 3);
    expect(weekends).toEqual([
      { start: "2026-06-05", end: "2026-06-07" },
      { start: "2026-06-12", end: "2026-06-14" },
      { start: "2026-06-19", end: "2026-06-21" },
    ]);
  });

  it("counts the same day when `from` is already a Friday", () => {
    expect(upcomingWeekends("2026-06-05", 1)).toEqual([
      { start: "2026-06-05", end: "2026-06-07" },
    ]);
  });

  it("each weekend is two nights", () => {
    for (const w of upcomingWeekends("2026-06-02", 4)) {
      expect(rangeNights(w)).toBe(2);
    }
  });
});
