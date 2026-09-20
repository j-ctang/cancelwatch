import { describe, expect, test } from "vitest";
import { parseMembershipRequest } from "./parse-membership-request";

const validBody = {
  email: "parent@example.com",
  activityName: "Emma's gymnastics",
  startDate: "2026-01-01",
  cycleDays: "30",
  noticeDays: "28",
};

describe("parseMembershipRequest", () => {
  test("parses a valid body, coercing string numbers", () => {
    const result = parseMembershipRequest(validBody);

    expect(result).toEqual({
      email: "parent@example.com",
      activityName: "Emma's gymnastics",
      startDate: "2026-01-01",
      cycleDays: 30,
      noticeDays: 28,
    });
  });

  test("rejects a missing email", () => {
    expect(() => parseMembershipRequest({ ...validBody, email: "" })).toThrow(
      "email is required"
    );
  });

  test("rejects a missing activity name", () => {
    expect(() => parseMembershipRequest({ ...validBody, activityName: "" })).toThrow(
      "activityName is required"
    );
  });

  test("rejects a non-numeric cycleDays", () => {
    expect(() => parseMembershipRequest({ ...validBody, cycleDays: "not-a-number" })).toThrow(
      "cycleDays must be a positive number"
    );
  });

  test("rejects a zero or negative noticeDays", () => {
    expect(() => parseMembershipRequest({ ...validBody, noticeDays: "0" })).toThrow(
      "noticeDays must be a positive number"
    );
  });

  test("rejects a non-object body", () => {
    expect(() => parseMembershipRequest(null)).toThrow("Invalid request body");
  });
});
