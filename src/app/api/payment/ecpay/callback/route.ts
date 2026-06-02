import { verifyCallback } from "@/lib/payment";
import { markPaymentPaid, markPaymentFailed } from "@/lib/payment-store";
import type { MacParams } from "@/lib/ecpay-mac";

// ECPay's server-to-server result notification (ADR-0011). ECPay POSTs the
// payment outcome here as form-encoded fields with a CheckMacValue; we verify
// the signature before trusting it, settle the payment, and must reply exactly
// "1|OK" or ECPay keeps retrying.
export async function POST(req: Request) {
  const form = await req.formData();
  const params: MacParams = {};
  for (const [k, v] of form.entries()) params[k] = String(v);

  const result = verifyCallback(params);
  if (!result.verified) {
    // Bad signature — do not act on it.
    return new Response("0|CheckMacValue", { status: 400 });
  }

  try {
    if (result.paid) {
      await markPaymentPaid(result.merchantTradeNo, params);
    } else {
      await markPaymentFailed(result.merchantTradeNo, params);
    }
  } catch {
    // Ask ECPay to retry on a transient store failure.
    return new Response("0|Retry", { status: 500 });
  }

  return new Response("1|OK", { headers: { "content-type": "text/plain" } });
}
