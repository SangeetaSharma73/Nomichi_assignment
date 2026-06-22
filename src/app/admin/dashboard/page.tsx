import { Activity, CheckCircle2, Map, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/admin/page-header";
import { LEAD_STATUSES } from "@/lib/constants";
import { formatDateTime } from "@/lib/format";

export default async function DashboardPage() {
  const supabase = await createClient();
  const [{ data: leads }, { data: trips }, { data: activity }] = await Promise.all([
    supabase.from("leads").select("id,status,trip_id"),
    supabase.from("trips").select("id,name,status"),
    supabase
      .from("activity_logs")
      .select("id,action,created_at,lead:leads(name)")
      .order("created_at", { ascending: false })
      .limit(6),
  ]);

  const stageCounts = LEAD_STATUSES.map((stage) => ({
    ...stage,
    count: leads?.filter((lead) => lead.status === stage.value).length ?? 0,
  }));
  const perTrip = (trips ?? []).map((trip) => ({
    ...trip,
    count: leads?.filter((lead) => lead.trip_id === trip.id).length ?? 0,
  }));

  return (
    <>
      <PageHeader
        description="The few numbers worth seeing before the first call."
        eyebrow="Morning view"
        title="Dashboard"
      />
      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total leads", value: leads?.length ?? 0, icon: Users },
          {
            label: "Confirmed",
            value: leads?.filter((lead) => lead.status === "CONFIRMED").length ?? 0,
            icon: CheckCircle2,
          },
          {
            label: "Open trips",
            value: trips?.filter((trip) => trip.status === "OPEN").length ?? 0,
            icon: Map,
          },
          { label: "Recent actions", value: activity?.length ?? 0, icon: Activity },
        ].map(({ label, value, icon: Icon }) => (
          <article className="panel p-6" key={label}>
            <Icon className="text-rust" size={22} />
            <p className="mt-5 text-3xl font-bold">{value}</p>
            <p className="mt-1 text-sm text-ink/50">{label}</p>
          </article>
        ))}
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-2">
        <article className="panel p-6">
          <h2 className="text-lg font-bold">Pipeline</h2>
          <div className="mt-5 space-y-4">
            {stageCounts.map((stage) => (
              <div className="flex items-center justify-between" key={stage.value}>
                <span className="text-sm text-ink/65">{stage.label}</span>
                <span className="rounded-full bg-sand/25 px-3 py-1 text-sm font-semibold">
                  {stage.count}
                </span>
              </div>
            ))}
          </div>
        </article>
        <article className="panel p-6">
          <h2 className="text-lg font-bold">Leads by trip</h2>
          <div className="mt-5 space-y-4">
            {perTrip.length ? (
              perTrip.map((trip) => (
                <div className="flex items-center justify-between gap-4" key={trip.id}>
                  <span className="truncate text-sm text-ink/65">{trip.name}</span>
                  <span className="rounded-full bg-sand/25 px-3 py-1 text-sm font-semibold">
                    {trip.count}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-ink/50">No trips yet.</p>
            )}
          </div>
        </article>
      </section>

      <section className="panel mt-6 p-6">
        <h2 className="text-lg font-bold">Recent activity</h2>
        <div className="mt-5 divide-y divide-ink/10">
          {(activity ?? []).map((item) => {
            const lead = item.lead as unknown as { name: string } | null;
            return (
              <div className="flex justify-between gap-4 py-4 text-sm" key={item.id}>
                <p>
                  <span className="font-semibold">{lead?.name ?? "A lead"}</span>{" "}
                  <span className="text-ink/55">
                    {item.action.replaceAll("_", " ")}
                  </span>
                </p>
                <time className="shrink-0 text-xs text-ink/40">
                  {formatDateTime(item.created_at)}
                </time>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
