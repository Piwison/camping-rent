import "server-only";
import { getSupabase, isSupabaseConfigured } from "./supabase";
import { unitsAvailable, type DateRange, type Reservation } from "./availability";

// Bridges the datastore to the pure availability logic: pulls an Item's stock
// and the active Reservations overlapping a requested range, then reports how
// many units are free. Without Supabase (local dev) there are no reservations
// to know about, so everything is treated as freely available and the booking
// flow stays usable.

export interface ItemAvailability {
  itemId: string;
  stock: number;
  available: number;
}

const UNLIMITED = Number.POSITIVE_INFINITY;

export async function availabilityFor(
  itemIds: string[],
  range: DateRange
): Promise<Map<string, ItemAvailability>> {
  const ids = [...new Set(itemIds)];
  const out = new Map<string, ItemAvailability>();
  if (ids.length === 0) return out;

  if (!isSupabaseConfigured()) {
    for (const id of ids) out.set(id, { itemId: id, stock: UNLIMITED, available: UNLIMITED });
    return out;
  }

  const db = getSupabase();
  const [itemsRes, holdsRes] = await Promise.all([
    db.from("items").select("id, stock").in("id", ids),
    db
      .from("reservations")
      .select("item_id, quantity, start_date, end_date")
      .in("item_id", ids)
      .neq("status", "released")
      // Overlap with [start, end): held range starts before our checkout and
      // ends after our checkin.
      .lt("start_date", range.end)
      .gt("end_date", range.start),
  ]);
  if (itemsRes.error) throw itemsRes.error;
  if (holdsRes.error) throw holdsRes.error;

  const stockById = new Map(
    (itemsRes.data ?? []).map((r) => [r.id as string, (r.stock as number) ?? 0])
  );
  const holdsById = new Map<string, Reservation[]>();
  for (const h of holdsRes.data ?? []) {
    const list = holdsById.get(h.item_id as string) ?? [];
    list.push({ quantity: h.quantity as number, start: h.start_date as string, end: h.end_date as string });
    holdsById.set(h.item_id as string, list);
  }

  for (const id of ids) {
    const stock = stockById.get(id) ?? 0;
    const holds = holdsById.get(id) ?? [];
    out.set(id, { itemId: id, stock, available: unitsAvailable(stock, holds, range) });
  }
  return out;
}

// Availability for several Items across several ranges in one round-trip — the
// shape the Weekend calendar needs. Returns, per item id, the units free for
// each range (same order as `ranges`).
export async function itemsAvailabilityAcross(
  itemIds: string[],
  ranges: DateRange[]
): Promise<Map<string, number[]>> {
  const ids = [...new Set(itemIds)];
  const out = new Map<string, number[]>();
  if (ids.length === 0 || ranges.length === 0) return out;

  if (!isSupabaseConfigured()) {
    for (const id of ids) out.set(id, ranges.map(() => UNLIMITED));
    return out;
  }

  const span = {
    start: ranges.reduce((min, r) => (r.start < min ? r.start : min), ranges[0].start),
    end: ranges.reduce((max, r) => (r.end > max ? r.end : max), ranges[0].end),
  };

  const db = getSupabase();
  const [itemsRes, holdsRes] = await Promise.all([
    db.from("items").select("id, stock").in("id", ids),
    db
      .from("reservations")
      .select("item_id, quantity, start_date, end_date")
      .in("item_id", ids)
      .neq("status", "released")
      .lt("start_date", span.end)
      .gt("end_date", span.start),
  ]);
  if (itemsRes.error) throw itemsRes.error;
  if (holdsRes.error) throw holdsRes.error;

  const stockById = new Map(
    (itemsRes.data ?? []).map((r) => [r.id as string, (r.stock as number) ?? 0])
  );
  const holdsById = new Map<string, Reservation[]>();
  for (const h of holdsRes.data ?? []) {
    const list = holdsById.get(h.item_id as string) ?? [];
    list.push({ quantity: h.quantity as number, start: h.start_date as string, end: h.end_date as string });
    holdsById.set(h.item_id as string, list);
  }

  for (const id of ids) {
    const stock = stockById.get(id) ?? 0;
    const holds = holdsById.get(id) ?? [];
    out.set(id, ranges.map((r) => unitsAvailable(stock, holds, r)));
  }
  return out;
}
