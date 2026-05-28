import "server-only";
import type { EnquiryPayload } from "./enquiry";
import { formatEnquiryItems } from "./enquiry";

const NOTION_PAGES_URL = "https://api.notion.com/v1/pages";
const NOTION_VERSION = "2022-06-28";

export type EnquiryResult =
  | { status: "sent" }
  | { status: "skipped" } // no provider configured — logged for local dev
  | { status: "error"; message: string };

// Writes an enquiry as a new row in the Notion "Enquiries" database. When the
// Notion env vars are absent (e.g. local dev) the enquiry is logged instead so
// the booking flow stays testable without credentials.
export async function deliverEnquiry(
  payload: EnquiryPayload
): Promise<EnquiryResult> {
  const token = process.env.NOTION_TOKEN;
  const databaseId = process.env.NOTION_ENQUIRIES_DB_ID;

  if (!token || !databaseId) {
    console.info("[enquiry] NOTION_TOKEN/NOTION_ENQUIRIES_DB_ID not set — logging enquiry:", {
      name: payload.name,
      email: payload.email,
      checkIn: payload.checkIn,
      checkOut: payload.checkOut,
      total: payload.total,
      items: formatEnquiryItems(payload.items),
    });
    return { status: "skipped" };
  }

  const body = {
    parent: { database_id: databaseId },
    properties: {
      Name: { title: [{ text: { content: payload.name } }] },
      Status: { select: { name: "New" } },
      Email: { email: payload.email },
      Phone: { phone_number: payload.phone || null },
      "Check-in": { date: { start: payload.checkIn } },
      "Check-out": { date: { start: payload.checkOut } },
      Nights: { number: payload.nights },
      Items: { rich_text: [{ text: { content: formatEnquiryItems(payload.items) } }] },
      "Total (NT$)": { number: payload.total },
      Notes: {
        rich_text: payload.notes ? [{ text: { content: payload.notes } }] : [],
      },
    },
  };

  try {
    const res = await fetch(NOTION_PAGES_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Notion-Version": NOTION_VERSION,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error("[enquiry] Notion API error", res.status, detail);
      return { status: "error", message: `Notion responded ${res.status}` };
    }
    return { status: "sent" };
  } catch (err) {
    console.error("[enquiry] Notion request failed", err);
    return { status: "error", message: "Failed to reach Notion." };
  }
}
