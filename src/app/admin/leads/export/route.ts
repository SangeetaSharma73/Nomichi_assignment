import { createClient } from "@/lib/supabase/server";

function csvCell(value: unknown) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const { data, error } = await supabase
    .from("leads")
    .select("name,email,phone,status,created_at,trip:trips(name)")
    .order("created_at", { ascending: false });
  if (error) return new Response("Export failed", { status: 500 });

  const rows = [
    ["Lead name", "Email", "Phone", "Trip", "Status", "Created"],
    ...(data ?? []).map((lead) => {
      const trip = lead.trip as unknown as { name: string } | null;
      return [
        lead.name,
        lead.email,
        lead.phone,
        trip?.name ?? "",
        lead.status,
        lead.created_at,
      ];
    }),
  ];
  const csv = rows.map((row) => row.map(csvCell).join(",")).join("\r\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="nomichi-leads.csv"',
    },
  });
}
