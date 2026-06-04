import "server-only";
import { getSupabase, isSupabaseConfigured } from "./supabase";
import {
  rowToReview,
  reviewInputToInsertRow,
  summarize,
  type Review,
  type ReviewInput,
  type ReviewRow,
  type ReviewSummary,
  type ReviewTarget,
} from "./reviews";

// Persistence for Reviews (ADR-0013). Storefront reads run server-side with the
// service-role key (RLS is deny-all). Without Supabase configured, reads return
// empty so the storefront renders unchanged in local dev.

const EMPTY_SUMMARY: ReviewSummary = { average: 0, count: 0 };

export async function insertReview(input: ReviewInput, userId: string | null): Promise<void> {
  const db = getSupabase();
  const { error } = await db.from("reviews").insert(reviewInputToInsertRow(input, userId));
  if (error) throw error;
}

export async function listReviewsForTarget(
  targetType: Exclude<ReviewTarget, "experience">,
  targetId: string,
  limit = 50
): Promise<Review[]> {
  if (!isSupabaseConfigured()) return [];
  const db = getSupabase();
  const { data, error } = await db
    .from("reviews")
    .select("*")
    .eq("target_type", targetType)
    .eq("target_id", targetId)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data as ReviewRow[]).map(rowToReview);
}

export async function listExperienceReviews(limit = 12): Promise<Review[]> {
  if (!isSupabaseConfigured()) return [];
  const db = getSupabase();
  const { data, error } = await db
    .from("reviews")
    .select("*")
    .eq("target_type", "experience")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data as ReviewRow[]).map(rowToReview);
}

export async function summaryForTarget(
  targetType: Exclude<ReviewTarget, "experience">,
  targetId: string
): Promise<ReviewSummary> {
  if (!isSupabaseConfigured()) return EMPTY_SUMMARY;
  const db = getSupabase();
  const { data, error } = await db
    .from("reviews")
    .select("rating")
    .eq("target_type", targetType)
    .eq("target_id", targetId);
  if (error) throw error;
  return summarize((data ?? []).map((r) => r.rating as number));
}
