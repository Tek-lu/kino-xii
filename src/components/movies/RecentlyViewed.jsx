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
      <div className="no-scrollbar flex gap-[1.5rem] overflow-x-auto">
        {items.map((m) => (
          <Link
            key={m.id}
            to={`/movies/${m.slug}`}
            className="flex w-[22rem] shrink-0 items-center gap-[1rem] rounded-[1rem] bg-bg-medium p-[0.75rem] transition-opacity hover:opacity-90"
          >
            <img
              src={m.posterUrl}
              alt={m.title}
              className="h-[5rem] w-[3.75rem] rounded-[0.5rem] object-cover"
            />
            <div className="min-w-0">
              <h3 className="truncate text-[0.75rem] font-extrabold uppercase">{m.title}</h3>
              <p className="mt-[0.25rem] truncate text-[0.625rem] text-tx-gray">
                {m.genre} · {m.runtimeMinutes} min
              </p>
              <div className="mt-[0.5rem]">
                <AgeBadge rating={m.ageRating} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </Section>
  )
}