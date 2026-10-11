import SessionCard from './SessionCard'
import AgeBadge from '../ui/AgeBadge'
import { useAuth } from '../../hooks/useAuth'

export default function MovieSessionRow({ group }) {
  const { movie, sessions } = group
  const { user } = useAuth()
  const ageBlocked = !!user && user.age != null && user.age < movie.ageRating.minAge
  const reason = `This film is rated ${movie.ageRating.code}. You cannot buy tickets for it with this account.`

  return (
    <div className="flex flex-col gap-y-[0.875rem] border-b border-bg-brighter pb-[1.5rem]">
      <div className="mb-[0.75rem] flex items-center gap-[1rem]">
        <img src={movie.posterUrl} alt={movie.title} className="h-[5rem] w-[3.5rem] rounded-[0.5rem] object-cover" />
        <div className="flex flex-col gap-[0.75rem]">
          <div className="flex items-center gap-[0.75rem]">
            <h2 className="text-[1.125rem] font-extrabold">{movie.title}</h2>
            <AgeBadge rating={movie.ageRating} />
          </div>
          <span className="text-[0.875rem] font-normal text-tx-gray">{movie.runtimeMinutes} min</span>
        </div>
      </div>

      <div className="no-scrollbar flex gap-[0.75rem] overflow-x-auto">
        {sessions.map((s) => (
          <SessionCard key={s.id} session={s} blocked={ageBlocked} reason={reason} />
        ))}
      </div>
    </div>
  )
}