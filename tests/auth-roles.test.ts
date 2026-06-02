import { describe, it, expect } from "vitest";
import { parseVendorAllowlist, isVendorEmail } from "@/lib/auth-roles";

describe("parseVendorAllowlist", () => {
  it("splits, trims, lowercases, and drops blanks", () => {
    expect(parseVendorAllowlist("A@x.com, b@y.com ,, ")).toEqual(["a@x.com", "b@y.com"]);
  });
  it("treats undefined/empty as no allowlist", () => {
    expect(parseVendorAllowlist(undefined)).toEqual([]);
    expect(parseVendorAllowlist("")).toEqual([]);
  });
});

describe("isVendorEmail", () => {
  const allow = ["owner@basecamp.co"];
  it("matches an allowlisted email case-insensitively", () => {
    expect(isVendorEmail("Owner@Basecamp.co", allow)).toBe(true);
  });
  it("rejects a non-allowlisted email", () => {
    expect(isVendorEmail("guest@gmail.com", allow)).toBe(false);
  });
  it("falls back to allowing anyone when the allowlist is empty", () => {
    expect(isVendorEmail("anyone@gmail.com", [])).toBe(true);
  });
});
