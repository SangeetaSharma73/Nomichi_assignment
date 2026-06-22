import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Mail, Phone, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { updateLeadStatus, assignLead } from "@/actions/leads";
import { LEAD_STATUSES, GROUP_TYPES } from "@/lib/constants";
import { formatDateTime, formatTripDates } from "@/lib/format";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { NoteForm } from "@/components/admin/note-form";
import { AiDraft } from "@/components/admin/ai-draft";
import type {
  ActivityLog,
  LeadNote,
  LeadWithRelations,
  Profile,
  Trip,
} from "@/types/database";

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const [{ data: lead }, { data: notes }, { data: activity }, { data: profiles }] =
    await Promise.all([
      supabase
        .from("leads")
        .select(
          "*,trip:trips(*),owner:profiles!leads_owner_id_fkey(id,full_name,email)",
        )
        .eq("id", id)
        .single(),
      supabase
        .from("lead_notes")
        .select("*,author:profiles!lead_notes_created_by_fkey(full_name,email)")
        .eq("lead_id", id)
        .order("created_at", { ascending: false }),
      supabase
        .from("activity_logs")
        .select("*,actor:profiles!activity_logs_actor_id_fkey(full_name,email)")
        .eq("lead_id", id)
        .order("created_at", { ascending: false }),
      supabase.from("profiles").select("*").order("full_name"),
    ]);

  if (!lead) notFound();
  const typedLead = lead as LeadWithRelations & { trip: Trip };
  const group = GROUP_TYPES.find((item) => item.value === typedLead.group_type)?.label;

  return (
    <>
      <Link className="inline-flex items-center gap-2 text-sm text-ink/50 hover:text-rust" href="/admin/leads">
        <ArrowLeft size={16} />
        Back to leads
      </Link>
      <div className="mt-6">
        <PageHeader
          action={<StatusBadge status={typedLead.status} />}
          description={`${typedLead.trip?.name ?? "Trip enquiry"} · received ${formatDateTime(typedLead.created_at)}`}
          eyebrow="Lead detail"
          title={typedLead.name}
        />
      </div>

      <section className="mt-8 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <article className="panel p-6">
            <h2 className="text-lg font-bold">Traveller and trip</h2>
            <div className="mt-6 grid gap-5 text-sm sm:grid-cols-2">
              <p className="flex items-center gap-3 text-ink/65">
                <Phone size={17} className="text-rust" />
                <a href={`tel:${typedLead.phone}`}>{typedLead.phone}</a>
              </p>
              <p className="flex items-center gap-3 text-ink/65">
                <Mail size={17} className="text-rust" />
                <a href={`mailto:${typedLead.email}`}>{typedLead.email}</a>
              </p>
              <p className="flex items-center gap-3 text-ink/65">
                <Users size={17} className="text-rust" />
                {group}
              </p>
              <p className="flex items-center gap-3 text-ink/65">
                <Calendar size={17} className="text-rust" />
                Prefers {typedLead.preferred_month.slice(0, 7)}
              </p>
            </div>
            {typedLead.trip ? (
              <div className="mt-6 rounded-2xl bg-sand/15 p-5">
                <p className="font-semibold">{typedLead.trip.name}</p>
                <p className="mt-1 text-sm text-ink/55">
                  {typedLead.trip.destination} ·{" "}
                  {formatTripDates(
                    typedLead.trip.start_date,
                    typedLead.trip.end_date,
                  )}
                </p>
              </div>
            ) : null}
            <div className="mt-6">
              <p className="text-xs font-bold uppercase tracking-wider text-ink/40">
                What they hope it feels like
              </p>
              <p className="mt-2 whitespace-pre-wrap leading-7 text-ink/70">
                {typedLead.expectation || "No note was added."}
              </p>
            </div>
          </article>

          <article className="panel p-6">
            <h2 className="text-lg font-bold">Call log</h2>
            <div className="mt-5">
              <NoteForm leadId={id} />
            </div>
            <div className="mt-8 divide-y divide-ink/10">
              {(notes as Array<LeadNote & { author?: { full_name: string; email: string } }> | null)?.map(
                (note) => (
                  <div className="py-5" key={note.id}>
                    <div className="flex justify-between gap-4">
                      <p className="text-sm font-semibold">
                        {note.author?.full_name || note.author?.email || "Team member"}
                      </p>
                      <time className="text-xs text-ink/40">
                        {formatDateTime(note.created_at)}
                      </time>
                    </div>
                    <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-ink/65">
                      {note.note}
                    </p>
                    {note.next_action ? (
                      <p className="mt-3 rounded-xl bg-yellow/40 p-3 text-sm">
                        <strong>Next:</strong> {note.next_action}
                      </p>
                    ) : null}
                  </div>
                ),
              )}
            </div>
          </article>
        </div>

        <div className="space-y-6">
          <article className="panel p-6">
            <h2 className="text-lg font-bold">Next step</h2>
            <form action={updateLeadStatus} className="mt-5 space-y-3">
              <input name="lead_id" type="hidden" value={id} />
              <select className="field" defaultValue={typedLead.status} name="status">
                {LEAD_STATUSES.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
              <button className="button-primary w-full">Update status</button>
            </form>
            <form action={assignLead} className="mt-6 space-y-3">
              <input name="lead_id" type="hidden" value={id} />
              <label className="label">Owner</label>
              <select
                className="field"
                defaultValue={typedLead.owner_id ?? ""}
                name="owner_id"
              >
                <option value="">Unassigned</option>
                {(profiles as Profile[] | null)?.map((profile) => (
                  <option key={profile.id} value={profile.id}>
                    {profile.full_name || profile.email}
                  </option>
                ))}
              </select>
              <button className="button-secondary w-full">Assign owner</button>
            </form>
          </article>

          <article className="panel p-6">
            <h2 className="text-lg font-bold">First message</h2>
            <p className="mt-2 text-sm leading-6 text-ink/50">
              Generate a short starting point. Read it and make it yours before sending.
            </p>
            <div className="mt-5">
              <AiDraft leadId={id} />
            </div>
          </article>

          <article className="panel p-6">
            <h2 className="text-lg font-bold">Activity</h2>
            <div className="mt-5 space-y-5">
              {(activity as Array<ActivityLog & { actor?: { full_name: string; email: string } }> | null)?.map(
                (item) => (
                  <div className="border-l-2 border-sand pl-4" key={item.id}>
                    <p className="text-sm font-semibold capitalize">
                      {item.action.replaceAll("_", " ")}
                    </p>
                    <p className="mt-1 text-xs text-ink/45">
                      {item.actor?.full_name || item.actor?.email || "System"} ·{" "}
                      {formatDateTime(item.created_at)}
                    </p>
                  </div>
                ),
              )}
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
