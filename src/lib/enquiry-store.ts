import { getSupabase } from "./supabase";
import {
  rowToEnquiry,
  enquiryToInsertRow,
  type EnquiryPayload,
  type EnquiryRecord,
  type EnquiryStatus,
  type EnquiryRow,
} from "./enquiry";

// Postgres persistence for Enquiries (ADR-0007). The insert backs the
// deliverEnquiry sink; the reads/updates back the Vendor inbox.

export async function insertEnquiry(
  payload: EnquiryPayload,
  userId?: string | null
): Promise<string> {
  const db = getSupabase();
  const { data, error } = await db
    .from("enquiries")
    .insert(enquiryToInsertRow(payload, userId))
    .select("id")
    .single();
  if (error) throw error;
  return data.id as string;
}

// A Customer's own bookings, newest first (ADR-0010).
export async function listEnquiriesForUser(userId: string): Promise<EnquiryRecord[]> {
  const db = getSupabase();
  const { data, error } = await db
    .from("enquiries")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as EnquiryRow[]).map(rowToEnquiry);
}

export async function listEnquiries(): Promise<EnquiryRecord[]> {
  const db = getSupabase();
  const { data, error } = await db
    .from("enquiries")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as EnquiryRow[]).map(rowToEnquiry);
}

export async function getEnquiry(id: string): Promise<EnquiryRecord | undefined> {
  const db = getSupabase();
  const { data, error } = await db.from("enquiries").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data ? rowToEnquiry(data as EnquiryRow) : undefined;
}

export async function setEnquiryStatus(id: string, status: EnquiryStatus): Promise<void> {
  const db = getSupabase();
  const { error } = await db.from("enquiries").update({ status }).eq("id", id);
  if (error) throw error;
}
