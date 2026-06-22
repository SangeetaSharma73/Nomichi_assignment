create schema if not exists auth;
create table if not exists auth.users (
  id uuid primary key default gen_random_uuid(),
  email text,
  raw_user_meta_data jsonb
);

-- Mock auth.uid() function
create or replace function auth.uid()
returns uuid
language sql
stable
as $$
  select null::uuid;
$$;

-- Create roles if they don't exist
do $$
begin
  if not exists (select from pg_catalog.pg_roles where rolname = 'authenticated') then
    create role authenticated;
  end if;
  if not exists (select from pg_catalog.pg_roles where rolname = 'anon') then
    create role anon;
  end if;
end
$$;
