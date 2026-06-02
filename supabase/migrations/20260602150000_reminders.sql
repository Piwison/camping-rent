-- Phase 3, slice 3.4 (ADR-0012): automated reminders.
--
-- Tracks when a pre-trip reminder went out so the cron job never sends twice.

alter table enquiries add column if not exists reminded_at timestamptz;

-- The reminder sweep looks for confirmed, not-yet-reminded, upcoming bookings.
create index if not exists enquiries_reminder_idx
  on enquiries (status, check_in)
  where reminded_at is null;
