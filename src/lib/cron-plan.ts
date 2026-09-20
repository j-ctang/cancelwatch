import { daysRemaining } from "./days-remaining";
import { rollDeadlineForward } from "./deadline";

export type CronRow = {
  id: string;
  nextDeadline: string;
  cycleDays: number;
  canceledAt: string | null;
};

export type ReminderKind = "3-day" | "1-day";

export type CronPlan<T extends CronRow> = {
  reminders: { row: T; kind: ReminderKind }[];
  rollovers: { id: string; newDeadline: string }[];
};

export function planCronActions<T extends CronRow>(rows: T[], today: string): CronPlan<T> {
  const plan: CronPlan<T> = { reminders: [], rollovers: [] };

  for (const row of rows) {
    if (row.canceledAt) continue;

    const remaining = daysRemaining(row.nextDeadline, today);

    if (remaining === 3) {
      plan.reminders.push({ row, kind: "3-day" });
    } else if (remaining === 1) {
      plan.reminders.push({ row, kind: "1-day" });
    } else if (remaining < 0) {
      plan.rollovers.push({
        id: row.id,
        newDeadline: rollDeadlineForward({
          currentDeadline: row.nextDeadline,
          cycleDays: row.cycleDays,
        }),
      });
    }
  }

  return plan;
}
