"use client";

import { useActionState } from "react";
import { Copy, Sparkles } from "lucide-react";
import { draftWhatsAppMessage, type AiDraftState } from "@/actions/ai";

const initialState: AiDraftState = {};

export function AiDraft({ leadId }: { leadId: string }) {
  const [state, action, pending] = useActionState(
    draftWhatsAppMessage,
    initialState,
  );

  return (
    <div>
      <form action={action}>
        <input name="lead_id" type="hidden" value={leadId} />
        <button className="button-secondary gap-2" disabled={pending}>
          <Sparkles size={16} />
          {pending ? "Drafting..." : "Draft first WhatsApp"}
        </button>
      </form>
      {state.error ? <p className="mt-3 text-sm text-red-700">{state.error}</p> : null}
      {state.draft ? (
        <div className="mt-4 rounded-2xl bg-sand/15 p-4">
          <p className="whitespace-pre-wrap text-sm leading-7">{state.draft}</p>
          <button
            className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-rust"
            onClick={() => navigator.clipboard.writeText(state.draft ?? "")}
            type="button"
          >
            <Copy size={14} />
            Copy message
          </button>
        </div>
      ) : null}
    </div>
  );
}
