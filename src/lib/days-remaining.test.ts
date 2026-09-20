import { describe, expect, test } from "vitest";
import { daysRemaining } from "./days-remaining";

describe("daysRemaining", () => {
  test("counts whole days between today and a future deadline", () => {
    expect(daysRemaining("2026-01-10", "2026-01-01")).toBe(9);
  });

  test("returns 0 for a deadline that is today", () => {
    expect(daysRemaining("2026-01-01", "2026-01-01")).toBe(0);
  });

  test("returns a negative number for a deadline already passed", () => {
    expect(daysRemaining("2026-01-01", "2026-01-05")).toBe(-4);
  });
});
