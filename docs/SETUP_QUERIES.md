# Supabase setup queries

Run these in the Supabase SQL editor after creating a project and adding the
environment variables to Vercel or `.env.local`.

## Fresh reset for a broken setup

If you already ran older SQL and see errors like these:

```text
ERROR: 42710: type "user_role" already exists
ERROR: 21000: more than one row returned by a subquery used as an expression
```

Run `supabase/full_reset_database.sql` first. It drops the Nomichi assignment
tables, functions, triggers, enum types, and seeded evaluator users.

Then run:

1. `supabase/migrations/001_initial_schema.sql`
2. `supabase/seed.sql`

## 1. Create the schema

Open `supabase/migrations/001_initial_schema.sql`, paste the full contents into
the SQL editor, and run it.

This creates:

- `profiles`
- `trips`
- `leads`
- `lead_notes`
- `activity_logs`
- enums, indexes, triggers, and RLS policies

## 2. Seed mock data and evaluator logins

Open `supabase/seed.sql`, paste the full contents into the SQL editor, and run
it. The file is idempotent, so it can be rerun while testing.

If you previously ran an older seed and only see this error:

```text
ERROR: 21000: more than one row returned by a subquery used as an expression
```

Run `supabase/reset_mock_data.sql` once, then rerun `supabase/seed.sql`. That
error comes from duplicate mock trip names created by the older seed.

It creates:

- 2 auth users
- 2 profiles
- 4 trips, with 3 open trips and 1 closed trip
- 6 leads across the pipeline
- sample call notes and activity logs

Evaluator logins:

```text
Admin
Email: admin@thenomichi.test
Password: Nomichi@12345

Associate
Email: associate@thenomichi.test
Password: Nomichi@12345
```

## 3. Promote a manually created user

If you create a user through Supabase Authentication instead of using the seeded
admin login, run this query after the user exists:

```sql
update public.profiles
set
  role = 'admin',
  full_name = coalesce(nullif(full_name, ''), 'Nomichi Admin')
where email = 'your-email@example.com';
```

## 4. Confirm the seeded data

```sql
select email, full_name, role
from public.profiles
order by role, email;

select name, destination, status, start_date
from public.trips
order by start_date;

select leads.name, leads.status, trips.name as trip, profiles.email as owner
from public.leads
join public.trips on trips.id = leads.trip_id
left join public.profiles on profiles.id = leads.owner_id
order by leads.created_at desc;
```
