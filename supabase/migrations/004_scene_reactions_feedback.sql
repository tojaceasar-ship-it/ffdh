-- Scene reactions & feedback storage for Rewir 2.0

create table if not exists public.scene_reactions (
  id uuid default uuid_generate_v4() primary key,
  scene_slug text not null,
  reaction text not null check (reaction in ('love', 'rage', 'sad', 'joy', 'mindblown')),
  nickname text,
  mood text,
  created_at timestamptz default now()
);

create index if not exists idx_scene_reactions_scene_slug on public.scene_reactions(scene_slug);
create index if not exists idx_scene_reactions_created_at on public.scene_reactions(created_at desc);

create or replace view public.scene_reaction_summary as
select
  scene_slug,
  count(*) filter (where reaction = 'love')     as love,
  count(*) filter (where reaction = 'rage')     as rage,
  count(*) filter (where reaction = 'sad')      as sad,
  count(*) filter (where reaction = 'joy')      as joy,
  count(*) filter (where reaction = 'mindblown') as mindblown
from public.scene_reactions
group by scene_slug;

alter table public.scene_reactions enable row level security;

create policy if not exists "scene_reactions_insert" on public.scene_reactions
  for insert
  with check (true);

create policy if not exists "scene_reactions_select" on public.scene_reactions
  for select
  using (true);

grant select, insert on public.scene_reactions to anon;
grant select on public.scene_reaction_summary to anon;

create table if not exists public.feedback_logs (
  id uuid default uuid_generate_v4() primary key,
  scene_slug text not null,
  comment text not null,
  ai_response text,
  mood text,
  nickname text,
  created_at timestamptz default now()
);

create index if not exists idx_feedback_logs_scene_slug on public.feedback_logs(scene_slug);
create index if not exists idx_feedback_logs_created_at on public.feedback_logs(created_at desc);

alter table public.feedback_logs enable row level security;

create policy if not exists "feedback_logs_insert" on public.feedback_logs
  for insert
  with check (true);

create policy if not exists "feedback_logs_select" on public.feedback_logs
  for select
  using (auth.role() = 'authenticated');

grant insert on public.feedback_logs to anon;
grant select on public.feedback_logs to authenticated;


