import { Link } from 'react-router-dom'
import AgeBadge from '../ui/AgeBadge'

export default function MovieCard({ movie }) {
  return (
    <article className="flex w-[290px] shrink-0 flex-col gap-4 rounded-2xl bg-bg-medium p-4">
      <Link to={`/movies/${movie.slug}`}>
        <img
          src={movie.posterUrl}
          alt={movie.title}
          loading="lazy"
          className="aspect-[2/3] w-full rounded-xl object-cover"
        />
      </Link>
      <div>
        <h3 className="truncate text-[16px] font-semibold">{movie.title}</h3>
        <p className="mt-1 truncate text-[12px] font-normal text-tx-gray">
          {movie.genres[0]?.name} · {movie.runtimeMinutes} min
        </p>
        <div className="mt-2">
          <AgeBadge rating={movie.ageRating} />
        </div>
        
      </div>
      <div className="mt-auto flex items-center justify-between">
        <span className="text-[12px] text-tx-gray">From ₾{movie.fromPrice}</span>
        <Link
          to={`/movies/${movie.slug}`}
          className="rounded-full bg-hc-red px-4 py-2 text-[12px] font-semibold"
        >
          Buy Ticket
        </Link>
      </div>
    </article>
  )
}