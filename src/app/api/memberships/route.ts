import { NextRequest, NextResponse } from "next/server";
import { addMembership } from "@/lib/add-membership";
import { findTokenByEmail, insertMembership } from "@/lib/memberships-repo";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const { email, activityName, startDate, cycleDays, noticeDays } = body;
  if (!email || !activityName || !startDate || !cycleDays || !noticeDays) {
    return NextResponse.json({ error: "Missing required field" }, { status: 400 });
  }

  const result = await addMembership(
    { email, activityName, startDate, cycleDays: Number(cycleDays), noticeDays: Number(noticeDays) },
    { findTokenByEmail, insertMembership }
  );

  return NextResponse.json(result, { status: 201 });
}
