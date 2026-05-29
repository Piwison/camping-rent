import AboutClient from "@/components/about/AboutClient";
import { pageMeta } from "@/lib/site";

export const metadata = pageMeta({
  title: "About",
  description:
    "The story behind Basecamp & Co. — Taiwan's premium camping gear rental service for the glamping generation.",
  path: "/about",
});

export default function AboutPage() {
  return <AboutClient />;
}
