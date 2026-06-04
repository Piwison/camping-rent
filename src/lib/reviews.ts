// Reviews domain (Phase 4, ADR-0013). Pure types, validation, summary maths,
// and row mapping — no React, no datastore — so it's unit-tested and the store
// layer is just "query + map".

export const REVIEW_TARGETS = ["item", "bundle", "experience"] as const;
export type ReviewTarget = (typeof REVIEW_TARGETS)[number];

export function isReviewTarget(s: string): s is ReviewTarget {
  return (REVIEW_TARGETS as readonly string[]).includes(s);
}

// What a reviewer submits.
export interface ReviewInput {
  targetType: ReviewTarget;
  targetId?: string | null; // required unless an 'experience' review
  rating: number; // 1–5
  authorName: string;
  title?: string;
  body?: string;
}

// A stored Review.
export interface Review {
  id: string;
  authorName: string;
  targetType: ReviewTarget;
  targetId: string | null;
  rating: number;
  title?: string;
  body?: string;
  createdAt: string;
}

// Postgres row shape (snake_case).
export interface ReviewRow {
  id: string;
  user_id: string | null;
  author_name: string;
  target_type: ReviewTarget;
  target_id: string | null;
  rating: number;
  title: string | null;
  body: string | null;
  created_at: string;
}

export interface ReviewSummary {
  average: number; // one decimal, 0 when no reviews
  count: number;
}

const MAX_BODY = 2000;

export function validateReviewInput(input: Partial<ReviewInput>): {
  valid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (!input.targetType || !isReviewTarget(input.targetType)) {
    errors.targetType = "Unknown review target.";
  } else if (input.targetType !== "experience" && !input.targetId) {
    errors.targetId = "Missing the item or bundle being reviewed.";
  }

  if (!Number.isInteger(input.rating) || (input.rating ?? 0) < 1 || (input.rating ?? 0) > 5) {
    errors.rating = "Pick a rating from 1 to 5 stars.";
  }
  if (!input.authorName?.trim()) errors.authorName = "Your name is required.";
  if (input.body && input.body.length > MAX_BODY)
    errors.body = `Keep your note under ${MAX_BODY} characters.`;

  return { valid: Object.keys(errors).length === 0, errors };
}

// Average (one decimal) + count over a set of ratings.
export function summarize(ratings: number[]): ReviewSummary {
  if (ratings.length === 0) return { average: 0, count: 0 };
  const sum = ratings.reduce((a, r) => a + r, 0);
  return { average: Math.round((sum / ratings.length) * 10) / 10, count: ratings.length };
}

export function rowToReview(r: ReviewRow): Review {
  return {
    id: r.id,
    authorName: r.author_name,
    targetType: r.target_type,
    targetId: r.target_id,
    rating: r.rating,
    title: r.title ?? undefined,
    body: r.body ?? undefined,
    createdAt: r.created_at,
  };
}

export function reviewInputToInsertRow(input: ReviewInput, userId: string | null) {
  return {
    user_id: userId,
    author_name: input.authorName.trim(),
    target_type: input.targetType,
    target_id: input.targetType === "experience" ? null : (input.targetId ?? null),
    rating: input.rating,
    title: input.title?.trim() || null,
    body: input.body?.trim() || null,
  };
}
