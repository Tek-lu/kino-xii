import { useMutation, useQueryClient } from '@tanstack/react-query'
import { notifyMovie } from '../../api/movies'
import { useAuth } from '../../hooks/useAuth'
import AgeBadge from '../ui/AgeBadge'
import BellLogo from '../../assets/bell.svg'

const fmt = (iso) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' }).toUpperCase()

export default function ComingSoonCard({ movie }) {
  const { requireAuth } = useAuth()
  const qc = useQueryClient()
  const notify = useMutation({
    mutationFn: () => notifyMovie(movie.slug),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['movies', 'coming-soon'] }), 
  })

  const done = movie.isNotified

  return (
    <article className="flex w-[29.375rem] h-[10rem] shrink-0 gap-4 rounded-[1.25rem] bg-bg-medium p-3">
      <img
        src={movie.posterUrl}
        alt={movie.title}
        loading="lazy"
        className="h-[8.5] w-[14.3rem] rounded-[14px] object-cover"
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <p className="text-3 font-semibold text-hc-red">IN CINEMAS {fmt(movie.releaseDate)}</p>
        <h3 className=" truncate text-3 font-semibold">{movie.title}</h3>
        <p className=" truncate text-[12px] text-tx-gray">
          {movie.genres[0]?.name} · {movie.runtimeMinutes} min
        </p>
        <div className="mt-2">
          <AgeBadge className="h-[1.3rem] w-[2.4rem] px-[0.625rem] py-[0.3125rem]" rating={movie.ageRating} />
        </div>
        <button
          disabled={done || notify.isPending}
          onClick={() => requireAuth(() => notify.mutate())}
          className="mt-auto flex w-fit items-center gap-2 rounded-full border-tx-gray border px-3 py-2 text-[12px] font-semibold transition-opacity hover:opacity-90 disabled:opacity-60"
        >


                {done ? 'Notified' : notify.isPending ? 'Saving…' : <><img src={BellLogo} alt="" aria-hidden="true" className="h-[0.75rem] w-[0.75rem] mt-[3.5px]"/> 'Notify Me'</>}

        </button>
      </div>
    </article>
  )
}