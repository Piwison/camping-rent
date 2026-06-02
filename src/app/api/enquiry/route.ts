import { NextResponse } from "next/server";
import { validateEnquiry, type EnquiryPayload } from "@/lib/enquiry";
import { deliverEnquiry } from "@/lib/enquiry-sink";
import { getCustomer } from "@/lib/customer-session";

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

  // Attach the signed-in Customer (if any) so the booking shows in their
  // history; guests submit with no user_id.
  const customer = await getCustomer();
  const result = await deliverEnquiry(payload as EnquiryPayload, customer?.id);
  if (result.status === "error") {
    return NextResponse.json({ error: result.message }, { status: 502 });
  }
  if (result.status === "unavailable") {
    return NextResponse.json(
      {
        error: `Some gear is no longer available for those dates: ${result.items.join(", ")}.`,
        unavailable: result.items,
      },
      { status: 409 }
    );
  }

  return NextResponse.json({ ok: true, delivered: result.status });
}
