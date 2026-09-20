import { NextRequest, NextResponse } from "next/server";
import { addMembership } from "@/lib/add-membership";
import { parseMembershipRequest } from "@/lib/parse-membership-request";
import { findTokenByEmail, insertMembership } from "@/lib/memberships-repo";

export async function POST(request: NextRequest) {
  const body = await request.json();

  try {
    const input = parseMembershipRequest(body);
    const result = await addMembership(input, { findTokenByEmail, insertMembership });
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
