-- Phase 4, slice 4.1 (ADR-0013): Reviews.
--
-- A Review is a signed-in Customer's rating (+ optional note) attached to an
-- Item, a Bundle, or the overall experience. Auto-published (no moderation).
-- Read publicly on the storefront server-side (service-role); RLS stays
-- deny-all like the rest of the schema.

create table if not exists reviews (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users (id) on delete set null,
  author_name text not null,
  target_type text not null check (target_type in ('item', 'bundle', 'experience')),
  target_id   text,                       -- item/bundle id; null for 'experience'
  rating      integer not null check (rating between 1 and 5),
  title       text,
  body        text,
  created_at  timestamptz not null default now()
);

create index if not exists reviews_target_idx
  on reviews (target_type, target_id, created_at desc);

alter table reviews enable row level security;
