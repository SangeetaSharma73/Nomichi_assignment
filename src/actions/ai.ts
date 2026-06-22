"use server";

import OpenAI from "openai";
import { createClient } from "@/lib/supabase/server";

export type AiDraftState = { draft?: string; error?: string };

type DraftLead = {
  name: string;
  group_type: string;
  preferred_month: string;
  expectation: string | null;
  trip:
    | {
        name: string;
        destination: string;
        start_date: string;
        end_date: string;
      }
    | Array<{
        name: string;
        destination: string;
        start_date: string;
        end_date: string;
      }>
    | null;
};

function fallbackDraft(lead: DraftLead) {
  const firstName = lead.name.trim().split(/\s+/)[0] || "there";
  const trip = Array.isArray(lead.trip) ? lead.trip[0] : lead.trip;
  const tripName = trip?.name ?? "the trip";
  const expectationText = lead.expectation?.trim().replace(/[.!?]+$/, "");
  const expectation = expectationText
    ? `I read your note about ${expectationText.toLowerCase()}`
    : "I read your enquiry";

  return `Hi ${firstName}, this is Nomichi. ${expectation}. ${tripName} could be a good fit if you want something slow and personal. Would you be open to a short call so we can understand what would feel right?`;
}

export async function draftWhatsAppMessage(
  _previous: AiDraftState,
  formData: FormData,
): Promise<AiDraftState> {
  const leadId = String(formData.get("lead_id") ?? "");

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

  const draftLead = lead as DraftLead;
  if (!process.env.OPENAI_API_KEY) {
    return { draft: fallbackDraft(draftLead) };
  }

  try {
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
    return draft ? { draft } : { draft: fallbackDraft(draftLead) };
  } catch {
    return { draft: fallbackDraft(draftLead) };
  }
}
