-- Destructive fresh-start reset for the Nomichi assignment.
-- Run this only when you want to remove the existing app schema and seed users,
-- then run supabase/migrations/001_initial_schema.sql and supabase/seed.sql.

drop trigger if exists on_auth_user_created on auth.users;

drop table if exists public.activity_logs cascade;
drop table if exists public.lead_notes cascade;
drop table if exists public.leads cascade;
drop table if exists public.trips cascade;
drop table if exists public.profiles cascade;

drop function if exists public.is_admin() cascade;
drop function if exists public.handle_new_user() cascade;
drop function if exists public.log_new_lead() cascade;
drop function if exists public.set_updated_at() cascade;

drop type if exists public.group_type cascade;
drop type if exists public.lead_status cascade;
drop type if exists public.trip_status cascade;
drop type if exists public.user_role cascade;

delete from auth.identities
where provider = 'email'
  and (
    provider_id in (
      '00000000-0000-4000-8000-000000000001',
      '00000000-0000-4000-8000-000000000002'
    )
    or user_id in (
      select id
      from auth.users
      where email in ('admin@thenomichi.test', 'associate@thenomichi.test')
    )
  );

delete from auth.users
where email in ('admin@thenomichi.test', 'associate@thenomichi.test')
   or id in (
    '00000000-0000-4000-8000-000000000001',
    '00000000-0000-4000-8000-000000000002'
  );
