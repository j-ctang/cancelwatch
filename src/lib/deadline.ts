function addDays(dateStr: string, days: number): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function computeNextDeadline(input: {
  startDate: string;
  cycleDays: number;
  noticeDays: number;
}): string {
  const cycleEnd = addDays(input.startDate, input.cycleDays);
  return addDays(cycleEnd, -input.noticeDays);
}

export function rollDeadlineForward(input: {
  currentDeadline: string;
  cycleDays: number;
}): string {
  return addDays(input.currentDeadline, input.cycleDays);
}
