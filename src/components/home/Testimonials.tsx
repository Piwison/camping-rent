import Stars from "@/components/reviews/Stars";
import type { Review } from "@/lib/reviews";

// Experience reviews as a testimonial band. Server component — the home page
// passes the reviews in. Renders nothing until there are any, so the page is
// unchanged on a fresh install.
export default function Testimonials({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) return null;

  return (
    <section className="py-24 px-6 lg:px-10 max-w-7xl mx-auto">
      <div className="mb-14">
        <p className="text-xs tracking-[0.2em] uppercase text-[#7A6B54] mb-2">
          真實評價 · From the Field
        </p>
        <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-[#1E1C18]">
          Weekends, <span className="italic text-[#9C8B6E]">well spent.</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {reviews.slice(0, 6).map((r) => (
          <figure key={r.id} className="border border-[#EAE5D8] bg-white p-6 flex flex-col gap-3">
            <Stars value={r.rating} />
            {r.title && <figcaption className="font-medium text-[#1E1C18]">{r.title}</figcaption>}
            {r.body && (
              <blockquote className="text-sm text-[#5C5850] leading-relaxed">
                “{r.body}”
              </blockquote>
            )}
            <p className="text-xs text-[#7A6B54] mt-auto pt-2">— {r.authorName}</p>
          </figure>
        ))}
      </div>
    </section>
  );
}
