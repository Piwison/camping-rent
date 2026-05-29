-- Phase 2 initial schema (ADR-0006). Backs the Catalog (Items, Bundles),
-- their availability, and the Enquiry inbox. Bilingual fields stay inline
-- (ADR-0004); bundle membership preserves order and duplicates.

create table if not exists items (
  id                  text primary key,
  slug                text unique not null,
  name                text not null,
  name_chinese        text not null,
  category            text not null
                        check (category in ('shelter','furniture','kitchen','lighting','bedding','other')),
  daily_price         integer not null check (daily_price >= 0), -- TWD per night
  description         text not null,
  description_chinese text not null,
  images              jsonb not null default '[]'::jsonb,        -- string[]
  specs               jsonb not null default '[]'::jsonb,        -- { label, value }[]
  featured            boolean not null default false,
  available           boolean not null default true,
  created_at          timestamptz not null default now()
);

create table if not exists bundles (
  id             text primary key,
  slug           text unique not null,
  name           text not null,
  name_chinese   text not null,
  tier           text not null check (tier in ('solo','standard','deluxe')),
  tagline        text not null,
  description    text not null,
  bundle_price   integer not null check (bundle_price >= 0),     -- TWD per Weekend
  original_price integer not null check (original_price >= 0),
  images         jsonb not null default '[]'::jsonb,
  featured       boolean not null default false,
  available      boolean not null default true,
  created_at     timestamptz not null default now()
);

-- A Bundle's member Items, ordered. position is part of the key so the same
-- Item can appear more than once (e.g. Camp Set lists a chair twice).
create table if not exists bundle_items (
  bundle_id text not null references bundles(id) on delete cascade,
  position  integer not null,
  item_id   text not null references items(id) on delete restrict,
  primary key (bundle_id, position)
);

create type enquiry_status as enum ('new','confirmed','fulfilled','cancelled');

create table if not exists enquiries (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  phone      text,
  notes      text,
  check_in   date not null,
  check_out  date not null,
  nights     integer not null,
  total      integer not null,                                   -- TWD
  items      jsonb not null,                                     -- EnquiryItem[]
  status     enquiry_status not null default 'new',
  created_at timestamptz not null default now()
);

create index if not exists items_available_idx   on items (available);
create index if not exists bundles_available_idx  on bundles (available);
create index if not exists enquiries_status_idx   on enquiries (status, created_at desc);
