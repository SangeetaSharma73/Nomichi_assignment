"use server";

import { revalidatePath } from "next/cache";
import { tripSchema } from "@/lib/validations";
import { createClient } from "@/lib/supabase/server";

export type TripFormState = { error?: string; success?: string };

export async function saveTrip(
  _previous: TripFormState,
  formData: FormData,
): Promise<TripFormState> {
  const values = Object.fromEntries(formData);
  const parsed = tripSchema.safeParse(values);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the trip details." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You need to sign in again." };

  const { id, ...trip } = parsed.data;
  const query = id
    ? supabase.from("trips").update(trip).eq("id", id)
    : supabase.from("trips").insert(trip);
  const { error } = await query;

  if (error) return { error: "The trip could not be saved." };

  revalidatePath("/");
  revalidatePath("/admin/trips");
  return { success: id ? "Trip updated." : "Trip created." };
}
