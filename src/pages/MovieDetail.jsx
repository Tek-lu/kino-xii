import { useParams } from 'react-router-dom'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getMovie, getMovieSessions, notifyMovie } from '../api/movies'
import { getNextDays } from '../utils/dates'
import { useAuth } from '../hooks/useAuth'
import MovieHero from '../components/movies/MovieHero'
import MovieDetails from '../components/movies/MovieDetails'
import DateStrip from '../components/movies/DateStrip'
import MovieSessions from '../components/movies/MovieSessions'
import Skeleton from '../components/ui/Skeleton'
import ErrorState from '../components/ui/ErrorState'
import Button from '../components/ui/Button'
import { useEffect, useState } from 'react'   
import { addRecent } from '../utils/recent'
function NotifyBlock({ movie }) {
  const { requireAuth } = useAuth()
  const qc = useQueryClient()
  const notify = useMutation({
    mutationFn: () => notifyMovie(movie.slug),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['movie', movie.slug] }),
  })
  
  return (
    <div className="mt-[1rem] flex flex-col items-start gap-[0.75rem]">
      <p className="text-[0.875rem] text-tx-gray">
        This film has no sessions yet. We can let you know when it opens.
      </p>
      <Button
        variant="ghost"
        loading={notify.isPending}
        disabled={movie.isNotified}
        onClick={() => requireAuth(() => notify.mutate())}
      >
        {movie.isNotified ? 'Notified ✓' : 'Notify Me'}
      </Button>
    </div>
  )
}

export default function MovieDetail() {
  const { slug } = useParams()
  const { user, booting } = useAuth()
  const [picked, setPicked] = useState(null) // { slug, value }
  const movieQ = useQuery({ queryKey: ['movie', slug], queryFn: () => getMovie(slug) })
  const movie = movieQ.data
  useEffect(() => {
        if (movie && !booting) addRecent(user?.id, movie)
      }, [movie, booting, user?.id])
    
  const days = getNextDays()
  const available = movie?.availableDates ?? []
  const date =
    (picked?.slug === slug ? picked.value : null) ??
    days.find((d) => available.includes(d.value))?.value ??
    days[0].value

  const sessionsQ = useQuery({
    queryKey: ['movie-sessions', slug, date],
    queryFn: () => getMovieSessions(slug, date),
    enabled: !!movie && !movie.isComingSoon,
    placeholderData: keepPreviousData,
  })
  

  if (movieQ.isPending) return <Skeleton className="h-[36rem] w-full rounded-none" />
  if (movieQ.isError) {
    return (
      <div className="container-page pt-[8rem]">
        <ErrorState
          message={movieQ.error.status === 404 ? 'Film not found.' : "Couldn't load this film."}
          onRetry={movieQ.error.status === 404 ? undefined : movieQ.refetch}
        />
      </div>
    )
  }

  const { ageRating } = movie
  const ageBlocked = !!user && user.age != null && user.age < ageRating.minAge
  const reason = `This film is rated ${ageRating.code}. You cannot buy tickets for it with this account.`

  return (
    <>
      <MovieHero movie={movie} />
      <div className="container-page mt-[2.5rem] flex justify-between gap-[4rem]">
        <section className="min-w-0 flex-1">
          <h2 className="text-[1.5rem] font-extrabold">Sessions</h2>
          {movie.isComingSoon ? (
            <NotifyBlock movie={movie} />
          ) : (
            <>
              <DateStrip
                value={date}
                enabled={available}
                onChange={(value) => setPicked({ slug, value })}
              />
              {ageBlocked && (
                <p role="alert" className="mt-[1rem] rounded-[0.5rem] bg-tint-pink px-[1rem] py-[0.75rem] text-[0.75rem] text-hc-red">
                  {reason}
                </p>
              )}
              <MovieSessions query={sessionsQ} blocked={ageBlocked} reason={reason} />
            </>
          )}
        </section>
        <MovieDetails movie={movie} />
      </div>
    </>
  )
}