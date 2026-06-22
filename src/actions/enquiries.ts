"use server";

import { enquirySchema } from "@/lib/validations";
import { createClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/env";

export type EnquiryState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Record<string, string[] | undefined>;
};

export async function submitEnquiry(
  _previousState: EnquiryState,
  formData: FormData,
): Promise<EnquiryState> {
  const parsed = enquirySchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return {
      status: "error",
      message: "A few details need your attention.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  if (!hasSupabaseEnv) {
    return {
      status: "error",
      message: "The enquiry desk is being connected. Please try again soon.",
    };
  }

  const supabase = await createClient();

  const { data: trip, error: tripError } = await supabase
    .from("trips")
    .select("id")
    .eq("id", parsed.data.trip_id)
    .eq("status", "OPEN")
    .maybeSingle();

  if (tripError || !trip) {
    return {
      status: "error",
      message: "Choose one of the open trips before sending your note.",
      errors: { trip_id: ["Choose an open trip"] },
    };
  }

  const { error } = await supabase.from("leads").insert({
    ...parsed.data,
    preferred_month: `${parsed.data.preferred_month}-01`,
    expectation: parsed.data.expectation || null,
  });

  if (error) {
    console.error("Lead submission failed", error);
    return {
      status: "error",
      message: "We could not save this just now. Please try once more.",
    };
  }

  return {
    status: "success",
    message:
      "We have your note. Someone from Nomichi will write to you with the next clear step.",
  };
}
