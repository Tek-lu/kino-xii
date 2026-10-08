function getPageNumbers(current, last) {
  if (last <= 5) {
    return Array.from({ length: last }, (_, i) => i + 1)
  }
  if (current <= 3) {
    return [1, 2, 3, '...', last]
  }
  if (current >= last - 2) {
    return [1, '...', last - 2, last - 1, last]
  }
  return [1, '...', current, '...', last]
}

export default function Pagination({ filters, lastPage }) {
  const current = filters.page

  if (!lastPage || lastPage <= 1) return null

  const goTo = (page) => {
    if (page < 1 || page > lastPage || page === current) return
    filters.update({ page })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <nav
      aria-label="Pagination"
      className="mt-[3.25rem] flex select-none items-center justify-center gap-[0.5rem]"
    >
      <button
        type="button"
        aria-label="Previous page"
        disabled={current === 1}
        onClick={() => goTo(current - 1)}
        className="flex h-[2rem] w-[2rem] items-center justify-center rounded-full bg-bg-medium text-[0.875rem] transition-opacity hover:opacity-80 disabled:opacity-30"
      >
        ‹
      </button>

      {getPageNumbers(current, lastPage).map((page, index) => {
        if (page === '...') {
          return (
            <span
              key={`ellipsis-${index}`}
              className="flex h-[2rem] w-[2rem] items-center justify-center text-[0.75rem] text-tx-gray"
            >
              ...
            </span>
          )
        }

        const isActive = page === current

        return (
          <button
            key={page}
            type="button"
            aria-current={isActive ? 'page' : undefined}
            onClick={() => goTo(page)}
            className={`flex h-[2rem] w-[2rem] items-center justify-center rounded-full text-[0.75rem] font-semibold transition-colors ${
              isActive ? 'bg-hc-red text-tx-white' : 'text-tx-gray hover:bg-bg-medium'
            }`}
          >
            {page}
          </button>
        )
      })}

      <button
        type="button"
        aria-label="Next page"
        disabled={current === lastPage}
        onClick={() => goTo(current + 1)}
        className="flex h-[2rem] w-[2rem] items-center justify-center rounded-full bg-bg-medium text-[0.875rem] transition-opacity hover:opacity-80 disabled:opacity-30"
      >
        ›
      </button>
    </nav>
  )
}