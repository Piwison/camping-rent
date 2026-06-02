import { NextResponse } from "next/server";
import { getEnquiry } from "@/lib/enquiry-store";
import { isSupabaseConfigured } from "@/lib/supabase";
import { depositFor } from "@/lib/pricing";
import { ecpayConfig } from "@/lib/payment-config";
import { buildCheckout, newMerchantTradeNo } from "@/lib/payment";
import { createPayment } from "@/lib/payment-store";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// Opens an ECPay deposit checkout for an Enquiry (ADR-0011). Returns a tiny
// auto-submitting HTML form that POSTs the signed order to ECPay — the standard
// redirect technique — so this must be reached by a full-page navigation.
export async function POST(req: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Payments require the datastore." }, { status: 503 });
  }

  const form = await req.formData();
  const enquiryId = String(form.get("enquiryId") ?? "");
  if (!enquiryId) {
    return NextResponse.json({ error: "Missing enquiryId." }, { status: 400 });
  }

  const enquiry = await getEnquiry(enquiryId);
  if (!enquiry) {
    return NextResponse.json({ error: "Unknown enquiry." }, { status: 404 });
  }

  const cfg = ecpayConfig();
  const amount = depositFor(enquiry.total, cfg.depositPercent);
  const origin = new URL(req.url).origin;

  if (amount <= 0) {
    return NextResponse.redirect(new URL("/booking/paid", origin), 303);
  }

  const merchantTradeNo = newMerchantTradeNo();
  await createPayment({ enquiryId, merchantTradeNo, amount });

  const { action, fields } = buildCheckout({
    merchantTradeNo,
    amount,
    itemName: "Basecamp & Co. booking deposit",
    tradeDesc: "Basecamp deposit",
    returnUrl: `${origin}/api/payment/ecpay/callback`,
    clientBackUrl: `${origin}/booking/paid`,
  });

  const inputs = Object.entries(fields)
    .map(([k, v]) => `<input type="hidden" name="${esc(k)}" value="${esc(v)}" />`)
    .join("");

  const html = `<!doctype html><html><head><meta charset="utf-8"><title>Redirecting to payment…</title></head><body onload="document.forms[0].submit()"><p style="font-family:sans-serif;color:#5C5850">Redirecting to secure payment…</p><form method="post" action="${esc(action)}">${inputs}</form></body></html>`;

  return new NextResponse(html, {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}
