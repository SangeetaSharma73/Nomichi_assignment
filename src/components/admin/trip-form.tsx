"use client";

import { useActionState } from "react";
import { saveTrip, type TripFormState } from "@/actions/trips";
import type { Trip } from "@/types/database";

const initialState: TripFormState = {};

export function TripForm({ trip }: { trip?: Trip }) {
  const [state, action, pending] = useActionState(saveTrip, initialState);

  return (
    <form action={action} className="grid gap-4 sm:grid-cols-2">
      {trip ? <input name="id" type="hidden" value={trip.id} /> : null}
      <label className="sm:col-span-2">
        <span className="label">Trip name</span>
        <input className="field" defaultValue={trip?.name} name="name" />
      </label>
      <label>
        <span className="label">Destination</span>
        <input
          className="field"
          defaultValue={trip?.destination}
          name="destination"
        />
      </label>
      <label>
        <span className="label">Status</span>
        <select className="field" defaultValue={trip?.status ?? "OPEN"} name="status">
          <option value="OPEN">Open</option>
          <option value="CLOSED">Closed</option>
        </select>
      </label>
      <label>
        <span className="label">Start date</span>
        <input className="field" defaultValue={trip?.start_date} name="start_date" type="date" />
      </label>
      <label>
        <span className="label">End date</span>
        <input className="field" defaultValue={trip?.end_date} name="end_date" type="date" />
      </label>
      <label>
        <span className="label">Price including GST</span>
        <input
          className="field"
          defaultValue={trip?.price_gst}
          min="1"
          name="price_gst"
          type="number"
        />
      </label>
      <label>
        <span className="label">Total seats</span>
        <input
          className="field"
          defaultValue={trip?.total_seats}
          min="1"
          name="total_seats"
          type="number"
        />
      </label>
      <label className="sm:col-span-2">
        <span className="label">Short description</span>
        <textarea
          className="field min-h-24"
          defaultValue={trip?.description}
          name="description"
        />
      </label>
      {state.error ? (
        <p className="text-sm text-red-700 sm:col-span-2">{state.error}</p>
      ) : null}
      {state.success ? (
        <p className="text-sm text-emerald-700 sm:col-span-2">{state.success}</p>
      ) : null}
      <div className="sm:col-span-2">
        <button className="button-primary" disabled={pending}>
          {pending ? "Saving..." : trip ? "Save changes" : "Create trip"}
        </button>
      </div>
    </form>
  );
}
