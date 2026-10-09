import AgeBadge from '../ui/AgeBadge'
import TimerLogo from '../../assets/timer.svg'
export default function MovieHero({ movie }) {
  return (
    <section className="relative h-[36rem] overflow-hidden">
      <img src={movie.backdropUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-bg-darkest via-bg-darkest/30 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-bg-darkest/80 to-transparent" />

      <div className="container-page absolute inset-x-0 bottom-[2.5rem] flex items-end mb-[2.56rem] gap-[2.125rem]">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="h-[23.375rem] w-[18.1rem] shrink-0 rounded-[0.875rem] object-cover"
        />
        <div className="flex flex-col items-start gap-[1rem] pb-[0.5rem]">
          <span className="rounded-full bg-tint-pink px-[0.625rem] py-[0.375rem] text-[0.75rem] font-semibold uppercase text-hc-red">
            {movie.isComingSoon ? 'Coming soon' : 'Now playing'}
          </span>
          <h1 className="max-w-[44rem] text-[2.5rem] font-extrabold uppercase leading-[1.1]">
            {movie.title}
          </h1>
          <p className="max-w-[35rem] text-[0.875rem] font-normal leading-[1.3] text-tx-white">
            {movie.synopsis}
          </p>
          <div className="flex flex-wrap items-center gap-[0.5rem]">
            <AgeBadge className="h-[1.5625rem] w-[2.625rem] px-[0.625rem] py-[0.3125rem]" rating={movie.ageRating} />
            <span className="rounded-full bg-tint-white px-[0.625rem] py-[0.3125rem] text-[0.75rem] font-semibold flex">
                <img src={TimerLogo} alt="" aria-hidden="true" className="h-[0.75rem] w-[0.75rem] mt-[3.5px]"/>

              {movie.runtimeMinutes} Min
            </span>
            {movie.genres.map((g) => (
              <span key={g.id} className="rounded-full bg-tint-white px-[0.625rem] py-[0.3125rem] text-[0.75rem] font-semibold">
                {g.name}
              </span>
            ))}
            {movie.formats.map((f) => (
              <span key={f.id} className="rounded-full bg-tint-white px-[0.625rem] py-[0.3125rem] text-[0.75rem] font-semibold uppercase">
                {f.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}