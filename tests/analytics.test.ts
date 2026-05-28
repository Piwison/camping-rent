import { describe, it, expect, afterEach } from "vitest";
import { track, setAnalyticsSink, type AnalyticsEvent } from "@/lib/analytics";

afterEach(() => setAnalyticsSink(null));

describe("analytics seam", () => {
  it("forwards tracked events to the registered sink in order", () => {
    const seen: AnalyticsEvent[] = [];
    setAnalyticsSink((e) => seen.push(e));

    track({ name: "enquiry_submitted", items: 2, total: 4800, nights: 2 });
    track({ name: "enquiry_succeeded", delivered: "sent" });

    expect(seen.map((e) => e.name)).toEqual([
      "enquiry_submitted",
      "enquiry_succeeded",
    ]);
  });

  it("restores the default sink when set to null, without throwing", () => {
    setAnalyticsSink(() => {
      throw new Error("should have been replaced");
    });
    setAnalyticsSink(null);
    expect(() => track({ name: "page_view", path: "/gear" })).not.toThrow();
  });
});
