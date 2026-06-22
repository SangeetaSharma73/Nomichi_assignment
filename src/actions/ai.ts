"use server";

import OpenAI from "openai";
import { createClient } from "@/lib/supabase/server";

export type AiDraftState = { draft?: string; error?: string };

export async function draftWhatsAppMessage(
  _previous: AiDraftState,
  formData: FormData,
): Promise<AiDraftState> {
  const leadId = String(formData.get("lead_id") ?? "");
  if (!process.env.OPENAI_API_KEY) {
    return { error: "Add OPENAI_API_KEY to use the message draft." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You need to sign in again." };

  const { data: lead, error } = await supabase
    .from("leads")
    .select("name, group_type, preferred_month, expectation, trip:trips(name, destination, start_date, end_date)")
    .eq("id", leadId)
    .single();
  if (error || !lead) return { error: "Lead details could not be loaded." };

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.7,
    max_tokens: 120,
    messages: [
      {
        role: "system",
        content:
          "Write a warm first WhatsApp message as a Nomichi travel associate. Keep it under 70 words. Be human, calm, specific, and concise. No exclamation marks, em dashes, hype, or AI language. Ask one natural next-step question.",
      },
      {
        role: "user",
        content: JSON.stringify(lead),
      },
    ],
  });

  const draft = response.choices[0]?.message.content?.trim();
  return draft ? { draft } : { error: "No draft was returned." };
}
