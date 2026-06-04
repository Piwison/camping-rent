import { NextResponse } from "next/server";
import { validateReviewInput, type ReviewInput } from "@/lib/reviews";
import { insertReview } from "@/lib/review-store";
import { isSupabaseConfigured } from "@/lib/supabase";
import { getCustomer } from "@/lib/customer-session";

// Submit a Review (ADR-0013). Any signed-in Customer may review; the reviewer's
// verified user id is attached server-side. Auto-published — no moderation step.
export async function POST(req: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Reviews require the datastore." }, { status: 503 });
  }

  const customer = await getCustomer();
  if (!customer) {
    return NextResponse.json({ error: "Please sign in to leave a review." }, { status: 401 });
  }

  let input: Partial<ReviewInput>;
  try {
    input = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { valid, errors } = validateReviewInput(input);
  if (!valid) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  try {
    await insertReview(input as ReviewInput, customer.id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[reviews] Failed to store review", err);
    return NextResponse.json({ error: "Failed to save your review." }, { status: 502 });
  }
}
