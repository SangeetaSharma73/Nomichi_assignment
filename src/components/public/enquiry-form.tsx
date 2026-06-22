"use client";

import { useActionState, useEffect, useRef } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { submitEnquiry, type EnquiryState } from "@/actions/enquiries";
import { GROUP_TYPES } from "@/lib/constants";
import type { Trip } from "@/types/database";

const initialState: EnquiryState = { status: "idle" };

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null;
  return <p className="mt-1 text-xs text-red-700">{messages[0]}</p>;
}

export function EnquiryForm({
  selectedTripId,
  trips,
}: {
  selectedTripId?: string;
  trips: Trip[];
}) {
  const [state, action, pending] = useActionState(submitEnquiry, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") formRef.current?.reset();
  }, [state.status]);

  if (state.status === "success") {
    return (
      <div className="panel p-8 text-center sm:p-10">
        <CheckCircle2 className="mx-auto text-rust" size={42} />
        <h3 className="mt-5 text-2xl font-bold">Your note reached us.</h3>
        <p className="mx-auto mt-3 max-w-md leading-7 text-ink/65">
          {state.message}
        </p>
        <button
          className="button-secondary mt-7"
          onClick={() => window.location.reload()}
          type="button"
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} action={action} className="panel p-6 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <label>
          <span className="label">Your name</span>
          <input className="field" name="name" placeholder="Rahul Mehta" />
          <FieldError messages={state.errors?.name} />
        </label>
        <label>
          <span className="label">Phone</span>
          <input
            className="field"
            inputMode="numeric"
            maxLength={10}
            name="phone"
            placeholder="9876543210"
          />
          <FieldError messages={state.errors?.phone} />
        </label>
        <label>
          <span className="label">Email</span>
          <input
            className="field"
            name="email"
            placeholder="rahul@example.com"
            type="email"
          />
          <FieldError messages={state.errors?.email} />
        </label>
        <label>
          <span className="label">Trip</span>
          <select className="field" defaultValue={selectedTripId ?? ""} name="trip_id">
            <option disabled value="">
              Choose a trip
            </option>
            {trips.map((trip) => (
              <option key={trip.id} value={trip.id}>
                {trip.name}
              </option>
            ))}
          </select>
          <FieldError messages={state.errors?.trip_id} />
        </label>
        <label>
          <span className="label">Who are you travelling with?</span>
          <select className="field" defaultValue="" name="group_type">
            <option disabled value="">
              Choose one
            </option>
            {GROUP_TYPES.map((group) => (
              <option key={group.value} value={group.value}>
                {group.label}
              </option>
            ))}
          </select>
          <FieldError messages={state.errors?.group_type} />
        </label>
        <label>
          <span className="label">Preferred month</span>
          <input className="field" name="preferred_month" type="month" />
          <FieldError messages={state.errors?.preferred_month} />
        </label>
      </div>
      <label className="mt-5 block">
        <span className="label">What are you hoping this trip feels like?</span>
        <textarea
          className="field min-h-32 resize-y"
          name="expectation"
          placeholder="A quiet week in the mountains, good conversations, and time away from screens."
        />
        <FieldError messages={state.errors?.expectation} />
      </label>
      {state.status === "error" && state.message ? (
        <p className="mt-5 rounded-2xl bg-red-50 p-4 text-sm text-red-800">
          {state.message}
        </p>
      ) : null}
      <button className="button-primary mt-6 w-full gap-2" disabled={pending}>
        {pending ? "Sending your note..." : "Send enquiry"}
        {!pending && <ArrowRight size={17} />}
      </button>
      <p className="mt-4 text-center text-xs leading-5 text-ink/45">
        We use these details only to help you find the right Nomichi trip.
      </p>
    </form>
  );
}
