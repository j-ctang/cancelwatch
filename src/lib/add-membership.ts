import { computeNextDeadline } from "./deadline";
import { generateToken as defaultGenerateToken } from "./token";

export type MembershipInput = {
  email: string;
  activityName: string;
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
  const existingToken = await deps.findTokenByEmail(input.email);
  const token = existingToken ?? (deps.generateToken ?? defaultGenerateToken)();
  const nextDeadline = computeNextDeadline(input);

  await deps.insertMembership({ ...input, token, nextDeadline });

  return { token, nextDeadline };
}
