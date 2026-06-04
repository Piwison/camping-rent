import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Curated stock for the marketing imagery (hero, about).
      { protocol: "https", hostname: "images.unsplash.com" },
      // Placeholder source still used by seeded Catalog photos until the Vendor
      // uploads real product shots via the dashboard.
      { protocol: "https", hostname: "picsum.photos" },
    ],
  },
};

export default nextConfig;
