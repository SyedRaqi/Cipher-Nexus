-- Run this once in Supabase: SQL Editor > New query > paste > Run.

create table if not exists public.scores (
  id         bigint generated always as identity primary key,
  game       text        not null check (game in ('runner','arena','ember','duel')),
  name       text        not null check (char_length(name) between 2 and 16),
  score      integer     not null check (score >= 0),
  created_at timestamptz not null default now(),
  -- Highest scores each game can really produce. Anything above is rejected.
  constraint plausible_score check (
    (game = 'runner' and score <= 3000) or
    (game = 'arena'  and score <= 15)   or
    (game = 'ember'  and score <= 1300) or
    (game = 'duel'   and score <= 1500)
  )
);

create index if not exists scores_board_idx on public.scores (game, score desc, created_at);

-- Row level security: everyone can read and add scores, nobody can edit or delete.
alter table public.scores enable row level security;

drop policy if exists "read scores"  on public.scores;
drop policy if exists "add scores"   on public.scores;
create policy "read scores" on public.scores for select to anon using (true);
create policy "add scores"  on public.scores for insert to anon with check (true);

-- Basic spam brake: one score per player name every 10 seconds.
create or replace function public.throttle_scores() returns trigger as $$
begin
  if exists (select 1 from public.scores
             where name = new.name and created_at > now() - interval '10 seconds') then
    raise exception 'Too many submissions. Wait a few seconds.';
  end if;
  return new;
end $$ language plpgsql;

drop trigger if exists throttle_scores on public.scores;
create trigger throttle_scores before insert on public.scores
  for each row execute function public.throttle_scores();
