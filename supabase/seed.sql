create extension if not exists "pgcrypto";

-- Evaluator logins created by this seed:
-- admin@thenomichi.test / Nomichi@12345
-- associate@thenomichi.test / Nomichi@12345

insert into auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
)
values
  (
    '00000000-0000-0000-0000-000000000000',
    '00000000-0000-4000-8000-000000000001',
    'authenticated',
    'authenticated',
    'admin@thenomichi.test',
    crypt('Nomichi@12345', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Nomichi Admin"}'::jsonb,
    now(),
    now()
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '00000000-0000-4000-8000-000000000002',
    'authenticated',
    'authenticated',
    'associate@thenomichi.test',
    crypt('Nomichi@12345', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Nomichi Associate"}'::jsonb,
    now(),
    now()
  )
on conflict (id) do update set
  email = excluded.email,
  encrypted_password = excluded.encrypted_password,
  email_confirmed_at = excluded.email_confirmed_at,
  raw_app_meta_data = excluded.raw_app_meta_data,
  raw_user_meta_data = excluded.raw_user_meta_data,
  updated_at = now();

insert into auth.identities (
  id,
  user_id,
  provider_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
)
values
  (
    '00000000-0000-4000-8000-000000000101',
    '00000000-0000-4000-8000-000000000001',
    '00000000-0000-4000-8000-000000000001',
    jsonb_build_object(
      'sub',
      '00000000-0000-4000-8000-000000000001',
      'email',
      'admin@thenomichi.test',
      'email_verified',
      true,
      'phone_verified',
      false
    ),
    'email',
    now(),
    now(),
    now()
  ),
  (
    '00000000-0000-4000-8000-000000000102',
    '00000000-0000-4000-8000-000000000002',
    '00000000-0000-4000-8000-000000000002',
    jsonb_build_object(
      'sub',
      '00000000-0000-4000-8000-000000000002',
      'email',
      'associate@thenomichi.test',
      'email_verified',
      true,
      'phone_verified',
      false
    ),
    'email',
    now(),
    now(),
    now()
  )
on conflict (provider_id, provider) do update set
  user_id = excluded.user_id,
  identity_data = excluded.identity_data,
  updated_at = now();

insert into public.profiles (
  id,
  email,
  full_name,
  role
)
values
  (
    '00000000-0000-4000-8000-000000000001',
    'admin@thenomichi.test',
    'Nomichi Admin',
    'admin'
  ),
  (
    '00000000-0000-4000-8000-000000000002',
    'associate@thenomichi.test',
    'Nomichi Associate',
    'associate'
  )
on conflict (id) do update set
  email = excluded.email,
  full_name = excluded.full_name,
  role = excluded.role;

insert into public.trips (
  id,
  name,
  destination,
  start_date,
  end_date,
  price_gst,
  total_seats,
  status,
  description
)
values
  (
    '10000000-0000-4000-8000-000000000001',
    'Spiti Under Open Skies',
    'Spiti Valley, Himachal Pradesh',
    '2026-09-12',
    '2026-09-20',
    42500,
    12,
    'OPEN',
    'High mountain roads, small villages, and enough stillness to hear the valley.'
  ),
  (
    '10000000-0000-4000-8000-000000000002',
    'Meghalaya After the Rain',
    'Meghalaya',
    '2026-10-03',
    '2026-10-09',
    38900,
    14,
    'OPEN',
    'Forest paths, living root bridges, and slow mornings in the eastern hills.'
  ),
  (
    '10000000-0000-4000-8000-000000000003',
    'The Road to Tawang',
    'Arunachal Pradesh',
    '2026-11-07',
    '2026-11-15',
    46900,
    12,
    'OPEN',
    'A winding journey through mountain passes, monasteries, and cold clear air.'
  ),
  (
    '10000000-0000-4000-8000-000000000004',
    'Japan in Autumn',
    'Kyoto and the Kiso Valley, Japan',
    '2026-11-19',
    '2026-11-29',
    189000,
    10,
    'CLOSED',
    'Old post towns, quiet temples, and autumn colour away from the busiest routes.'
  )
on conflict (id) do update set
  name = excluded.name,
  destination = excluded.destination,
  start_date = excluded.start_date,
  end_date = excluded.end_date,
  price_gst = excluded.price_gst,
  total_seats = excluded.total_seats,
  status = excluded.status,
  description = excluded.description;

insert into public.leads (
  id,
  name,
  phone,
  email,
  trip_id,
  group_type,
  preferred_month,
  expectation,
  status,
  owner_id
)
values
  (
    '20000000-0000-4000-8000-000000000001',
    'Aarav Shah',
    '9876543210',
    'aarav@example.com',
    '10000000-0000-4000-8000-000000000001',
    'solo',
    '2026-09-01',
    'A quiet mountain week with long walks and a friendly group.',
    'NEW',
    null
  ),
  (
    '20000000-0000-4000-8000-000000000002',
    'Meera Nair',
    '9765432109',
    'meera@example.com',
    '10000000-0000-4000-8000-000000000002',
    'friends',
    '2026-10-01',
    'Rain, forest trails, local food, and unhurried mornings.',
    'CONTACTED',
    '00000000-0000-4000-8000-000000000002'
  ),
  (
    '20000000-0000-4000-8000-000000000003',
    'Kabir Singh',
    '9654321098',
    'kabir@example.com',
    '10000000-0000-4000-8000-000000000003',
    'couple',
    '2026-11-01',
    'A first trip to the northeast that does not feel rushed.',
    'QUALIFIED',
    '00000000-0000-4000-8000-000000000001'
  ),
  (
    '20000000-0000-4000-8000-000000000004',
    'Ira Bose',
    '9543210987',
    'ira@example.com',
    '10000000-0000-4000-8000-000000000001',
    'solo',
    '2026-09-01',
    'Good conversations, simple stays, and a little time alone.',
    'VIBE_CHECK',
    '00000000-0000-4000-8000-000000000002'
  ),
  (
    '20000000-0000-4000-8000-000000000005',
    'Rohan Iyer',
    '9432109876',
    'rohan@example.com',
    '10000000-0000-4000-8000-000000000002',
    'family',
    '2026-10-01',
    'An active but comfortable week for four adults.',
    'SENT',
    '00000000-0000-4000-8000-000000000001'
  ),
  (
    '20000000-0000-4000-8000-000000000006',
    'Sana Khan',
    '9321098765',
    'sana@example.com',
    '10000000-0000-4000-8000-000000000003',
    'friends',
    '2026-11-01',
    'Cold weather, mountain roads, and a small group we can get to know.',
    'CONFIRMED',
    '00000000-0000-4000-8000-000000000002'
  )
on conflict (id) do update set
  name = excluded.name,
  phone = excluded.phone,
  email = excluded.email,
  trip_id = excluded.trip_id,
  group_type = excluded.group_type,
  preferred_month = excluded.preferred_month,
  expectation = excluded.expectation,
  status = excluded.status,
  owner_id = excluded.owner_id;

insert into public.lead_notes (
  id,
  lead_id,
  note,
  next_action,
  created_by,
  created_at
)
values
  (
    '30000000-0000-4000-8000-000000000001',
    '20000000-0000-4000-8000-000000000002',
    'Meera is comparing Meghalaya with Spiti. She wants rain, food, and enough quiet time for the group.',
    'Send Meghalaya route note and ask for group size confirmation',
    '00000000-0000-4000-8000-000000000002',
    now() - interval '2 days'
  ),
  (
    '30000000-0000-4000-8000-000000000002',
    '20000000-0000-4000-8000-000000000004',
    'Ira sounds like a strong fit for slow travel. She asked about room sharing and how much walking is involved.',
    'Call tomorrow after 6 pm with stay details',
    '00000000-0000-4000-8000-000000000002',
    now() - interval '1 day'
  ),
  (
    '30000000-0000-4000-8000-000000000003',
    '20000000-0000-4000-8000-000000000006',
    'Sana and two friends are confirmed for Tawang. They prefer a small group and are comfortable with cold weather.',
    'Share payment confirmation and packing note',
    '00000000-0000-4000-8000-000000000002',
    now() - interval '6 hours'
  )
on conflict (id) do update set
  lead_id = excluded.lead_id,
  note = excluded.note,
  next_action = excluded.next_action,
  created_by = excluded.created_by,
  created_at = excluded.created_at;

insert into public.activity_logs (
  id,
  lead_id,
  action,
  actor_id,
  metadata,
  created_at
)
values
  (
    '40000000-0000-4000-8000-000000000001',
    '20000000-0000-4000-8000-000000000002',
    'status_changed',
    '00000000-0000-4000-8000-000000000002',
    '{"from":"NEW","to":"CONTACTED"}'::jsonb,
    now() - interval '2 days'
  ),
  (
    '40000000-0000-4000-8000-000000000002',
    '20000000-0000-4000-8000-000000000004',
    'status_changed',
    '00000000-0000-4000-8000-000000000002',
    '{"from":"QUALIFIED","to":"VIBE_CHECK"}'::jsonb,
    now() - interval '1 day'
  ),
  (
    '40000000-0000-4000-8000-000000000003',
    '20000000-0000-4000-8000-000000000006',
    'status_changed',
    '00000000-0000-4000-8000-000000000002',
    '{"from":"SENT","to":"CONFIRMED"}'::jsonb,
    now() - interval '6 hours'
  )
on conflict (id) do update set
  lead_id = excluded.lead_id,
  action = excluded.action,
  actor_id = excluded.actor_id,
  metadata = excluded.metadata,
  created_at = excluded.created_at;
