import { Link } from 'react-router-dom'
import AgeBadge from '../ui/AgeBadge'

export default function MovieCard({ movie }) {
  return (
    <article className="flex h-[28.25rem] w-[16.25rem] shrink-0 flex-col gap-2 rounded-[1.25rem] bg-bg-medium p-4">
      <Link to={`/movies/${movie.slug}`}>
        <img
          src={movie.posterUrl}
          alt={movie.title}
          loading="lazy"
          className="w-[14.125rem] h-[18.75rem] w-full rounded-[14px] object-cover"
        />
      </Link>
      <div>
        <h3 className="truncate text-[18px] font-extrabold">{movie.title}</h3>
        <p className="mt-[0.4rem] truncate text-[12px] font-normal text-tx-gray">
          {movie.genres[0]?.name} · {movie.runtimeMinutes} min
        </p>
        <div className="mt-[0.4rem]">
          <AgeBadge className="h-[1.3rem] w-[2.4rem] px-[0.625rem] py-[0.3125rem]" rating={movie.ageRating} />

        </div>
        
      </div>
      <div className=" flex items-center justify-between">
        <span className="text-[12px] font-semibold text-tx-gray">From ₾{movie.fromPrice}</span>
        <Link
          to={`/movies/${movie.slug}`}
          className="rounded-full bg-hc-red px-[22px] py-[10px] text-[14px] font-extrabold"
        >
          Buy Ticket
        </Link>
      </div>
    </article>
  )
}