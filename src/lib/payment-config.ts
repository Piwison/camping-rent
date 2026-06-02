// ECPay (綠界) configuration (ADR-0011). Falls back to ECPay's public *sandbox*
// test merchant when nothing is set, so deposits are exercisable end-to-end
// without real credentials. Real money only flows when ECPAY_MODE=production
// and the live merchant keys are provided.

export interface EcpayConfig {
  merchantId: string;
  hashKey: string;
  hashIV: string;
  endpoint: string;
  testMode: boolean;
  depositPercent: number;
}

// ECPay's documented stage/sandbox test merchant.
const SANDBOX = {
  merchantId: "2000132",
  hashKey: "5294y06JbISpM5x9",
  hashIV: "v77hoKGq4kWxNNIS",
};

const ENDPOINTS = {
  sandbox: "https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5",
  production: "https://payment.ecpay.com.tw/Cashier/AioCheckOut/V5",
};

export function ecpayConfig(): EcpayConfig {
  const production = process.env.ECPAY_MODE === "production";
  // NEXT_PUBLIC_ so the booking UI can show the same deposit it will charge.
  const depositPercent = Number(process.env.NEXT_PUBLIC_DEPOSIT_PERCENT ?? "30");
  return {
    merchantId: process.env.ECPAY_MERCHANT_ID ?? SANDBOX.merchantId,
    hashKey: process.env.ECPAY_HASH_KEY ?? SANDBOX.hashKey,
    hashIV: process.env.ECPAY_HASH_IV ?? SANDBOX.hashIV,
    endpoint: production ? ENDPOINTS.production : ENDPOINTS.sandbox,
    testMode: !production,
    depositPercent: Number.isFinite(depositPercent) ? depositPercent : 30,
  };
}

// Payment is always available (sandbox fallback); this reports whether we're
// charging real money so the UI can label test mode and routes can refuse to
// pretend in production without real keys.
export function isLivePayment(): boolean {
  return (
    process.env.ECPAY_MODE === "production" &&
    Boolean(process.env.ECPAY_MERCHANT_ID && process.env.ECPAY_HASH_KEY && process.env.ECPAY_HASH_IV)
  );
}
