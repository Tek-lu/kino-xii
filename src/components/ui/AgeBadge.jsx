export default function AgeBadge({ rating }) {
    if (!rating) return null
    return (
      <span
        title={rating.description}
        className="rounded bg-tint-pink px-2 py-0.5 text-[12px] font-semibold text-hc-red"
      >
        {rating.code}
      </span>
    )
  }