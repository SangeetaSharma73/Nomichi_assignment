"use client";

import { useActionState, useEffect, useRef } from "react";
import { addLeadNote, type NoteState } from "@/actions/leads";

const initialState: NoteState = {};

export function NoteForm({ leadId }: { leadId: string }) {
  const [state, action, pending] = useActionState(addLeadNote, initialState);
  const form = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) form.current?.reset();
  }, [state.success]);

  return (
    <form action={action} className="space-y-4" ref={form}>
      <input name="lead_id" type="hidden" value={leadId} />
      <label className="block">
        <span className="label">What was said?</span>
        <textarea
          className="field min-h-28"
          name="note"
          placeholder="They prefer a quieter group and are checking leave dates."
        />
      </label>
      <label className="block">
        <span className="label">Next action</span>
        <input
          className="field"
          name="next_action"
          placeholder="Call Friday after 4 pm"
        />
      </label>
      {state.error ? <p className="text-sm text-red-700">{state.error}</p> : null}
      <button className="button-primary" disabled={pending}>
        {pending ? "Saving..." : "Add call note"}
      </button>
    </form>
  );
}
