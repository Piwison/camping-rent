import "server-only";
import type { GearBundle } from "@/types/gear";
import { upcomingWeekends, type DateRange } from "./availability";
import { itemsAvailabilityAcross } from "./availability-service";

// Weekend-by-weekend availability for the storefront calendar. An Item reports
// its own free units; a Bundle reports how many complete sets can be made — the
// limiting component, accounting for duplicates (a bundle with two chairs needs
// two free chairs per set).

export interface WeekendSlot {
  range: DateRange;
  available: number; // Infinity when no datastore is configured (local dev)
  unlimited: boolean;
}

const WEEKS = 6;

function toSlots(ranges: DateRange[], counts: number[]): WeekendSlot[] {
  return ranges.map((range, i) => ({
    range,
    available: counts[i],
    unlimited: !Number.isFinite(counts[i]),
  }));
}

export async function itemWeekendAvailability(
  itemId: string,
  from = new Date().toISOString()
): Promise<WeekendSlot[]> {
  const ranges = upcomingWeekends(from, WEEKS);
  const byItem = await itemsAvailabilityAcross([itemId], ranges);
  const counts = byItem.get(itemId) ?? ranges.map(() => 0);
  return toSlots(ranges, counts);
}

export async function bundleWeekendAvailability(
  bundle: GearBundle,
  from = new Date().toISOString()
): Promise<WeekendSlot[]> {
  const ranges = upcomingWeekends(from, WEEKS);
  if (bundle.itemIds.length === 0) return toSlots(ranges, ranges.map(() => 0));

  // How many of each component one bundle needs (duplicates count).
  const perBundle = new Map<string, number>();
  for (const id of bundle.itemIds) perBundle.set(id, (perBundle.get(id) ?? 0) + 1);

  const byItem = await itemsAvailabilityAcross([...perBundle.keys()], ranges);
  const counts = ranges.map((_, i) => {
    let sets = Infinity;
    for (const [itemId, need] of perBundle) {
      const free = byItem.get(itemId)?.[i] ?? 0;
      sets = Math.min(sets, Math.floor(free / need));
    }
    return sets;
  });
  return toSlots(ranges, counts);
}
