import { ecpayConfig } from "./payment-config";
import { ecpayCheckMacValue, verifyEcpayCheckMacValue, type MacParams } from "./ecpay-mac";

// The payment seam (ADR-0011): a provider-agnostic boundary the app builds
// checkouts and verifies callbacks through. ECPay is the private adapter behind
// it — swapping providers later means re-implementing these two functions, not
// touching the routes.

export interface CheckoutOrder {
  merchantTradeNo: string; // our unique order ref (≤20 alphanumeric)
  amount: number; // integer TWD to charge (the deposit)
  itemName: string;
  tradeDesc: string;
  returnUrl: string; // server-to-server result callback
  clientBackUrl: string; // where the shopper lands afterwards
}

// An auto-submittable gateway form: POST `fields` to `action`.
export interface CheckoutForm {
  action: string;
  fields: Record<string, string>;
}

function ecpayTradeDate(d: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}/${p(d.getMonth() + 1)}/${p(d.getDate())} ${p(d.getHours())}:${p(
    d.getMinutes()
  )}:${p(d.getSeconds())}`;
}

export function buildCheckout(order: CheckoutOrder): CheckoutForm {
  const cfg = ecpayConfig();
  const fields: Record<string, string> = {
    MerchantID: cfg.merchantId,
    MerchantTradeNo: order.merchantTradeNo,
    MerchantTradeDate: ecpayTradeDate(new Date()),
    PaymentType: "aio",
    TotalAmount: String(Math.round(order.amount)),
    TradeDesc: order.tradeDesc,
    ItemName: order.itemName,
    ReturnURL: order.returnUrl,
    ClientBackURL: order.clientBackUrl,
    ChoosePayment: "ALL",
    EncryptType: "1",
  };
  fields.CheckMacValue = ecpayCheckMacValue(fields, cfg.hashKey, cfg.hashIV);
  return { action: cfg.endpoint, fields };
}

export interface CallbackResult {
  verified: boolean;
  paid: boolean;
  merchantTradeNo: string;
  amount: number;
}

// Validate and interpret a gateway callback. `verified` is the signature check;
// `paid` additionally requires ECPay's success code (RtnCode === "1").
export function verifyCallback(params: MacParams): CallbackResult {
  const cfg = ecpayConfig();
  const verified = verifyEcpayCheckMacValue(params, cfg.hashKey, cfg.hashIV);
  return {
    verified,
    paid: verified && String(params.RtnCode) === "1",
    merchantTradeNo: String(params.MerchantTradeNo ?? ""),
    amount: Number(params.TradeAmt ?? params.TotalAmount ?? 0),
  };
}

// A unique ECPay MerchantTradeNo: ≤20 chars, alphanumeric.
export function newMerchantTradeNo(prefix = "BC"): string {
  const stamp = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 6);
  return `${prefix}${stamp}${rand}`.slice(0, 20).toUpperCase();
}
