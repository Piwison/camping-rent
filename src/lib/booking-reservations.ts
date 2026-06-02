import "server-only";
import type { EnquiryItem } from "./enquiry";
import type { ReservationLine } from "./reservation-store";
import { getBundleById } from "@/data/catalog";

// Expands a Booking's lines into per-Item reservation quantities. An Item line
// reserves itself; a Bundle line reserves each of its component Items (honouring
// duplicates — a bundle with two chairs reserves two), scaled by how many of
// that bundle were booked. Bundle composition comes from the Catalog, never the
// client, so reserved quantities are authoritative.
export async function expandReservationLines(
  items: EnquiryItem[]
): Promise<ReservationLine[]> {
  const byItem = new Map<string, number>();
  const add = (itemId: string, qty: number) =>
    byItem.set(itemId, (byItem.get(itemId) ?? 0) + qty);

  for (const line of items) {
    if (line.type === "item") {
      add(line.id, line.quantity);
      continue;
    }
    const bundle = await getBundleById(line.id);
    if (!bundle) continue; // unknown/unavailable bundle — nothing to reserve
    for (const componentId of bundle.itemIds) add(componentId, line.quantity);
  }

  return [...byItem.entries()].map(([itemId, quantity]) => ({ itemId, quantity }));
}
