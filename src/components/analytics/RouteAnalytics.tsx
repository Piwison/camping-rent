"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { track } from "@/lib/analytics";

// Emits a page_view whenever the App Router path changes.
export default function RouteAnalytics() {
  const pathname = usePathname();
  useEffect(() => {
    track({ name: "page_view", path: pathname });
  }, [pathname]);
  return null;
}
