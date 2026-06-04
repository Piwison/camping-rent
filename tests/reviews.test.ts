import { describe, it, expect } from "vitest";
import {
  validateReviewInput,
  summarize,
  rowToReview,
  reviewInputToInsertRow,
  type ReviewInput,
  type ReviewRow,
} from "@/lib/reviews";

const good: ReviewInput = {
  targetType: "item",
  targetId: "tent-01",
  rating: 5,
  authorName: "Mei",
  body: "Beautiful tent.",
};

describe("validateReviewInput", () => {
  it("accepts a well-formed item review", () => {
    expect(validateReviewInput(good).valid).toBe(true);
  });

  it("requires a target id for item/bundle reviews", () => {
    const { valid, errors } = validateReviewInput({ ...good, targetId: undefined });
    expect(valid).toBe(false);
    expect(errors).toHaveProperty("targetId");
  });

  it("allows an experience review with no target id", () => {
    expect(
      validateReviewInput({ targetType: "experience", rating: 4, authorName: "Mei" }).valid
    ).toBe(true);
  });

  it("rejects an out-of-range or non-integer rating and a missing name", () => {
    expect(validateReviewInput({ ...good, rating: 6 }).errors).toHaveProperty("rating");
    expect(validateReviewInput({ ...good, rating: 3.5 }).errors).toHaveProperty("rating");
    expect(validateReviewInput({ ...good, authorName: "  " }).errors).toHaveProperty("authorName");
  });
});

describe("summarize", () => {
  it("returns zero for no reviews", () => {
    expect(summarize([])).toEqual({ average: 0, count: 0 });
  });

  it("averages to one decimal and counts", () => {
    expect(summarize([5, 4, 4])).toEqual({ average: 4.3, count: 3 });
    expect(summarize([5, 2])).toEqual({ average: 3.5, count: 2 });
  });
});

describe("mapping", () => {
  it("maps a row to a Review", () => {
    const row: ReviewRow = {
      id: "r1",
      user_id: "u1",
      author_name: "Mei",
      target_type: "bundle",
      target_id: "camp-set",
      rating: 5,
      title: "Perfect",
      body: "Loved it",
      created_at: "2026-06-02T00:00:00Z",
    };
    expect(rowToReview(row)).toMatchObject({
      id: "r1",
      authorName: "Mei",
      targetType: "bundle",
      targetId: "camp-set",
      rating: 5,
      title: "Perfect",
      body: "Loved it",
    });
  });

  it("nulls the target id for experience reviews and trims fields", () => {
    const row = reviewInputToInsertRow(
      { targetType: "experience", targetId: "ignored", rating: 4, authorName: "  Mei  ", body: " hi " },
      "u1"
    );
    expect(row.target_id).toBeNull();
    expect(row.author_name).toBe("Mei");
    expect(row.body).toBe("hi");
    expect(row.user_id).toBe("u1");
  });
});
