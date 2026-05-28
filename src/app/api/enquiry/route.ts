import { NextResponse } from "next/server";
import { validateEnquiry, type EnquiryPayload } from "@/lib/enquiry";
import { deliverEnquiry } from "@/lib/enquiry-sink";

export async function POST(req: Request) {
  let payload: Partial<EnquiryPayload>;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { valid, errors } = validateEnquiry(payload);
  if (!valid) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  const result = await deliverEnquiry(payload as EnquiryPayload);
  if (result.status === "error") {
    return NextResponse.json({ error: result.message }, { status: 502 });
  }

  return NextResponse.json({ ok: true, delivered: result.status });
}
