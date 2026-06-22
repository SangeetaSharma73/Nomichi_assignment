create extension if not exists "pgcrypto";

create type public.user_role as enum ('admin', 'associate');
create type public.trip_status as enum ('OPEN', 'CLOSED');
create type public.lead_status as enum (
  'NEW',
  'CONTACTED',
  'QUALIFIED',
  'VIBE_CHECK',
  'SENT',
  'CONFIRMED',
  'NOT_A_FIT'
);
create type public.group_type as enum ('solo', 'friends', 'couple', 'family');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text not null default '',
  role public.user_role not null default 'associate',
  created_at timestamptz not null default now()
);

create table public.trips (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  destination text not null,
  start_date date not null,
  end_date date not null,
  price_gst numeric(12, 2) not null check (price_gst > 0),
  total_seats integer not null check (total_seats > 0),
  status public.trip_status not null default 'OPEN',
  description text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint trips_dates_valid check (end_date >= start_date)
);

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null check (phone ~ '^[6-9][0-9]{9}$'),
  email text not null,
  trip_id uuid not null references public.trips(id) on delete restrict,
  group_type public.group_type not null,
  preferred_month date not null,
  expectation text,
  status public.lead_status not null default 'NEW',
  owner_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.lead_notes (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  note text not null,
  next_action text,
  created_by uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default now()
);

create table public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  action text not null,
  actor_id uuid references public.profiles(id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index leads_created_at_idx on public.leads(created_at desc);
create index leads_status_idx on public.leads(status);
create index leads_trip_id_idx on public.leads(trip_id);
create index leads_owner_id_idx on public.leads(owner_id);
create index lead_notes_lead_id_idx on public.lead_notes(lead_id, created_at desc);
create index activity_logs_lead_id_idx on public.activity_logs(lead_id, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trips_set_updated_at
before update on public.trips
for each row execute function public.set_updated_at();

create trigger leads_set_updated_at
before update on public.leads
for each row execute function public.set_updated_at();

create or replace function public.log_new_lead()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.activity_logs (lead_id, action, metadata)
  values (new.id, 'lead_created', jsonb_build_object('source', 'public_enquiry'));
  return new;
end;
$$;

create trigger on_lead_created
after insert on public.leads
for each row execute function public.log_new_lead();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'full_name', '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

alter table public.profiles enable row level security;
alter table public.trips enable row level security;
alter table public.leads enable row level security;
alter table public.lead_notes enable row level security;
alter table public.activity_logs enable row level security;

create policy "Public can read open trips"
on public.trips for select
using (status = 'OPEN' or auth.uid() is not null);

create policy "Admins manage trips"
on public.trips for all to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Users can read profiles"
on public.profiles for select to authenticated
using (true);

create policy "Public can create leads"
on public.leads for insert to anon
with check (status = 'NEW' and owner_id is null);

create policy "Team reads permitted leads"
on public.leads for select to authenticated
using (public.is_admin() or owner_id = auth.uid());

create policy "Team updates permitted leads"
on public.leads for update to authenticated
using (public.is_admin() or owner_id = auth.uid())
with check (public.is_admin() or owner_id = auth.uid());

create policy "Team reads notes for permitted leads"
on public.lead_notes for select to authenticated
using (
  exists (
    select 1 from public.leads
    where leads.id = lead_notes.lead_id
      and (public.is_admin() or leads.owner_id = auth.uid())
  )
);

create policy "Team adds notes to permitted leads"
on public.lead_notes for insert to authenticated
with check (
  created_by = auth.uid()
  and exists (
    select 1 from public.leads
    where leads.id = lead_notes.lead_id
      and (public.is_admin() or leads.owner_id = auth.uid())
  )
);

create policy "Team reads activity for permitted leads"
on public.activity_logs for select to authenticated
using (
  exists (
    select 1 from public.leads
    where leads.id = activity_logs.lead_id
      and (public.is_admin() or leads.owner_id = auth.uid())
  )
);

create policy "Team creates activity for permitted leads"
on public.activity_logs for insert to authenticated
with check (
  actor_id = auth.uid()
  and exists (
    select 1 from public.leads
    where leads.id = activity_logs.lead_id
      and (public.is_admin() or leads.owner_id = auth.uid())
  )
);
