import type { BookingItem } from "@/types/gear";

export interface EnquiryItem {
  name: string;
  type: "item" | "bundle";
  quantity: number;
  unitPrice: number;
}

// The single translation from a Booking line to an Enquiry line: drops the
// internal id and renames price to unitPrice for the wire payload.
export function toEnquiryItems(items: BookingItem[]): EnquiryItem[] {
  return items.map((i) => ({
    name: i.name,
    type: i.type,
    quantity: i.quantity,
    unitPrice: i.price,
  }));
}

export interface EnquiryPayload {
  name: string;
  email: string;
  phone?: string;
  notes?: string;
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  nights: number;
  total: number;
  items: EnquiryItem[];
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEnquiry(p: Partial<EnquiryPayload>): {
  valid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (!p.name?.trim()) errors.name = "Name is required.";
  if (!p.email || !EMAIL_RE.test(p.email))
    errors.email = "A valid email is required.";
  if (!p.checkIn) errors.checkIn = "Check-in date is required.";
  if (!p.checkOut) errors.checkOut = "Check-out date is required.";
  if (p.checkIn && p.checkOut && new Date(p.checkOut) <= new Date(p.checkIn))
    errors.checkOut = "Check-out must be after check-in.";
  if (!p.items?.length) errors.items = "Add at least one item or bundle.";
  if (typeof p.total !== "number" || p.total < 0)
    errors.total = "Invalid total.";

  return { valid: Object.keys(errors).length === 0, errors };
}

export function formatEnquiryItems(items: EnquiryItem[]): string {
  return items
    .map((i) => `${i.name}${i.type === "bundle" ? " (bundle)" : ""} ×${i.quantity}`)
    .join(", ");
}

// The Vendor's offline-confirmation workflow (ADR-0007).
export const ENQUIRY_STATUSES = ["new", "confirmed", "fulfilled", "cancelled"] as const;
export type EnquiryStatus = (typeof ENQUIRY_STATUSES)[number];

export function isEnquiryStatus(s: string): s is EnquiryStatus {
  return (ENQUIRY_STATUSES as readonly string[]).includes(s);
}

// A stored Enquiry — the submitted payload plus its inbox metadata.
export interface EnquiryRecord extends EnquiryPayload {
  id: string;
  status: EnquiryStatus;
  createdAt: string;
}

// Postgres row shape (snake_case) for the enquiries table.
export interface EnquiryRow {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  notes: string | null;
  check_in: string;
  check_out: string;
  nights: number;
  total: number;
  items: EnquiryItem[];
  status: EnquiryStatus;
  created_at: string;
}

export function rowToEnquiry(r: EnquiryRow): EnquiryRecord {
  return {
    id: r.id,
    name: r.name,
    email: r.email,
    phone: r.phone ?? undefined,
    notes: r.notes ?? undefined,
    checkIn: r.check_in,
    checkOut: r.check_out,
    nights: r.nights,
    total: r.total,
    items: r.items,
    status: r.status,
    createdAt: r.created_at,
  };
}

// Payload → insert row (id/status/created_at are defaulted by Postgres).
export function enquiryToInsertRow(p: EnquiryPayload) {
  return {
    name: p.name,
    email: p.email,
    phone: p.phone ?? null,
    notes: p.notes ?? null,
    check_in: p.checkIn,
    check_out: p.checkOut,
    nights: p.nights,
    total: p.total,
    items: p.items,
  };
}
