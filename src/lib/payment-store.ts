import "server-only";
import { getSupabase } from "./supabase";

// Persistence for deposits (ADR-0011). A checkout opens a `pending` payment; the
// verified ECPay callback settles it and advances the Enquiry's payment_status.

export interface PendingPayment {
  enquiryId: string;
  merchantTradeNo: string;
  amount: number;
}

export async function createPayment(p: PendingPayment): Promise<void> {
  const db = getSupabase();
  const { error } = await db.from("payments").insert({
    enquiry_id: p.enquiryId,
    merchant_trade_no: p.merchantTradeNo,
    amount: p.amount,
    status: "pending",
  });
  if (error) throw error;
  // Record the expected deposit on the Enquiry for the Vendor/customer views.
  const { error: upErr } = await db
    .from("enquiries")
    .update({ deposit_amount: p.amount })
    .eq("id", p.enquiryId);
  if (upErr) throw upErr;
}

export interface PaymentRecord {
  enquiryId: string | null;
  merchantTradeNo: string;
  amount: number;
  status: string;
}

export async function getPaymentByTradeNo(
  merchantTradeNo: string
): Promise<PaymentRecord | undefined> {
  const db = getSupabase();
  const { data, error } = await db
    .from("payments")
    .select("enquiry_id, merchant_trade_no, amount, status")
    .eq("merchant_trade_no", merchantTradeNo)
    .maybeSingle();
  if (error) throw error;
  if (!data) return undefined;
  return {
    enquiryId: data.enquiry_id as string | null,
    merchantTradeNo: data.merchant_trade_no as string,
    amount: data.amount as number,
    status: data.status as string,
  };
}

// Settle a verified, successful payment. Idempotent on the unique trade-no, and
// flips the linked Enquiry to deposit_paid so the dashboards reflect it.
export async function markPaymentPaid(
  merchantTradeNo: string,
  raw: unknown
): Promise<void> {
  const db = getSupabase();
  const { data, error } = await db
    .from("payments")
    .update({ status: "paid", paid_at: new Date().toISOString(), raw })
    .eq("merchant_trade_no", merchantTradeNo)
    .select("enquiry_id")
    .maybeSingle();
  if (error) throw error;
  const enquiryId = data?.enquiry_id as string | null | undefined;
  if (enquiryId) {
    const { error: upErr } = await db
      .from("enquiries")
      .update({ payment_status: "deposit_paid" })
      .eq("id", enquiryId);
    if (upErr) throw upErr;
  }
}

export async function markPaymentFailed(
  merchantTradeNo: string,
  raw: unknown
): Promise<void> {
  const db = getSupabase();
  const { error } = await db
    .from("payments")
    .update({ status: "failed", raw })
    .eq("merchant_trade_no", merchantTradeNo);
  if (error) throw error;
}
