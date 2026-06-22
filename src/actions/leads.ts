"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { noteSchema } from "@/lib/validations";
import { LEAD_STATUSES } from "@/lib/constants";
import type { LeadStatus } from "@/types/database";

async function authenticatedClient() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("You need to sign in again.");
  return { supabase, user };
}

export async function updateLeadStatus(formData: FormData) {
  const leadId = String(formData.get("lead_id") ?? "");
  const status = String(formData.get("status") ?? "") as LeadStatus;
  if (!LEAD_STATUSES.some((item) => item.value === status)) return;

  const { supabase, user } = await authenticatedClient();
  const { data: lead } = await supabase
    .from("leads")
    .select("status")
    .eq("id", leadId)
    .single();

  const { error } = await supabase
    .from("leads")
    .update({ status })
    .eq("id", leadId);
  if (error) throw error;

  await supabase.from("activity_logs").insert({
    lead_id: leadId,
    actor_id: user.id,
    action: "status_changed",
    metadata: { from: lead?.status, to: status },
  });

  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${leadId}`);
  revalidatePath("/admin/dashboard");
}

export async function assignLead(formData: FormData) {
  const leadId = String(formData.get("lead_id") ?? "");
  const ownerId = String(formData.get("owner_id") ?? "") || null;
  const { supabase, user } = await authenticatedClient();

  const { error } = await supabase
    .from("leads")
    .update({ owner_id: ownerId })
    .eq("id", leadId);
  if (error) throw error;

  await supabase.from("activity_logs").insert({
    lead_id: leadId,
    actor_id: user.id,
    action: "owner_assigned",
    metadata: { owner_id: ownerId },
  });

  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${leadId}`);
}

export type NoteState = { error?: string; success?: boolean };

export async function addLeadNote(
  _previous: NoteState,
  formData: FormData,
): Promise<NoteState> {
  const parsed = noteSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the note." };
  }

  const { supabase, user } = await authenticatedClient();
  const { error } = await supabase.from("lead_notes").insert({
    ...parsed.data,
    next_action: parsed.data.next_action || null,
    created_by: user.id,
  });
  if (error) return { error: "The note could not be saved." };

  await supabase.from("activity_logs").insert({
    lead_id: parsed.data.lead_id,
    actor_id: user.id,
    action: "note_added",
    metadata: { has_next_action: Boolean(parsed.data.next_action) },
  });

  revalidatePath(`/admin/leads/${parsed.data.lead_id}`);
  return { success: true };
}
