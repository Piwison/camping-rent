// Presentational star rating — pure, no hooks, safe in server or client trees.
// Rounds to the nearest whole star for the glyphs; callers show the exact
// average as text alongside.
export default function Stars({
  value,
  className = "",
}: {
  value: number;
  className?: string;
}) {
  const filled = Math.round(value);
  return (
    <span className={`inline-flex ${className}`} aria-hidden="true">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= filled ? "text-[#9C8B6E]" : "text-[#DDD6C1]"}>
          ★
        </span>
      ))}
    </span>
  );
}
