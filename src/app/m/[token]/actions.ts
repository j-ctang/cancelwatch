"use server";

import { revalidatePath } from "next/cache";
import { cancelMembership, deleteMembership } from "@/lib/memberships-repo";

export async function cancelAction(token: string, formData: FormData) {
  const id = String(formData.get("id"));
  await cancelMembership(id, token);
  revalidatePath(`/m/${token}`);
}

export async function deleteAction(token: string, formData: FormData) {
  const id = String(formData.get("id"));
  await deleteMembership(id, token);
  revalidatePath(`/m/${token}`);
}
