import { describe, expect, test } from "vitest";
import { generateToken } from "./token";

describe("generateToken", () => {
  test("returns a url-safe string of at least 20 characters", () => {
    const token = generateToken();

    expect(token.length).toBeGreaterThanOrEqual(20);
    expect(token).toMatch(/^[A-Za-z0-9_-]+$/);
  });

  test("returns a different value on each call", () => {
    const a = generateToken();
    const b = generateToken();

    expect(a).not.toBe(b);
  });
});
