import { Resend } from "resend";
import type { ReminderKind } from "./cron-plan";

const DAYS_BY_KIND: Record<ReminderKind, number> = {
  "3-day": 3,
  "1-day": 1,
};

export async function sendReminderEmail(input: {
  to: string;
  activityName: string;
  deadline: string;
  kind: ReminderKind;
}): Promise<void> {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const days = DAYS_BY_KIND[input.kind];

  await resend.emails.send({
    from: "CancelWatch <reminders@cancelwatch.app>",
    to: input.to,
    subject: `Cancel-by deadline for ${input.activityName} in ${days} day${days === 1 ? "" : "s"}`,
    text: `Your cancellation deadline for ${input.activityName} is ${input.deadline}. Cancel before then to avoid being charged for the next cycle.`,
  });
}
