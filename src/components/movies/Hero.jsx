import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getFeatured, getMovie } from '../../api/movies'
import AgeBadge from '../ui/AgeBadge'
import Skeleton from '../ui/Skeleton'
import ErrorState from '../ui/ErrorState'
import TimerLogo from '../../assets/timer.svg'
import TicketLogo from '../../assets/ticket.svg'

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
    <section className="relative h-[47.5rem] overflow-hidden">
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
        <h1 className="text-[2.5rem] font-extrabold uppercase leading-[1.1]">{film.title}</h1>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <AgeBadge className='h-[1.7rem] w-[2.875rem] px-3 py-0.6' rating={film.ageRating} />
          <span className="rounded-full bg-tint-white px-[0.625rem] py-[0.3125rem] text-[0.75rem] font-semibold flex">
                <img src={TimerLogo} alt="" aria-hidden="true" className="h-[0.75rem] w-[0.75rem] mt-[3.5px]"/>

              {film.runtimeMinutes} Min
          </span>
          {film.formats.map((f) => (
            <span key={f.id} className="rounded-full bg-tint-white px-[0.625rem] py-[0.3125rem] text-[0.75rem] font-semibold uppercase">
              {f.name}
            </span>
          ))}
        </div>

        <p className="mt-4 line-clamp-3 max-w-[560px] min-h-[60px] text-[1rem] font-normal leading-[1.3] text-tx-white">
          {detail?.synopsis}
        </p>

        <div className="mt-6 flex gap-3">
          <Link to={`/movies/${film.slug}`} className="rounded-full bg-hc-red px-[1.375rem] py-[0.812rem] text-[14px] font-extrabold flex gap-1">
          <img src={TicketLogo} alt="" aria-hidden="true" className="h-[1rem] w-[1rem] "/>

            Buy tickets
          </Link>
          <Link to="/sessions" className="rounded-full bg-tint-white px-[1.375rem] py-[0.812rem] text-[14px] font-extrabold">
            All sessions
          </Link>
        </div>
      </div>

      {count > 1 && (
        <div className="container-page absolute inset-x-0 bottom-[2rem] flex items-center gap-4">
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