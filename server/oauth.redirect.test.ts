import { describe, expect, it } from "vitest";
import { getSafePostLoginPath } from "./_core/oauth";

describe("OAuth post-login destination allowlist", () => {
  it("returns users to approved application routes", () => {
    expect(getSafePostLoginPath("/portal")).toBe("/portal");
    expect(getSafePostLoginPath("/admin/notices")).toBe("/admin/notices");
    expect(getSafePostLoginPath("/")).toBe("/");
  });

  it("rejects external, protocol-relative, modified, and missing destinations", () => {
    expect(getSafePostLoginPath("https://example.com/portal")).toBe("/");
    expect(getSafePostLoginPath("//example.com/portal")).toBe("/");
    expect(getSafePostLoginPath("/portal?next=https://example.com")).toBe("/");
    expect(getSafePostLoginPath(undefined)).toBe("/");
  });
});
