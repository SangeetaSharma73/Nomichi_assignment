-- Use this only if an earlier seed run created duplicate Nomichi assignment
-- mock data. It removes the sample rows by their known emails and trip names,
-- then you can rerun supabase/seed.sql cleanly.

delete from public.activity_logs
where lead_id in (
  select id
  from public.leads
  where email in (
    'aarav@example.com',
    'meera@example.com',
    'kabir@example.com',
    'ira@example.com',
    'rohan@example.com',
    'sana@example.com'
  )
  or trip_id in (
    select id
    from public.trips
    where name in (
      'Spiti Under Open Skies',
      'Meghalaya After the Rain',
      'The Road to Tawang',
      'Japan in Autumn'
    )
  )
);

delete from public.lead_notes
where lead_id in (
  select id
  from public.leads
  where email in (
    'aarav@example.com',
    'meera@example.com',
    'kabir@example.com',
    'ira@example.com',
    'rohan@example.com',
    'sana@example.com'
  )
  or trip_id in (
    select id
    from public.trips
    where name in (
      'Spiti Under Open Skies',
      'Meghalaya After the Rain',
      'The Road to Tawang',
      'Japan in Autumn'
    )
  )
);

delete from public.leads
where email in (
  'aarav@example.com',
  'meera@example.com',
  'kabir@example.com',
  'ira@example.com',
  'rohan@example.com',
  'sana@example.com'
)
or trip_id in (
  select id
  from public.trips
  where name in (
    'Spiti Under Open Skies',
    'Meghalaya After the Rain',
    'The Road to Tawang',
    'Japan in Autumn'
  )
);

delete from public.trips
where name in (
  'Spiti Under Open Skies',
  'Meghalaya After the Rain',
  'The Road to Tawang',
  'Japan in Autumn'
);

delete from public.profiles
where email in ('admin@thenomichi.test', 'associate@thenomichi.test');

delete from auth.identities
where provider = 'email'
  and provider_id in (
    '00000000-0000-4000-8000-000000000001',
    '00000000-0000-4000-8000-000000000002'
  );

delete from auth.users
where email in ('admin@thenomichi.test', 'associate@thenomichi.test')
   or id in (
    '00000000-0000-4000-8000-000000000001',
    '00000000-0000-4000-8000-000000000002'
  );
