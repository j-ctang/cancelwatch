import { describe, expect, test, vi } from "vitest";
import { addMembership } from "./add-membership";

const baseInput = {
  email: "parent@example.com",
  activityName: "Emma's gymnastics",
  startDate: "2026-01-01",
  cycleDays: 30,
  noticeDays: 28,
};

describe("addMembership", () => {
  test("generates a new token when the email has none yet", async () => {
    const insertMembership = vi.fn().mockResolvedValue(undefined);
    const generateToken = vi.fn().mockReturnValue("new-token-123");

    const result = await addMembership(baseInput, {
      findTokenByEmail: vi.fn().mockResolvedValue(null),
      insertMembership,
      generateToken,
    });

    expect(result.token).toBe("new-token-123");
    expect(result.nextDeadline).toBe("2026-01-03");
    expect(insertMembership).toHaveBeenCalledWith({
      token: "new-token-123",
      email: baseInput.email,
      activityName: baseInput.activityName,
      startDate: baseInput.startDate,
      cycleDays: baseInput.cycleDays,
      noticeDays: baseInput.noticeDays,
      nextDeadline: "2026-01-03",
    });
  });

  test("reuses the existing token for an email already tracking a membership", async () => {
    const generateToken = vi.fn().mockReturnValue("should-not-be-used");

    const result = await addMembership(baseInput, {
      findTokenByEmail: vi.fn().mockResolvedValue("existing-token"),
      insertMembership: vi.fn().mockResolvedValue(undefined),
      generateToken,
    });

    expect(result.token).toBe("existing-token");
    expect(generateToken).not.toHaveBeenCalled();
  });
});
