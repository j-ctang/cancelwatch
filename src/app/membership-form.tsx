"use client";

import { useState } from "react";
import { findVendorHint, hintsForCategory, type Category } from "@/lib/vendor-hints";

const CATEGORY_OPTIONS: { value: Category; label: string }[] = [
  { value: "kid_activity", label: "Kid activity (gymnastics, swim, karate, dance...)" },
  { value: "gym", label: "Gym / fitness" },
  { value: "insurance_utility", label: "Insurance / utility / phone plan" },
  { value: "storage_misc", label: "Storage unit / parking / other contract" },
];

export function MembershipForm() {
  const [tokenUrl, setTokenUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<Category | "">("");
  const [activityName, setActivityName] = useState("");
  const [cycleDays, setCycleDays] = useState(30);
  const [noticeDays, setNoticeDays] = useState(28);

  function handleActivityNameChange(value: string) {
    setActivityName(value);
    if (!category) return;

    const hint = findVendorHint(category, value);
    if (hint) {
      setCycleDays(hint.cycleDays);
      setNoticeDays(hint.noticeDays);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const form = new FormData(event.currentTarget);
    const res = await fetch("/api/memberships", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.get("email"),
        activityName: form.get("activityName"),
        category: form.get("category"),
        startDate: form.get("startDate"),
        cycleDays: form.get("cycleDays"),
        noticeDays: form.get("noticeDays"),
      }),
    });

    if (!res.ok) {
      setError("Something went wrong. Please try again.");
      return;
    }

    const { token } = await res.json();
    setTokenUrl(`${window.location.origin}/m/${token}`);
    event.currentTarget.reset();
    setCategory("");
    setActivityName("");
    setCycleDays(30);
    setNoticeDays(28);
  }

  if (tokenUrl) {
    return (
      <p>
        Bookmark this link to manage your memberships:{" "}
        <a href={tokenUrl}>{tokenUrl}</a>
      </p>
    );
  }

  const vendorHints = category ? hintsForCategory(category) : [];

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Email
        <input name="email" type="email" required />
      </label>
      <label>
        Category
        <select
          name="category"
          required
          value={category}
          onChange={(event) => setCategory(event.target.value as Category)}
        >
          <option value="" disabled>
            Select a category
          </option>
          {CATEGORY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <label>
        Activity / vendor name
        <input
          name="activityName"
          type="text"
          required
          placeholder="Emma's gymnastics"
          list="vendor-hints"
          value={activityName}
          onChange={(event) => handleActivityNameChange(event.target.value)}
        />
        <datalist id="vendor-hints">
          {vendorHints.map((hint) => (
            <option key={hint.name} value={hint.name} />
          ))}
        </datalist>
      </label>
      <label>
        Start date
        <input name="startDate" type="date" required />
      </label>
      <label>
        Renewal cycle (days)
        <input
          name="cycleDays"
          type="number"
          required
          value={cycleDays}
          onChange={(event) => setCycleDays(Number(event.target.value))}
        />
      </label>
      <label>
        Notice period (days)
        <input
          name="noticeDays"
          type="number"
          required
          value={noticeDays}
          onChange={(event) => setNoticeDays(Number(event.target.value))}
        />
      </label>
      <button type="submit">Track this</button>
      {error && <p role="alert">{error}</p>}
    </form>
  );
}
