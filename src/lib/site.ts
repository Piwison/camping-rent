import type { Metadata } from "next";

export const siteConfig = {
  name: "Basecamp & Co.",
  title: "Basecamp & Co. — Rent Gear, Camp in Style",
  description:
    "Taiwan's premium camping gear rental service. Curated bundles and individual items delivered to your campsite. Glamping made effortless.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(
    /\/$/,
    ""
  ),
  locale: "en_US",
  altLocale: "zh_TW",
} as const;

// Builds consistent per-page metadata. The top-level `title` is short and gets
// the "%s — Basecamp & Co." template from the root layout; OpenGraph/Twitter
// titles are set explicitly since the template isn't applied to them.
export function pageMeta(opts: {
  title: string;
  description: string;
  path: string;
  image?: string;
}): Metadata {
  const fullTitle = `${opts.title} — ${siteConfig.name}`;
  const url = `${siteConfig.url}${opts.path}`;
  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical: opts.path },
    openGraph: {
      title: fullTitle,
      description: opts.description,
      url,
      ...(opts.image ? { images: [{ url: opts.image }] } : {}),
    },
    twitter: {
      title: fullTitle,
      description: opts.description,
      ...(opts.image ? { images: [opts.image] } : {}),
    },
  };
}
