import { getSupabaseClient } from "./supabase";
import type { MembershipRow } from "./add-membership";
import type { Category } from "./vendor-hints";

async function unwrap<T>(
  query: PromiseLike<{ data: T | null; error: { message: string } | null }>
): Promise<T | null> {
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
}

export type MembershipRecord = {
  id: string;
  email: string;
  activityName: string;
  category: Category;
  nextDeadline: string;
  cycleDays: number;
  canceledAt: string | null;
};

type DbMembershipRow = {
  id: string;
  email: string;
  activity_name: string;
  category: Category;
  next_deadline: string;
  cycle_days: number;
  canceled_at: string | null;
};

function toDomainRecord(row: DbMembershipRow): MembershipRecord {
  return {
    id: row.id,
    email: row.email,
    activityName: row.activity_name,
    category: row.category,
    nextDeadline: row.next_deadline,
    cycleDays: row.cycle_days,
    canceledAt: row.canceled_at,
  };
}

const SELECT_COLUMNS = "id, email, activity_name, category, next_deadline, cycle_days, canceled_at";

export async function findTokenByEmail(email: string): Promise<string | null> {
  const supabase = getSupabaseClient();
  const data = await unwrap<{ token: string }>(
    supabase.from("memberships").select("token").eq("email", email).limit(1).maybeSingle()
  );
  return data?.token ?? null;
}

export async function insertMembership(row: MembershipRow): Promise<void> {
  const supabase = getSupabaseClient();
  await unwrap(
    supabase.from("memberships").insert({
      token: row.token,
      email: row.email,
      activity_name: row.activityName,
      category: row.category,
      start_date: row.startDate,
      cycle_days: row.cycleDays,
      notice_days: row.noticeDays,
      next_deadline: row.nextDeadline,
    })
  );
}

export async function listMembershipsByToken(token: string): Promise<MembershipRecord[]> {
  const supabase = getSupabaseClient();
  const data = await unwrap<DbMembershipRow[]>(
    supabase
      .from("memberships")
      .select(SELECT_COLUMNS)
      .eq("token", token)
      .order("next_deadline", { ascending: true })
  );
  return (data ?? []).map(toDomainRecord);
}

export async function cancelMembership(id: string, token: string): Promise<void> {
  const supabase = getSupabaseClient();
  await unwrap(
    supabase
      .from("memberships")
      .update({ canceled_at: new Date().toISOString() })
      .eq("id", id)
      .eq("token", token)
  );
}

export async function deleteMembership(id: string, token: string): Promise<void> {
  const supabase = getSupabaseClient();
  await unwrap(supabase.from("memberships").delete().eq("id", id).eq("token", token));
}

export async function listActiveMemberships(): Promise<MembershipRecord[]> {
  const supabase = getSupabaseClient();
  const data = await unwrap<DbMembershipRow[]>(
    supabase.from("memberships").select(SELECT_COLUMNS).is("canceled_at", null)
  );
  return (data ?? []).map(toDomainRecord);
}

export async function applyRollover(id: string, newDeadline: string): Promise<void> {
  const supabase = getSupabaseClient();
  await unwrap(
    supabase.from("memberships").update({ next_deadline: newDeadline }).eq("id", id)
  );
}
