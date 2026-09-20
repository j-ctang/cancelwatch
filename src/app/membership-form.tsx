"use client";

import { useState } from "react";

export function MembershipForm() {
  const [tokenUrl, setTokenUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
  }

  if (tokenUrl) {
    return (
      <p>
        Bookmark this link to manage your memberships:{" "}
        <a href={tokenUrl}>{tokenUrl}</a>
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Email
        <input name="email" type="email" required />
      </label>
      <label>
        Activity name
        <input name="activityName" type="text" required placeholder="Emma's gymnastics" />
      </label>
      <label>
        Start date
        <input name="startDate" type="date" required />
      </label>
      <label>
        Renewal cycle (days)
        <input name="cycleDays" type="number" required defaultValue={30} />
      </label>
      <label>
        Notice period (days)
        <input name="noticeDays" type="number" required defaultValue={28} />
      </label>
      <button type="submit">Track this</button>
      {error && <p role="alert">{error}</p>}
    </form>
  );
}
