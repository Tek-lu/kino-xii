import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getFeatured, getMovie } from '../../api/movies'
import AgeBadge from '../ui/AgeBadge'
import Skeleton from '../ui/Skeleton'
import ErrorState from '../ui/ErrorState'

const INTERVAL = 7000

export default function Hero() {
  const [i, setI] = useState(0)
  const { data: films = [], isPending, isError, refetch } = useQuery({
    queryKey: ['movies', 'featured'],
    queryFn: getFeatured,
  })
  const count = films.length
  const film = films[i]

  const { data: detail } = useQuery({
    queryKey: ['movie', film?.slug],
    queryFn: () => getMovie(film.slug),
    enabled: !!film,
  })

  // Auto-advance; restarts whenever the slide changes (also on manual clicks)
  useEffect(() => {
    if (count < 2) return
    const id = setTimeout(() => setI((n) => (n + 1) % count), INTERVAL)
    return () => clearTimeout(id)
  }, [i, count])

  if (isPending) return <Skeleton className="h-[720px] w-full rounded-none" />
  if (isError) return <div className="pt-32"><ErrorState message="Couldn't load featured films." onRetry={refetch} /></div>
  if (!film) return null

  const go = (n) => setI((n + count) % count)

  return (
    <section className="relative h-[720px] overflow-hidden">
      {films.map((f, idx) => (
        <img
          key={f.id}
          src={f.backdropUrl}
          alt=""
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            idx === i ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-bg-darkest via-bg-darkest/30 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-bg-darkest/80 to-transparent" />

      <div className="container-page absolute inset-x-0 bottom-28">
        <h1 className="max-w-[700px] text-[48px] font-extrabold uppercase leading-[1.1]">{film.title}</h1>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <AgeBadge rating={film.ageRating} />
          <span className="rounded bg-tint-white px-2 py-0.5 text-[12px] font-semibold">
            {film.runtimeMinutes} min
          </span>
          {film.formats.map((f) => (
            <span key={f.id} className="rounded bg-tint-white px-2 py-0.5 text-[12px] font-semibold uppercase">
              {f.name}
            </span>
          ))}
        </div>

        <p className="mt-4 line-clamp-3 max-w-[560px] min-h-[60px] text-[16px] font-normal leading-[1.3] text-tx-white/90">
          {detail?.synopsis}
        </p>

        <div className="mt-6 flex gap-3">
          <Link to={`/movies/${film.slug}`} className="rounded-full bg-hc-red px-6 py-3 text-[12px] font-semibold">
            Buy tickets
          </Link>
          <Link to="/sessions" className="rounded-full bg-tint-white px-6 py-3 text-[12px] font-semibold">
            All sessions
          </Link>
        </div>
      </div>

      {count > 1 && (
        <div className="container-page absolute inset-x-0 bottom-8 flex items-center gap-4">
          <div className="flex flex-1 gap-3">
            {films.map((f, idx) => (
              <button
                key={f.id}
                onClick={() => setI(idx)}
                aria-label={`Show ${f.title}`}
                className={`h-[3px] flex-1 rounded-full transition-colors ${
                  idx === i ? 'bg-hc-red' : 'bg-tint-white'
                }`}
              />
            ))}
          </div>
          <button onClick={() => go(i - 1)} aria-label="Previous" className="grid h-9 w-9 place-items-center rounded-full bg-tint-white">‹</button>
          <button onClick={() => go(i + 1)} aria-label="Next" className="grid h-9 w-9 place-items-center rounded-full bg-tint-white">›</button>
        </div>
      )}
    </section>
  )
}