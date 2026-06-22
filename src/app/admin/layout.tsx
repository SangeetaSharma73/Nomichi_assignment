import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/admin/sidebar";
import type { Profile } from "@/types/database";
import { hasSupabaseEnv } from "@/lib/env";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!hasSupabaseEnv) redirect("/login");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="min-h-screen bg-cream">
      <Sidebar profile={data as Profile | null} />
      <main className="px-5 py-8 sm:px-8 lg:ml-72 lg:px-12 lg:py-10">
        {children}
      </main>
    </div>
  );
}
