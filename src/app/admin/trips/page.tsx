import { CalendarDays, MapPin } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/admin/page-header";
import { TripForm } from "@/components/admin/trip-form";
import { formatCurrency, formatTripDates } from "@/lib/format";
import type { Trip } from "@/types/database";

export default async function TripsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("trips")
    .select("*")
    .order("start_date", { ascending: false });
  const trips = (data ?? []) as Trip[];

  return (
    <>
      <PageHeader
        description="Publish the trips travellers can discover without touching code."
        eyebrow="Trip content"
        title="Trips"
      />
      <section className="mt-8 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <article className="panel h-fit p-6">
          <h2 className="text-lg font-bold">Create a trip</h2>
          <div className="mt-5">
            <TripForm />
          </div>
        </article>
        <div className="space-y-4">
          {trips.map((trip) => (
            <details className="panel group p-6" key={trip.id}>
              <summary className="cursor-pointer list-none">
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <p className="flex items-center gap-2 text-xs uppercase tracking-wider text-ink/40">
                      <MapPin size={14} />
                      {trip.destination}
                    </p>
                    <h2 className="mt-2 text-xl font-bold">{trip.name}</h2>
                    <p className="mt-2 flex items-center gap-2 text-sm text-ink/50">
                      <CalendarDays size={15} />
                      {formatTripDates(trip.start_date, trip.end_date)}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        trip.status === "OPEN"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-ink text-white"
                      }`}
                    >
                      {trip.status === "OPEN" ? "Open" : "Closed"}
                    </span>
                    <p className="mt-3 text-sm font-semibold">
                      {formatCurrency(Number(trip.price_gst))}
                    </p>
                  </div>
                </div>
              </summary>
              <div className="mt-6 border-t border-ink/10 pt-6">
                <TripForm trip={trip} />
              </div>
            </details>
          ))}
          {!trips.length ? (
            <div className="panel p-10 text-center text-sm text-ink/50">
              No trips yet. Create the first one here.
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}
