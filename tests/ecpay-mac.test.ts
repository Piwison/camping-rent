import { describe, it, expect } from "vitest";
import { createHash } from "node:crypto";
import {
  ecpayCanonical,
  ecpayCheckMacValue,
  verifyEcpayCheckMacValue,
} from "@/lib/ecpay-mac";

// Fixed vector mirroring ECPay's AIO example shape (ASCII only, so the canonical
// string is fully predictable and the .NET-style encoding is pinned exactly).
const HASH_KEY = "5294y06JbISpM5x9";
const HASH_IV = "v77hoKGq4kWxNNIS";
const params = {
  MerchantID: "2000132",
  MerchantTradeNo: "Test1234567",
  MerchantTradeDate: "2013/03/12 15:30:23",
  PaymentType: "aio",
  TotalAmount: 1000,
  TradeDesc: "Basecamp deposit",
  ItemName: "Camp Set",
  ReturnURL: "https://basecamp.tw/api/payment/ecpay/callback",
  ChoosePayment: "ALL",
};

describe("ecpayCanonical", () => {
  it("sorts params, wraps with HashKey/HashIV, and applies ECPay url-encoding", () => {
    const canonical = ecpayCanonical(params, HASH_KEY, HASH_IV);

    // Built by hand from the documented algorithm: alpha-sorted keys, spaces as
    // "+", "/" and ":" percent-encoded, whole string lower-cased.
    const expected = (
      `HashKey=${HASH_KEY}` +
      "&ChoosePayment=ALL" +
      "&ItemName=Camp Set" +
      "&MerchantID=2000132" +
      "&MerchantTradeDate=2013/03/12 15:30:23" +
      "&MerchantTradeNo=Test1234567" +
      "&PaymentType=aio" +
      "&ReturnURL=https://basecamp.tw/api/payment/ecpay/callback" +
      "&TotalAmount=1000" +
      "&TradeDesc=Basecamp deposit" +
      `&HashIV=${HASH_IV}`
    )
      .replace(/%20/g, "+") // no-op; clarity
      .split("")
      .join("");

    // Encode the same way the implementation should, independently, to assert
    // the transform rather than hard-coding an opaque blob.
    const handEncoded = encodeURIComponent(expected)
      .replace(/%20/g, "+")
      .replace(/'/g, "%27")
      .toLowerCase();

    expect(canonical).toBe(handEncoded);
  });
});

describe("ecpayCheckMacValue", () => {
  it("is the uppercase SHA-256 of the canonical string", () => {
    const expected = createHash("sha256")
      .update(ecpayCanonical(params, HASH_KEY, HASH_IV))
      .digest("hex")
      .toUpperCase();
    const mac = ecpayCheckMacValue(params, HASH_KEY, HASH_IV);
    expect(mac).toBe(expected);
    expect(mac).toMatch(/^[0-9A-F]{64}$/);
  });

  it("is deterministic and order-independent", () => {
    const reordered = {
      ChoosePayment: "ALL",
      ItemName: "Camp Set",
      MerchantID: "2000132",
      MerchantTradeNo: "Test1234567",
      MerchantTradeDate: "2013/03/12 15:30:23",
      PaymentType: "aio",
      ReturnURL: "https://basecamp.tw/api/payment/ecpay/callback",
      TotalAmount: 1000,
      TradeDesc: "Basecamp deposit",
    };
    expect(ecpayCheckMacValue(reordered, HASH_KEY, HASH_IV)).toBe(
      ecpayCheckMacValue(params, HASH_KEY, HASH_IV)
    );
  });
});

describe("verifyEcpayCheckMacValue", () => {
  it("accepts a correctly-signed payload and rejects a tampered one", () => {
    const mac = ecpayCheckMacValue(params, HASH_KEY, HASH_IV);
    expect(verifyEcpayCheckMacValue({ ...params, CheckMacValue: mac }, HASH_KEY, HASH_IV)).toBe(
      true
    );
    expect(
      verifyEcpayCheckMacValue(
        { ...params, TotalAmount: 1, CheckMacValue: mac },
        HASH_KEY,
        HASH_IV
      )
    ).toBe(false);
  });

  it("rejects a payload with no CheckMacValue", () => {
    expect(verifyEcpayCheckMacValue(params, HASH_KEY, HASH_IV)).toBe(false);
  });
});
