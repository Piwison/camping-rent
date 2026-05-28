import type { BookingItem } from "@/types/gear";

export function calcNights(from: Date, to: Date): number {
  const ms = to.getTime() - from.getTime();
  return Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)));
}

export function calcItemTotal(dailyPrice: number, nights: number, qty: number): number {
  return dailyPrice * nights * qty;
}

export function calcCartTotal(items: BookingItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

// Booking total honouring the rental rules: bundles are a flat weekend price,
// individual items are charged per night.
export function calcBookingTotal(items: BookingItem[], nights: number): number {
  return items.reduce((sum, item) => {
    const lineTotal =
      item.type === "bundle"
        ? item.price * item.quantity
        : calcItemTotal(item.price, nights, item.quantity);
    return sum + lineTotal;
  }, 0);
}

export function formatTWD(amount: number): string {
  return `NT$${amount.toLocaleString("en-US")}`;
}

export function defaultWeekendDates(): { from: Date; to: Date } {
  const today = new Date();
  const day = today.getDay();
  const daysUntilFriday = (5 - day + 7) % 7 || 7;
  const from = new Date(today);
  from.setDate(today.getDate() + daysUntilFriday);
  from.setHours(0, 0, 0, 0);
  const to = new Date(from);
  to.setDate(from.getDate() + 2);
  return { from, to };
}
