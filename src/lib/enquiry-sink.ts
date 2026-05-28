import "server-only";
import type { EnquiryPayload } from "./enquiry";
import { formatEnquiryItems } from "./enquiry";

export type EnquiryResult =
  | { status: "sent" }
  | { status: "skipped" } // no provider configured — logged for local dev
  | { status: "error"; message: string };

// The Enquiry sink seam: where a submitted Enquiry goes. Today the only adapter
// is Notion; without its env vars the Enquiry is logged and reported `skipped`
// so the booking flow stays usable in local dev (ADR-0003).
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

  return postToNotion(payload, token, databaseId);
}

const NOTION_PAGES_URL = "https://api.notion.com/v1/pages";
const NOTION_VERSION = "2022-06-28";

// Notion adapter — writes the Enquiry as a row in the Notion "Enquiries"
// database. Private to this module; callers use deliverEnquiry.
async function postToNotion(
  payload: EnquiryPayload,
  token: string,
  databaseId: string
): Promise<EnquiryResult> {
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
