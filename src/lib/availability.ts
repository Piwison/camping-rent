// Pure availability logic (Phase 3, ADR-0009). No React, no DB — given an
// Item's stock and the Reservations that overlap a requested Weekend, compute
// how many units are free. The store layer (reservation-store.ts) feeds these
// the rows; this module just does the arithmetic so it stays unit-testable.
//
// Dates are YYYY-MM-DD and ranges are half-open [start, end): a booking that
// checks in on the 10th and out on the 12th occupies the *nights* of the 10th
// and 11th. Two ranges conflict only when they share a night.

export interface DateRange {
  start: string; // YYYY-MM-DD, check-in
  end: string; // YYYY-MM-DD, check-out (exclusive)
}

export interface Reservation {
  quantity: number;
  start: string;
  end: string;
}

const MS_PER_NIGHT = 86_400_000;

export function rangeNights(r: DateRange): number {
  return Math.round((Date.parse(r.end) - Date.parse(r.start)) / MS_PER_NIGHT);
}

// True when the two ranges share at least one night.
export function rangesOverlap(a: DateRange, b: DateRange): boolean {
  return a.start < b.end && b.start < a.end;
}

// The most units reserved on any single night inside `within`. Computed with a
// sweep line over reservation start/end points clipped to the window, so we
// never enumerate individual nights.
export function peakReservedUnits(reservations: Reservation[], within: DateRange): number {
  type Event = { at: string; delta: number };
  const events: Event[] = [];
  for (const r of reservations) {
    if (!rangesOverlap(r, within)) continue;
    const start = r.start > within.start ? r.start : within.start;
    const end = r.end < within.end ? r.end : within.end;
    events.push({ at: start, delta: r.quantity });
    events.push({ at: end, delta: -r.quantity });
  }
  // Sort by date; process releases (-) before claims (+) on the same date so a
  // reservation ending the morning another starts doesn't double-count.
  events.sort((a, b) => (a.at === b.at ? a.delta - b.delta : a.at < b.at ? -1 : 1));

  let current = 0;
  let peak = 0;
  for (const e of events) {
    current += e.delta;
    if (current > peak) peak = current;
  }
  return peak;
}

// Units free for the whole requested range — stock minus the busiest night,
// floored at zero.
export function unitsAvailable(
  stock: number,
  reservations: Reservation[],
  within: DateRange
): number {
  return Math.max(0, stock - peakReservedUnits(reservations, within));
}

export function isAvailable(
  stock: number,
  reservations: Reservation[],
  within: DateRange,
  requested = 1
): boolean {
  return unitsAvailable(stock, reservations, within) >= requested;
}

const DAY_MS = 86_400_000;
const toISODate = (ms: number): string => new Date(ms).toISOString().slice(0, 10);

// The next `count` Weekends as bookable ranges: Friday check-in → Sunday
// check-out (the Fri–Sun stay Bundles are priced for). `from` is an ISO date;
// the first weekend is the Friday on or after it.
export function upcomingWeekends(from: string, count: number): DateRange[] {
  const base = Date.parse(`${from.slice(0, 10)}T00:00:00Z`);
  const dow = new Date(base).getUTCDay(); // 0=Sun … 5=Fri
  const daysUntilFriday = (5 - dow + 7) % 7;
  let friday = base + daysUntilFriday * DAY_MS;
  const weekends: DateRange[] = [];
  for (let i = 0; i < count; i++) {
    weekends.push({ start: toISODate(friday), end: toISODate(friday + 2 * DAY_MS) });
    friday += 7 * DAY_MS;
  }
  return weekends;
}
