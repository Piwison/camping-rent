import { describe, it, expect } from "vitest";
import { isProtectedAdminPath } from "@/lib/admin-paths";
import { isProtectedAccountPath } from "@/lib/account-paths";

describe("isProtectedAdminPath", () => {
  it("protects admin pages", () => {
    expect(isProtectedAdminPath("/admin")).toBe(true);
    expect(isProtectedAdminPath("/admin/catalog")).toBe(true);
    expect(isProtectedAdminPath("/admin/enquiries")).toBe(true);
  });

  it("leaves the login page public", () => {
    expect(isProtectedAdminPath("/admin/login")).toBe(false);
  });

  it("ignores non-admin paths", () => {
    expect(isProtectedAdminPath("/")).toBe(false);
    expect(isProtectedAdminPath("/gear")).toBe(false);
  });
});

describe("isProtectedAccountPath", () => {
  it("protects the account area", () => {
    expect(isProtectedAccountPath("/account")).toBe(true);
    expect(isProtectedAccountPath("/account/bookings")).toBe(true);
  });

  it("leaves the login page public", () => {
    expect(isProtectedAccountPath("/account/login")).toBe(false);
  });

  it("ignores non-account paths", () => {
    expect(isProtectedAccountPath("/gear")).toBe(false);
  });
});
