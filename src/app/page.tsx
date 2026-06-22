import { ArrowDown, Compass } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/env";
import type { Trip } from "@/types/database";
import { TripCard } from "@/components/public/trip-card";
import { EnquiryForm } from "@/components/public/enquiry-form";

type SearchParams = Promise<{
  trip?: string;
}>;

async function getOpenTrips(): Promise<Trip[]> {
  if (!hasSupabaseEnv) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("trips")
    .select("*")
    .eq("status", "OPEN")
    .order("start_date");

  if (error) throw error;
  return (data ?? []) as Trip[];
}

export default async function Home({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const trips = await getOpenTrips();
  const selectedTripId = trips.some((trip) => trip.id === params.trip)
    ? params.trip
    : undefined;

  return (
    <main>
      <section className="relative overflow-hidden bg-olive px-6 py-8 text-cream sm:px-10 lg:px-16">
        <nav className="mx-auto flex max-w-7xl items-center justify-between">
          <Link className="text-lg font-bold tracking-tight" href="/">
            nomichi
          </Link>
          <a className="text-sm text-cream/70 hover:text-cream" href="/login">
            Team login
          </a>
        </nav>
        <div className="mx-auto grid min-h-[620px] max-w-7xl items-center gap-12 py-20 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-sand">
              Travel that finds you
            </p>
            <h1 className="mt-6 max-w-4xl font-[var(--font-display)] text-5xl uppercase leading-[0.95] sm:text-7xl lg:text-8xl">
              Go slowly.
              <br />
              Come back
              <br />
              different.
            </h1>
            <p className="mt-8 max-w-xl text-base leading-8 text-cream/75 sm:text-lg">
              Small-group journeys for people who want a place to feel personal.
              Tell us what you are looking for. We will help you find the right road.
            </p>
            <a className="button-primary mt-8 gap-2" href="#trips">
              See open trips <ArrowDown size={17} />
            </a>
          </div>
          <div className="relative mx-auto hidden aspect-square w-full max-w-md rounded-full border border-cream/20 lg:grid lg:place-items-center">
            <div className="absolute inset-8 rounded-full border border-dashed border-sand/40" />
            <Compass className="text-yellow" size={150} strokeWidth={0.7} />
            <span className="absolute right-4 top-1/2 h-3 w-3 rounded-full bg-rust" />
            <span className="absolute bottom-12 left-16 h-2 w-2 rounded-full bg-sand" />
          </div>
        </div>
      </section>

      <section className="px-6 py-24 sm:px-10 lg:px-16" id="trips">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-rust">
            The journeys ahead
          </p>
          <div className="mt-3 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <h2 className="max-w-2xl font-[var(--font-display)] text-4xl uppercase sm:text-5xl">
              Open trips
            </h2>
            <p className="max-w-md text-sm leading-6 text-ink/60">
              Every group stays small. Every route leaves room for the unexpected.
            </p>
          </div>
          {trips.length ? (
            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {trips.map((trip) => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </div>
          ) : (
            <div className="panel mt-10 p-10 text-center">
              <Compass className="mx-auto text-rust" size={38} />
              <h3 className="mt-4 text-xl font-bold">No open roads just now.</h3>
              <p className="mt-2 text-sm text-ink/60">
                New journeys are being shaped. Check back soon.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="bg-sand/20 px-6 py-24 sm:px-10 lg:px-16" id="enquire">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-rust">
              Start with a note
            </p>
            <h2 className="mt-3 font-[var(--font-display)] text-4xl uppercase sm:text-5xl">
              What kind of week are you hoping for?
            </h2>
            <p className="mt-6 max-w-md leading-7 text-ink/65">
              There is no sales script waiting on the other side. A real person will
              read this, understand what matters to you, and write back.
            </p>
          </div>
          {trips.length ? (
            <EnquiryForm selectedTripId={selectedTripId} trips={trips} />
          ) : (
            <div className="panel grid min-h-72 place-items-center p-8 text-center">
              <p className="max-w-sm text-ink/60">
                The enquiry form will open when the next trips are published.
              </p>
            </div>
          )}
        </div>
      </section>
      <footer className="bg-ink px-6 py-10 text-cream sm:px-10 lg:px-16">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-sm sm:flex-row">
          <span className="font-semibold">nomichi</span>
          <span className="text-cream/55">Wander. Connect. Belong.</span>
        </div>
      </footer>
    </main>
  );
}
