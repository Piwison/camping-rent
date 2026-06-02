-- Phase 3, slice 3.2 (ADR-0010): Customer accounts & booking history.
--
-- Enquiries submitted by a signed-in Customer carry their auth user id, so the
-- account area can list "my bookings". Guest bookings (no account) leave it
-- null and keep working exactly as before.

alter table enquiries
  add column if not exists user_id uuid references auth.users (id) on delete set null;

create index if not exists enquiries_user_idx on enquiries (user_id, created_at desc);
