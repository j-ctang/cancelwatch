const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function daysRemaining(deadline: string, today: string): number {
  const deadlineMs = Date.parse(`${deadline}T00:00:00Z`);
  const todayMs = Date.parse(`${today}T00:00:00Z`);
  return Math.round((deadlineMs - todayMs) / MS_PER_DAY);
}
