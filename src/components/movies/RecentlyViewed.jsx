import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { getRecent } from '../../utils/recent'
import Section from './Section'
import AgeBadge from '../ui/AgeBadge'

export default function RecentlyViewed() {
  const { user, booting } = useAuth()
  // re-read when the account changes (login/logout)
  const items = useMemo(() => (booting ? [] : getRecent(user?.id)), [user?.id, booting])

  if (items.length === 0) return null

  return (
    <Section title="Recently viewed">
      <div className="relative no-scrollbar flex gap-[1.25rem] overflow-x-auto">
        {items.map((m) => (
          <Link
            key={m.id}
            to={`/movies/${m.slug}`}
            className="flex w-[21rem] shrink-0 items-center gap-[0.75rem] rounded-[1rem] bg-bg-medium p-[0.75rem] transition-opacity hover:opacity-90"
          >
            <img
              src={m.posterUrl}
              alt={m.title}
              className="h-[4.2rem] w-[5.5rem] rounded-[0.5rem] object-cover"
            />
            <div className="min-w-0 mt-1">
              <h3 className="truncate text-[0.875rem] font-extrabold uppercase">{m.title}</h3>
              <p className="mt-[0.25rem] truncate text-[0.75rem] text-tx-gray">
                {m.genre} · {m.runtimeMinutes} min
              </p>
                <AgeBadge className="h-[1.3rem] w-[2.4rem] px-[0.625rem] py-[0.3125rem]" rating={m.ageRating} />

            </div>
          </Link>
        ))}
                  <div className="pointer-events-none absolute inset-y-0 right-0 w-[10rem] bg-gradient-to-l from-bg-darkest to-transparent" />

      </div>
    </Section>
  )
}