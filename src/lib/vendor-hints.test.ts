import { describe, expect, test } from "vitest";
import { findVendorHint, hintsForCategory } from "./vendor-hints";

describe("findVendorHint", () => {
  test("matches an exact vendor name within the category", () => {
    const hint = findVendorHint("gym", "Planet Fitness");

    expect(hint?.name).toBe("Planet Fitness");
  });

  test("matches case-insensitively", () => {
    const hint = findVendorHint("gym", "planet fitness");

    expect(hint?.name).toBe("Planet Fitness");
  });

  test("matches a partial substring", () => {
    const hint = findVendorHint("gym", "planet");

    expect(hint?.name).toBe("Planet Fitness");
  });

  test("matches an alias", () => {
    const hint = findVendorHint("insurance_utility", "geico");

    expect(hint?.name).toBe("Geico");
  });

  test("returns null when nothing matches", () => {
    const hint = findVendorHint("gym", "some random gym nobody knows");

    expect(hint).toBeNull();
  });

  test("does not match a vendor from a different category", () => {
    const hint = findVendorHint("storage_misc", "planet fitness");

    expect(hint).toBeNull();
  });
});

describe("hintsForCategory", () => {
  test("returns only hints belonging to the given category", () => {
    const hints = hintsForCategory("storage_misc");

    expect(hints.length).toBeGreaterThan(0);
    expect(hints.every((hint) => hint.category === "storage_misc")).toBe(true);
  });

  test("returns an empty list for kid_activity, which has no seed data", () => {
    expect(hintsForCategory("kid_activity")).toEqual([]);
  });
});
