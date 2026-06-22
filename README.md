# Nomichi Trip Desk

A connected trip enquiry and lead management workspace for Nomichi.

Travellers can browse live open trips and send an enquiry. The team can sign in,
see that enquiry immediately, assign an owner, move it through the sales
pipeline, record call notes, and manage the trips shown on the public page.

## Product decisions

1. **The call log is the centre of the CRM.** Notes and next actions live in a
   separate table so every touchpoint keeps its author and timestamp.
2. **Pipeline changes are explicit.** Status is stored on the lead for fast
   filtering, while significant actions are copied to an append-only activity
   timeline.
3. **Trips are real content.** The public page reads the same trip records the
   team creates and edits. Closing a trip removes it from the public page.
4. **AI suggests, a person decides.** The WhatsApp draft is an editable starting
   point. It runs server-side and never sends a message automatically.
5. **Access starts narrow.** Admins can see every lead. Associates can only read
   and update leads assigned to them.

## Features

### Core

- Mobile-first public trip listing
- Live open trips from Supabase
- Validated enquiry form with loading, error, empty, and success states
- Supabase password authentication and protected admin routes
- Lead search and filters for status, trip, and owner
- Lead details, pipeline updates, ownership, and timestamped call notes
- Trip creation and editing from the admin
- Seed trips and leads

### Useful extras

- Morning dashboard with pipeline and trip counts
- Activity timeline
- CSV lead export
- Server-only AI WhatsApp draft
- Responsive Nomichi-branded interface
- Row-level security for admin and associate access

## Stack

- Next.js 15 App Router
- TypeScript
- Supabase Auth and PostgreSQL
- Tailwind CSS
- Zod
- OpenAI API
- Vercel-ready deployment

## Project structure

```text
src/
  actions/              Server actions for auth, enquiries, leads, trips, AI
  app/                  Public and protected App Router pages
  components/           Public, authentication, and admin components
  lib/                  Supabase clients, validation, formatting, constants
  types/                Domain types
supabase/
  migrations/           Schema, triggers, indexes, and RLS policies
  seed.sql              Four trips and six example leads
docs/
  IMPLEMENTATION_PHASES.md
```

## Database model

- `profiles`: Supabase auth user profile and role
- `trips`: public and closed trip content
- `leads`: traveller enquiry, pipeline stage, trip, and owner
- `lead_notes`: timestamped call notes and next actions
- `activity_logs`: lead creation, status, owner, and note events

Foreign keys keep the workflow connected. Indexes cover the common pipeline
filters. Updated timestamps are maintained by database triggers.

## Local setup

Requirements: Node.js 20 or newer, pnpm, and a Supabase project.

1. Install packages.

   ```bash
   pnpm install
   ```

2. Copy the environment template.

   ```bash
   copy .env.example .env.local
   ```

3. Add the following values to `.env.local`.

   ```text
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   SUPABASE_SERVICE_ROLE_KEY=
   OPENAI_API_KEY=
   ```

   `OPENAI_API_KEY` is optional. The rest of the product works without the AI
   draft. The service-role key is reserved for future administration scripts and
   is not read by browser code.

4. In the Supabase SQL editor, run:

   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/seed.sql`

5. In Supabase Authentication, create an email/password user. The profile is
   created automatically by a trigger.

6. Promote that user in the SQL editor.

   ```sql
   update public.profiles
   set role = 'admin'
   where email = 'your-email@example.com';
   ```

7. Start the app.

   ```bash
   pnpm dev
   ```

Open `http://localhost:3000` for the public page and `/login` for the team area.

## Verification

```bash
pnpm typecheck
pnpm build
```

The repository has been verified with a successful TypeScript check and
production Next.js build.

## Deploying to Vercel

1. Push the repository to GitHub.
2. Import it into Vercel as a Next.js project.
3. Add the environment variables from `.env.example`.
4. Deploy and test in a fresh browser:
   - open trips load
   - a public enquiry is saved
   - the admin can sign in
   - the new lead appears in the CRM
   - status and notes persist
   - creating or closing a trip changes the public page
5. Create or confirm the evaluator login before submission.

## What I would add with another week

- Seat inventory and confirmed-seat counts
- Scheduled follow-up reminders
- WhatsApp provider integration with send approval
- Pagination and full-text search for larger lead volumes
- Automated browser tests against a dedicated Supabase test project
- Audit log retention and richer team permissions

## Implementation notes

The phased verification and roadmap audit are in
[`docs/IMPLEMENTATION_PHASES.md`](docs/IMPLEMENTATION_PHASES.md).
