import { CalendarDays, IndianRupee, MapPin } from "lucide-react";
import type { Trip } from "@/types/database";
import { formatCurrency, formatTripDates } from "@/lib/format";

export function TripCard({ trip }: { trip: Trip }) {
  return (
    <article className="panel flex h-full flex-col overflow-hidden">
      <div className="h-2 bg-rust" />
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-olive/70">
              <MapPin size={14} />
              {trip.destination}
            </p>
            <h3 className="mt-3 text-2xl font-bold leading-tight">{trip.name}</h3>
          </div>
          <span className="rounded-full bg-yellow px-3 py-1 text-xs font-bold text-ink">
            Open
          </span>
        </div>
        <p className="mt-4 flex items-center gap-2 text-sm text-ink/65">
          <CalendarDays size={16} />
          {formatTripDates(trip.start_date, trip.end_date)}
        </p>
        <p className="mt-2 flex items-center gap-2 text-sm font-semibold">
          <IndianRupee size={16} />
          {formatCurrency(Number(trip.price_gst))} including GST
        </p>
        <p className="mt-5 flex-1 text-sm leading-7 text-ink/65">
          {trip.description}
        </p>
        <a className="button-secondary mt-6" href={`#enquire?trip=${trip.id}`}>
          Ask about this trip
        </a>
      </div>
    </article>
  );
}
