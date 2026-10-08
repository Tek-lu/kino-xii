
import AgeBadge from '../ui/AgeBadge'



export default function MoviePoster({movie}){
return (
    <section className="relative h-[720px] overflow-hidden">
      
        <img
          key={movie.id}
          src={movie.backdropUrl}
          alt=""
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            idx === i ? 'opacity-100' : 'opacity-0'
          }`}
        />
     
      <div className="absolute inset-0 bg-gradient-to-t from-bg-darkest via-bg-darkest/30 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-bg-darkest/80 to-transparent" />

      <div className="container-page absolute inset-x-0 bottom-28 flex gap-[2.125rem]">
        <img
            key={movie.id}
            src={movie.posterUrl}
            alt=""
            className={`absolute inset-0 h-[23.375rem] w-[18.1rem] object-cover rounded-[0.875rem] `}
        />
        <div className='flex flex-col'>

            <p className="text-hc-red bg-tint-pink rounded-full px-[0.625rem] py-[0.375rem] text-[0.75rem] font-semibold">
                NOW PLAYING
            </p>
            <h1 className="max-w-[700px] text-[2.5rem] font-extrabold uppercase leading-[1.1]">{movie.title}</h1>
            <p className="mt-4 line-clamp-3 max-w-[560px] min-h-[60px] text-[14px] font-normal leading-[1.3] text-tx-white/90">
              {detail?.synopsis}
            </p>


            <div className="mt-5 flex flex-wrap items-center gap-2">
              <AgeBadge rating={movie.ageRating} />
              <span className="rounded bg-tint-white px-2 py-0.5 text-[12px] font-semibold">
                {movie.runtimeMinutes} min
              </span>
              {movie.formats.map((f) => (
                <span key={f.id} className="rounded bg-tint-white px-2 py-0.5 text-[12px] font-semibold uppercase">
                  {f.name}
                </span>
              ))}
            </div>
        </div>
      
        

        

        
      </div>

    
    </section>
  )
}