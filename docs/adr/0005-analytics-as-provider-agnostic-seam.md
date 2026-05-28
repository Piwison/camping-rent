# Analytics goes through a provider-agnostic seam

Analytics is emitted as typed events through `track()` in `src/lib/analytics.ts`,
not by calling a vendor SDK at each call site. The destination is a swappable
sink: the default logs in development and forwards to a `window` queue
(GTM/GA `dataLayer`) if one exists; in production with no provider it is a no-op.

This mirrors the **Enquiry** sink (ADR-0003): the MVP ships instrumentation
(page views + the enquiry funnel) without committing to a vendor, and a provider
can be added later by registering a sink — no call-site edits.

## Consequences

- No analytics data is collected until a provider is wired up; until then the
  default sink only logs in dev / pushes to `dataLayer` if present.
- The event vocabulary lives in one typed union (`AnalyticsEvent`); adding an
  event is a one-line change there plus the call site.
