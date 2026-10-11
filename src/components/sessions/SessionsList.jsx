import MovieSessionRow from './MovieSessionRow'
import Skeleton from '../ui/Skeleton'
import ErrorState from '../ui/ErrorState'
import EmptyState from '../ui/EmptyState'

export default function SessionsList({ query, onClear }) {
  const { data, isPending, isError, refetch } = query

  if (isPending) {
    return (
      <div className="flex flex-col gap-y-[2rem]">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-[12rem] w-full" />
        ))}
      </div>
    )
  }
  if (isError) return <ErrorState message="Couldn't load sessions." onRetry={refetch} />

  if (data.data.length === 0) {
    return (
      <EmptyState
        title="No sessions found"
        text="Nothing matches these filters. Try removing some."
        action={
          <button
            type="button"
            onClick={onClear}
            className="rounded-full bg-hc-red px-[1.25rem] py-[0.625rem] text-[0.75rem] font-semibold"
          >
            Clear filters
          </button>
        }
      />
    )
  }

  return (
    <div className="flex flex-col gap-y-[2rem]">
      {data.data.map((g) => (
        <MovieSessionRow key={g.movie.id} group={g} />
      ))}
    </div>
  )
}