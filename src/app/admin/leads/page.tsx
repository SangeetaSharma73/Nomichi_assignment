import { Download, Search } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { LEAD_STATUSES } from "@/lib/constants";
import { formatDateTime } from "@/lib/format";
import type { LeadWithRelations, Profile, Trip } from "@/types/database";

type SearchParams = Promise<{
  q?: string;
  status?: string;
  trip?: string;
  owner?: string;
}>;

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const filters = await searchParams;
  const supabase = await createClient();
  let query = supabase
    .from("leads")
    .select(
      "*,trip:trips(id,name,destination),owner:profiles!leads_owner_id_fkey(id,full_name,email)",
    )
    .order("created_at", { ascending: false });

  if (filters.q) {
    const safe = filters.q.replaceAll(",", " ");
    query = query.or(`name.ilike.%${safe}%,email.ilike.%${safe}%,phone.ilike.%${safe}%`);
  }
  if (filters.status) query = query.eq("status", filters.status);
  if (filters.trip) query = query.eq("trip_id", filters.trip);
  if (filters.owner === "unassigned") query = query.is("owner_id", null);
  else if (filters.owner) query = query.eq("owner_id", filters.owner);

  const [{ data: leads }, { data: trips }, { data: profiles }] = await Promise.all([
    query,
    supabase.from("trips").select("*").order("name"),
    supabase.from("profiles").select("*").order("full_name"),
  ]);

  return (
    <>
      <PageHeader
        action={
          <Link className="button-secondary gap-2" href="/admin/leads/export">
            <Download size={16} />
            Export CSV
          </Link>
        }
        description="Find the person who needs a thoughtful next step."
        eyebrow="The pipeline"
        title="Leads"
      />
      <form className="panel mt-8 grid gap-3 p-4 md:grid-cols-[1.5fr_1fr_1fr_1fr_auto]">
        <label className="relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/35"
            size={17}
          />
          <input
            className="field pl-11"
            defaultValue={filters.q}
            name="q"
            placeholder="Name, email, or phone"
          />
        </label>
        <select className="field" defaultValue={filters.status ?? ""} name="status">
          <option value="">All statuses</option>
          {LEAD_STATUSES.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
        <select className="field" defaultValue={filters.trip ?? ""} name="trip">
          <option value="">All trips</option>
          {(trips as Trip[] | null)?.map((trip) => (
            <option key={trip.id} value={trip.id}>
              {trip.name}
            </option>
          ))}
        </select>
        <select className="field" defaultValue={filters.owner ?? ""} name="owner">
          <option value="">All owners</option>
          <option value="unassigned">Unassigned</option>
          {(profiles as Profile[] | null)?.map((profile) => (
            <option key={profile.id} value={profile.id}>
              {profile.full_name || profile.email}
            </option>
          ))}
        </select>
        <button className="button-primary">Apply</button>
      </form>

      <div className="panel mt-6 overflow-hidden">
        {(leads ?? []).length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[780px] text-left">
              <thead className="bg-sand/15 text-xs uppercase tracking-wider text-ink/45">
                <tr>
                  <th className="px-6 py-4">Traveller</th>
                  <th className="px-6 py-4">Trip</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Owner</th>
                  <th className="px-6 py-4">Received</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/10">
                {(leads as LeadWithRelations[]).map((lead) => (
                  <tr className="transition hover:bg-sand/10" key={lead.id}>
                    <td className="px-6 py-5">
                      <a className="font-semibold hover:text-rust" href={`/admin/leads/${lead.id}`}>
                        {lead.name}
                      </a>
                      <p className="mt-1 text-xs text-ink/45">{lead.phone}</p>
                    </td>
                    <td className="px-6 py-5 text-sm text-ink/65">
                      {lead.trip?.name ?? "Unknown trip"}
                    </td>
                    <td className="px-6 py-5">
                      <StatusBadge status={lead.status} />
                    </td>
                    <td className="px-6 py-5 text-sm text-ink/65">
                      {lead.owner?.full_name || lead.owner?.email || "Unassigned"}
                    </td>
                    <td className="px-6 py-5 text-xs text-ink/45">
                      {formatDateTime(lead.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <h2 className="text-lg font-bold">No leads found.</h2>
            <p className="mt-2 text-sm text-ink/50">
              Clear a filter or wait for the next enquiry.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
