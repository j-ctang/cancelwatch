import { getSupabaseClient } from "./supabase";
import type { MembershipRow } from "./add-membership";

export async function findTokenByEmail(email: string): Promise<string | null> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("memberships")
    .select("token")
    .eq("email", email)
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data?.token ?? null;
}

export async function insertMembership(row: MembershipRow): Promise<void> {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from("memberships").insert({
    token: row.token,
    email: row.email,
    activity_name: row.activityName,
    start_date: row.startDate,
    cycle_days: row.cycleDays,
    notice_days: row.noticeDays,
    next_deadline: row.nextDeadline,
  });

  if (error) throw error;
}

export type DashboardRow = {
  id: string;
  activityName: string;
  nextDeadline: string;
  canceledAt: string | null;
};

export async function listMembershipsByToken(token: string): Promise<DashboardRow[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("memberships")
    .select("id, activity_name, next_deadline, canceled_at")
    .eq("token", token)
    .order("next_deadline", { ascending: true });

  if (error) throw error;

  return (data ?? []).map((row) => ({
    id: row.id,
    activityName: row.activity_name,
    nextDeadline: row.next_deadline,
    canceledAt: row.canceled_at,
  }));
}

export async function cancelMembership(id: string, token: string): Promise<void> {
  const supabase = getSupabaseClient();
  const { error } = await supabase
    .from("memberships")
    .update({ canceled_at: new Date().toISOString() })
    .eq("id", id)
    .eq("token", token);

  if (error) throw error;
}

export async function deleteMembership(id: string, token: string): Promise<void> {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from("memberships").delete().eq("id", id).eq("token", token);

  if (error) throw error;
}

export type ActiveMembershipRow = {
  id: string;
  email: string;
  activityName: string;
  nextDeadline: string;
  cycleDays: number;
  canceledAt: string | null;
};

export async function listActiveMemberships(): Promise<ActiveMembershipRow[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("memberships")
    .select("id, email, activity_name, next_deadline, cycle_days, canceled_at")
    .is("canceled_at", null);

  if (error) throw error;

  return (data ?? []).map((row) => ({
    id: row.id,
    email: row.email,
    activityName: row.activity_name,
    nextDeadline: row.next_deadline,
    cycleDays: row.cycle_days,
    canceledAt: row.canceled_at,
  }));
}

export async function applyRollover(id: string, newDeadline: string): Promise<void> {
  const supabase = getSupabaseClient();
  const { error } = await supabase
    .from("memberships")
    .update({ next_deadline: newDeadline })
    .eq("id", id);

  if (error) throw error;
}
