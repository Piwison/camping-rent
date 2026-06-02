import crypto from "node:crypto";

// ECPay (綠界) CheckMacValue — the integrity hash on every AIO request and
// callback (ADR-0011). Pure logic, no network, so it's unit-tested against a
// fixed vector. The fiddly part is ECPay's .NET-style URL encoding; we mirror
// it exactly or the gateway rejects the order.

export type MacParams = Record<string, string | number | undefined>;

// encodeURIComponent, adjusted to match .NET HttpUtility.UrlEncode as ECPay
// expects: space→"+", apostrophe→"%27"; -_.!~*() stay literal (already raw in
// encodeURIComponent). The whole string is lower-cased afterwards.
function ecpayEncode(s: string): string {
  return encodeURIComponent(s).replace(/%20/g, "+").replace(/'/g, "%27");
}

// The exact string that gets hashed: HashKey + sorted params + HashIV, encoded
// and lower-cased. Exposed for tests so the encoding is pinned, not just the
// final digest.
export function ecpayCanonical(params: MacParams, hashKey: string, hashIV: string): string {
  const keys = Object.keys(params)
    .filter((k) => k !== "CheckMacValue" && params[k] !== undefined && params[k] !== "")
    .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

  let raw = `HashKey=${hashKey}`;
  for (const k of keys) raw += `&${k}=${params[k]}`;
  raw += `&HashIV=${hashIV}`;

  return ecpayEncode(raw).toLowerCase();
}

export function ecpayCheckMacValue(params: MacParams, hashKey: string, hashIV: string): string {
  return crypto
    .createHash("sha256")
    .update(ecpayCanonical(params, hashKey, hashIV))
    .digest("hex")
    .toUpperCase();
}

// Verify a callback: recompute the MAC over every field except CheckMacValue
// and compare. Rejects tampered or unsigned payloads.
export function verifyEcpayCheckMacValue(
  params: MacParams,
  hashKey: string,
  hashIV: string
): boolean {
  const provided = params.CheckMacValue;
  if (typeof provided !== "string" || provided.length === 0) return false;
  return provided.toUpperCase() === ecpayCheckMacValue(params, hashKey, hashIV);
}
