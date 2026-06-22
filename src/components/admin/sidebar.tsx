import {
  Compass,
  LayoutDashboard,
  LogOut,
  Map,
  Users,
} from "lucide-react";
import { logout } from "@/actions/auth";
import type { Profile } from "@/types/database";

const links = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/leads", label: "Leads", icon: Users },
  { href: "/admin/trips", label: "Trips", icon: Map },
];

export function Sidebar({ profile }: { profile: Profile | null }) {
  return (
    <aside className="flex border-b border-ink/10 bg-olive text-cream lg:fixed lg:inset-y-0 lg:w-72 lg:flex-col lg:border-b-0">
      <div className="flex w-full items-center justify-between px-5 py-4 lg:block lg:px-7 lg:py-8">
        <a className="flex items-center gap-3 text-lg font-bold" href="/admin/dashboard">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-rust">
            <Compass size={19} />
          </span>
          nomichi desk
        </a>
        <nav className="hidden lg:mt-12 lg:block">
          <ul className="space-y-2">
            {links.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <a
                  className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-cream/70 transition hover:bg-white/10 hover:text-cream"
                  href={href}
                >
                  <Icon size={18} />
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="hidden lg:mt-auto lg:block lg:border-t lg:border-white/10 lg:p-7">
        <p className="text-sm font-semibold">{profile?.full_name || "Nomichi team"}</p>
        <p className="mt-1 truncate text-xs text-cream/50">{profile?.email}</p>
        <form action={logout}>
          <button className="mt-5 flex items-center gap-2 text-sm text-cream/65 hover:text-white">
            <LogOut size={16} />
            Sign out
          </button>
        </form>
      </div>
      <nav className="flex items-center gap-1 pr-3 lg:hidden">
        {links.map(({ href, label, icon: Icon }) => (
          <a
            aria-label={label}
            className="rounded-xl p-3 text-cream/65 hover:bg-white/10 hover:text-white"
            href={href}
            key={href}
          >
            <Icon size={18} />
          </a>
        ))}
      </nav>
    </aside>
  );
}
