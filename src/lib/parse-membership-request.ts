import type { MembershipInput } from "./add-membership";

function parsePositiveNumber(value: unknown, field: string): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(`${field} must be a positive number`);
  }
  return parsed;
}

function parseNonEmptyString(value: unknown, field: string): string {
  if (typeof value !== "string" || !value) {
    throw new Error(`${field} is required`);
  }
  return value;
}

export function parseMembershipRequest(body: unknown): MembershipInput {
  if (typeof body !== "object" || body === null) {
    throw new Error("Invalid request body");
  }

  const record = body as Record<string, unknown>;

  return {
    email: parseNonEmptyString(record.email, "email"),
    activityName: parseNonEmptyString(record.activityName, "activityName"),
    startDate: parseNonEmptyString(record.startDate, "startDate"),
    cycleDays: parsePositiveNumber(record.cycleDays, "cycleDays"),
    noticeDays: parsePositiveNumber(record.noticeDays, "noticeDays"),
  };
}
