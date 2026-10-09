export default function AgeBadge({ rating, className = "" }) {
  if (!rating) return null;

  return (
    <span
      title={rating.description}
      className={`inline-flex items-center justify-center rounded-full bg-tint-pink text-[12px] font-semibold text-hc-red ${className}`}
    >
      {rating.code}
    </span>
  );
}