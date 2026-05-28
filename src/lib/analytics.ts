// Provider-agnostic analytics seam. Call sites emit typed events via track();
// where they go is decided by the registered sink. Without a provider the
// default sink logs in development and forwards to a window queue if one exists
// (e.g. GTM/GA dataLayer) — so adding a provider later needs no call-site edits
// (ADR-0005).

export type AnalyticsEvent =
  | { name: "page_view"; path: string }
  | { name: "booking_item_added"; itemType: "item" | "bundle"; id: string }
  | { name: "enquiry_submitted"; items: number; total: number; nights: number }
  | { name: "enquiry_succeeded"; delivered: "sent" | "skipped" }
  | { name: "enquiry_failed"; reason: "validation" | "server" | "network" };

export type AnalyticsSink = (event: AnalyticsEvent) => void;

const defaultSink: AnalyticsSink = (event) => {
  if (typeof window !== "undefined") {
    const w = window as Window & { dataLayer?: unknown[] };
    w.dataLayer?.push(event);
  }
  if (process.env.NODE_ENV === "development") {
    console.debug("[analytics]", event.name, event);
  }
};

let sink: AnalyticsSink = defaultSink;

// Swap the destination for analytics events. Pass null to restore the default.
export function setAnalyticsSink(next: AnalyticsSink | null): void {
  sink = next ?? defaultSink;
}

export function track(event: AnalyticsEvent): void {
  sink(event);
}
