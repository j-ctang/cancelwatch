import { computeNextDeadline } from "./deadline";
import { generateToken as defaultGenerateToken } from "./token";
import type { Category } from "./vendor-hints";

const VALID_CATEGORIES: Category[] = ["kid_activity", "gym", "insurance_utility", "storage_misc"];

export type MembershipInput = {
  email: string;
  activityName: string;
  category: Category;
  startDate: string;
  cycleDays: number;
  noticeDays: number;
};

export type MembershipRow = MembershipInput & {
  token: string;
  nextDeadline: string;
};

export type AddMembershipDeps = {
  findTokenByEmail: (email: string) => Promise<string | null>;
  insertMembership: (row: MembershipRow) => Promise<void>;
  generateToken?: () => string;
};

export async function addMembership(
  input: MembershipInput,
  deps: AddMembershipDeps
): Promise<{ token: string; nextDeadline: string }> {
  if (!VALID_CATEGORIES.includes(input.category)) {
    throw new Error(`Invalid category: ${input.category}`);
  }

  const existingToken = await deps.findTokenByEmail(input.email);
  const token = existingToken ?? (deps.generateToken ?? defaultGenerateToken)();
  const nextDeadline = computeNextDeadline(input);

  await deps.insertMembership({ ...input, token, nextDeadline });

  return { token, nextDeadline };
}
