-- Lock down the public REST API. The app reaches these tables only server-side
-- with the service-role key (which bypasses RLS); the browser uses the anon key
-- for Auth only. Enabling RLS with no policies denies anon/authenticated access
-- entirely, so the publicly-shipped anon key cannot read enquiries (PII) or
-- modify the Catalog.

alter table items        enable row level security;
alter table bundles      enable row level security;
alter table bundle_items enable row level security;
alter table enquiries    enable row level security;
