export interface EnquiryItem {
  name: string;
  type: "item" | "bundle";
  quantity: number;
  unitPrice: number;
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
