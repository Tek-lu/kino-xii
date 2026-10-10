import { useQuery } from '@tanstack/react-query'
import { getNowPlaying } from '../../api/movies'
import Section from './Section'
import MovieCard from './MovieCard'
import Skeleton from '../ui/Skeleton'
import ErrorState from '../ui/ErrorState'
import EmptyState from '../ui/EmptyState'

export default function NowPlaying() {
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ['movies', 'now-playing', 12],
    queryFn: () => getNowPlaying(12),
  })

  return (
    <Section title="Now Playing" to="/sessions" >
      {isPending && (
        <div className="flex gap-6 overflow-hidden">
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className="h-[28.25rem] w-[16.25rem] shrink-0" />
          ))}
        </div>
      )}
      {isError && <ErrorState message="Couldn't load films." onRetry={refetch} />}
      {data?.length === 0 && <EmptyState title="Nothing is playing right now" text="Check back soon." />}
      {data?.length > 0 && (
        <div className="relative">
          <div className="no-scrollbar flex gap-4 overflow-x-auto">
            {data.map((m) => (
              <MovieCard key={m.id} movie={m} />
            ))}
          </div>
            
          {/* fade on the right edge */}
          <div className="pointer-events-none absolute inset-y-0 right-0 w-[10rem] bg-gradient-to-l from-bg-darkest to-transparent" />
        </div>
      )}
    </Section>
  )
}