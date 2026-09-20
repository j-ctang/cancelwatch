import { describe, expect, test } from "vitest";
import { computeNextDeadline, rollDeadlineForward } from "./deadline";

describe("computeNextDeadline", () => {
  test("subtracts notice days from the first cycle end", () => {
    const deadline = computeNextDeadline({
      startDate: "2026-01-01",
      cycleDays: 30,
      noticeDays: 28,
    });

    // cycle end = 2026-01-31, minus 28 days = 2026-01-03
    expect(deadline).toBe("2026-01-03");
  });

  test("handles an annual cycle", () => {
    const deadline = computeNextDeadline({
      startDate: "2026-01-01",
      cycleDays: 365,
      noticeDays: 28,
    });

    // cycle end = 2027-01-01, minus 28 days = 2026-12-04
    expect(deadline).toBe("2026-12-04");
  });
});

describe("rollDeadlineForward", () => {
  test("advances the deadline by one cycle length", () => {
    const rolled = rollDeadlineForward({
      currentDeadline: "2026-01-03",
      cycleDays: 30,
    });

    expect(rolled).toBe("2026-02-02");
  });
});
