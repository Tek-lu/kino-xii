import { useMutation, useQueryClient } from '@tanstack/react-query'
import { notifyMovie } from '../../api/movies'
import { useAuth } from '../../hooks/useAuth'
import AgeBadge from '../ui/AgeBadge'

const fmt = (iso) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' }).toUpperCase()

export default function ComingSoonCard({ movie }) {
  const { requireAuth } = useAuth()
  const qc = useQueryClient()
  const notify = useMutation({
    mutationFn: () => notifyMovie(movie.slug),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['movies', 'coming-soon'] }), // server is the truth
  })

  const done = movie.isNotified

  return (
    <article className="flex w-[480px] shrink-0 gap-4 rounded-2xl bg-bg-medium p-3">
      <img
        src={movie.posterUrl}
        alt={movie.title}
        loading="lazy"
        className="h-[140px] w-[100px] rounded-xl object-cover"
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <p className="text-[10px] font-semibold text-hc-red">IN CINEMAS {fmt(movie.releaseDate)}</p>
        <h3 className="mt-1 truncate text-[16px] font-semibold">{movie.title}</h3>
        <p className="mt-1 truncate text-[12px] text-tx-gray">
          {movie.genres[0]?.name} · {movie.runtimeMinutes} min
        </p>
        <div className="mt-2">
          <AgeBadge rating={movie.ageRating} />
        </div>
        <button
          disabled={done || notify.isPending}
          onClick={() => requireAuth(() => notify.mutate())}
          className="mt-auto flex w-fit items-center gap-2 rounded-full bg-tint-white px-4 py-2 text-[12px] font-semibold transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {done ? 'Notified ✓' : notify.isPending ? 'Saving…' : 'Notify Me'}
        </button>
      </div>
    </article>
  )
}