import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase";
import { listBookingsDueForReminder, markEnquiryReminded } from "@/lib/enquiry-store";
import { notifyWeekendReminder } from "@/lib/notify";

// Pre-trip reminder sweep (ADR-0012). Meant to be hit on a schedule (e.g. a
// daily Vercel Cron). Guarded by CRON_SECRET — passed as `Authorization:
// Bearer <secret>` or `?secret=`. Idempotent: each booking is marked reminded
// only after a successful send, so reruns and missing-credentials are safe.
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "CRON_SECRET not set." }, { status: 503 });
  }

  const auth = req.headers.get("authorization");
  const provided =
    auth?.replace(/^Bearer\s+/i, "") ?? new URL(req.url).searchParams.get("secret") ?? "";
  if (provided !== secret) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Datastore not configured." }, { status: 503 });
  }

  const within = Number(process.env.REMINDER_WITHIN_DAYS ?? "2");
  const due = await listBookingsDueForReminder(Number.isFinite(within) ? within : 2);

  let sent = 0;
  for (const booking of due) {
    const result = await notifyWeekendReminder(booking);
    if (result.status === "sent") {
      await markEnquiryReminded(booking.id);
      sent++;
    }
  }

  return NextResponse.json({ checked: due.length, sent });
}
