-- Enable UUID & helper extensions
create extension if not exists "uuid-ossp";

-- Profiles (mirror of auth.users basics)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  plan text default 'free',
  stripe_customer_id text,
  created_at timestamp with time zone default now()
);

alter table public.profiles enable row level security;
create policy "profile is self" on public.profiles
  for select using (auth.uid() = id);
create policy "update self profile" on public.profiles
  for update using (auth.uid() = id);

-- Forms
create table if not exists public.forms (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  fields jsonb not null,
  created_at timestamp with time zone default now()
);

alter table public.forms enable row level security;
create policy "owner can crud forms" on public.forms
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

-- Submissions (publicly writeable to allow anonymous intake)
create table if not exists public.submissions (
  id uuid primary key default uuid_generate_v4(),
  form_id uuid not null references public.forms(id) on delete cascade,
  values jsonb not null,
  created_at timestamp with time zone default now()
);

alter table public.submissions enable row level security;
-- Anyone can insert (anonymous form fill). Reads restricted to owner via join.
create policy "anyone can submit" on public.submissions
  for insert with check (true);

-- Owner can read their submissions (via form owner)
create view public.submissions_owned as
  select s.* from public.submissions s
  join public.forms f on f.id = s.form_id
  where f.owner_id = auth.uid();

create policy "owner read submissions via view" on public.submissions
  for select using (exists (
    select 1 from public.forms f where f.id = form_id and f.owner_id = auth.uid()
  ));

-- Notes generated
create table if not exists public.notes (
  id uuid primary key default uuid_generate_v4(),
  submission_id uuid not null references public.submissions(id) on delete cascade,
  body text not null,
  created_at timestamp with time zone default now()
);
alter table public.notes enable row level security;
create policy "owner read notes" on public.notes
  for select using (exists (
    select 1 from public.submissions s
    join public.forms f on f.id = s.form_id
    where s.id = submission_id and f.owner_id = auth.uid()
  ));
create policy "owner insert notes" on public.notes
  for insert with check (exists (
    select 1 from public.submissions s
    join public.forms f on f.id = s.form_id
    where s.id = submission_id and f.owner_id = auth.uid()
  ));

-- Audit events (basic starter)
create table if not exists public.audit_events (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id),
  action text not null,
  target text,
  metadata jsonb,
  created_at timestamp with time zone default now()
);
alter table public.audit_events enable row level security;
create policy "read own audit" on public.audit_events
  for select using (auth.uid() = user_id);
create policy "insert own audit" on public.audit_events
  for insert with check (auth.uid() = user_id);

-- Triggers to keep profiles in sync with auth
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name',''));
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
