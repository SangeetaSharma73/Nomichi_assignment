insert into public.trips (
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
    'Japan in Autumn',
    'Kyoto and the Kiso Valley, Japan',
    '2026-11-19',
    '2026-11-29',
    189000,
    10,
    'CLOSED',
    'Old post towns, quiet temples, and autumn colour away from the busiest routes.'
  );

insert into public.leads (
  name,
  phone,
  email,
  trip_id,
  group_type,
  preferred_month,
  expectation,
  status
)
values
  (
    'Aarav Shah',
    '9876543210',
    'aarav@example.com',
    (select id from public.trips where name = 'Spiti Under Open Skies'),
    'solo',
    '2026-09-01',
    'A quiet mountain week with long walks and a friendly group.',
    'NEW'
  ),
  (
    'Meera Nair',
    '9765432109',
    'meera@example.com',
    (select id from public.trips where name = 'Meghalaya After the Rain'),
    'friends',
    '2026-10-01',
    'Rain, forest trails, local food, and unhurried mornings.',
    'CONTACTED'
  ),
  (
    'Kabir Singh',
    '9654321098',
    'kabir@example.com',
    (select id from public.trips where name = 'The Road to Tawang'),
    'couple',
    '2026-11-01',
    'A first trip to the northeast that does not feel rushed.',
    'QUALIFIED'
  ),
  (
    'Ira Bose',
    '9543210987',
    'ira@example.com',
    (select id from public.trips where name = 'Spiti Under Open Skies'),
    'solo',
    '2026-09-01',
    'Good conversations, simple stays, and a little time alone.',
    'VIBE_CHECK'
  ),
  (
    'Rohan Iyer',
    '9432109876',
    'rohan@example.com',
    (select id from public.trips where name = 'Meghalaya After the Rain'),
    'family',
    '2026-10-01',
    'An active but comfortable week for four adults.',
    'SENT'
  ),
  (
    'Sana Khan',
    '9321098765',
    'sana@example.com',
    (select id from public.trips where name = 'The Road to Tawang'),
    'friends',
    '2026-11-01',
    'Cold weather, mountain roads, and a small group we can get to know.',
    'CONFIRMED'
  );

-- Create an auth user in the Supabase dashboard, then promote that profile:
-- update public.profiles set role = 'admin' where email = 'your-email@example.com';
