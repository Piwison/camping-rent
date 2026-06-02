-- Phase 3, slice 3.3 (ADR-0011): online deposits via ECPay.
--
-- A Booking can take a deposit to secure the Weekend; the balance is still
-- settled offline with the Vendor. Each checkout is a payments row keyed by the
-- ECPay MerchantTradeNo; the Enquiry tracks a coarse payment_status for display.

create type payment_status as enum ('unpaid', 'deposit_paid', 'paid', 'refunded');

alter table enquiries
  add column if not exists payment_status payment_status not null default 'unpaid',
  add column if not exists deposit_amount integer;

create table if not exists payments (
  id                uuid primary key default gen_random_uuid(),
  enquiry_id        uuid references enquiries (id) on delete cascade,
  merchant_trade_no text not null unique,
  provider          text not null default 'ecpay',
  amount            integer not null,                 -- TWD charged (the deposit)
  status            text not null default 'pending',  -- pending | paid | failed
  raw               jsonb,                            -- gateway callback payload
  created_at        timestamptz not null default now(),
  paid_at           timestamptz
);

create index if not exists payments_enquiry_idx on payments (enquiry_id);

-- Same deny-all posture as the rest of the schema; only the service-role key
-- (server-side) touches payments.
alter table payments enable row level security;
