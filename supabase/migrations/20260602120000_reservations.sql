-- Phase 3, slice 3.1 (ADR-0009): real-time availability.
--
-- Each Item now carries a stock count (how many units the Vendor owns). A
-- Reservation holds N units of an Item for a date range and is linked to the
-- Enquiry/Booking it belongs to. Availability for a Weekend is the item's stock
-- minus the peak concurrent reserved units over that range (computed in
-- src/lib/availability.ts).

alter table items add column if not exists stock integer not null default 1;

create type reservation_status as enum ('held', 'confirmed', 'released');

create table if not exists reservations (
  id          uuid primary key default gen_random_uuid(),
  item_id     text not null references items (id) on delete cascade,
  enquiry_id  uuid references enquiries (id) on delete cascade,
  quantity    integer not null check (quantity > 0),
  start_date  date not null,
  end_date    date not null,
  status      reservation_status not null default 'held',
  created_at  timestamptz not null default now(),
  check (end_date > start_date)
);

-- Overlap lookups filter by item + date window; released holds drop out.
create index if not exists reservations_item_dates_idx
  on reservations (item_id, start_date, end_date)
  where status <> 'released';

create index if not exists reservations_enquiry_idx on reservations (enquiry_id);

-- Same deny-all posture as the other tables (see 20260529120100): the app only
-- reaches reservations server-side with the service-role key.
alter table reservations enable row level security;
