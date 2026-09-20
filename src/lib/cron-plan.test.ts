import { describe, expect, test } from "vitest";
import { planCronActions } from "./cron-plan";

const TODAY = "2026-01-10";

function row(overrides: Partial<Parameters<typeof planCronActions>[0][number]> = {}) {
  return {
    id: "row-1",
    email: "parent@example.com",
    activityName: "Emma's gymnastics",
    nextDeadline: "2026-01-20",
    cycleDays: 30,
    canceledAt: null,
    ...overrides,
  };
}

describe("planCronActions", () => {
  test("sends a 3-day reminder when the deadline is 3 days out, carrying the full row", () => {
    const input = row({ nextDeadline: "2026-01-13" });
    const plan = planCronActions([input], TODAY);

    expect(plan.reminders).toEqual([{ row: input, kind: "3-day" }]);
    expect(plan.rollovers).toEqual([]);
  });

  test("sends a 1-day reminder when the deadline is 1 day out", () => {
    const input = row({ nextDeadline: "2026-01-11" });
    const plan = planCronActions([input], TODAY);

    expect(plan.reminders).toEqual([{ row: input, kind: "1-day" }]);
  });

  test("does nothing when the deadline is neither 3 nor 1 days out", () => {
    const plan = planCronActions([row({ nextDeadline: "2026-01-15" })], TODAY);

    expect(plan.reminders).toEqual([]);
    expect(plan.rollovers).toEqual([]);
  });

  test("rolls the deadline forward by one cycle once it has passed uncanceled", () => {
    const plan = planCronActions(
      [row({ nextDeadline: "2026-01-05", cycleDays: 30 })],
      TODAY
    );

    expect(plan.rollovers).toEqual([{ id: "row-1", newDeadline: "2026-02-04" }]);
    expect(plan.reminders).toEqual([]);
  });

  test("ignores canceled memberships entirely", () => {
    const plan = planCronActions(
      [row({ nextDeadline: "2026-01-13", canceledAt: "2026-01-01T00:00:00Z" })],
      TODAY
    );

    expect(plan.reminders).toEqual([]);
    expect(plan.rollovers).toEqual([]);
  });

  test("handles multiple rows independently", () => {
    const a = row({ id: "a", nextDeadline: "2026-01-13" });
    const b = row({ id: "b", nextDeadline: "2026-01-05", cycleDays: 30 });
    const c = row({ id: "c", nextDeadline: "2026-01-15" });
    const plan = planCronActions([a, b, c], TODAY);

    expect(plan.reminders).toEqual([{ row: a, kind: "3-day" }]);
    expect(plan.rollovers).toEqual([{ id: "b", newDeadline: "2026-02-04" }]);
  });
});
