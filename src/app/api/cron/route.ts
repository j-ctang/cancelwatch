import { NextRequest, NextResponse } from "next/server";
import { planCronActions } from "@/lib/cron-plan";
import { listActiveMemberships, applyRollover } from "@/lib/memberships-repo";
import { sendReminderEmail } from "@/lib/send-reminder-email";

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await listActiveMemberships();
  const today = new Date().toISOString().slice(0, 10);
  const plan = planCronActions(rows, today);

  await Promise.all(
    plan.reminders.map((reminder) =>
      sendReminderEmail({
        to: reminder.row.email,
        activityName: reminder.row.activityName,
        deadline: reminder.row.nextDeadline,
        kind: reminder.kind,
      })
    )
  );

  await Promise.all(
    plan.rollovers.map((rollover) => applyRollover(rollover.id, rollover.newDeadline))
  );

  return NextResponse.json({
    remindersSent: plan.reminders.length,
    rolledForward: plan.rollovers.length,
  });
}
