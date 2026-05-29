import { describe, it, expect } from "vitest";
import { isProtectedAdminPath } from "@/lib/admin-paths";

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
