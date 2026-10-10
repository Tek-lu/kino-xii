import { useQuery } from '@tanstack/react-query'
import { getComingSoon } from '../../api/movies'
import Section from './Section'
import ComingSoonCard from './ComingSoonCard'
import Skeleton from '../ui/Skeleton'
import ErrorState from '../ui/ErrorState'
import EmptyState from '../ui/EmptyState'

export default function ComingSoon() {
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ['movies', 'coming-soon'],
    queryFn: getComingSoon,
  })

  return (
    <Section title="Coming Soon...">
      {isPending && (
        <div className="flex gap-6 overflow-hidden">
          {Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={i} className="h-[164px] w-[480px] shrink-0" />
          ))}
        </div>
      )}
      {isError && <ErrorState message="Couldn't load upcoming films." onRetry={refetch} />}
      {data?.length === 0 && <EmptyState title="No upcoming releases yet" />}
      {data?.length > 0 && (
        <div className='relative'>
          <div className="no-scrollbar flex gap-6 overflow-x-auto">          
            {data.map((m) => (
            <ComingSoonCard key={m.id} movie={m} />
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-[10rem] bg-gradient-to-l from-bg-darkest to-transparent" />

        </div>
       )}  
    </Section>
  )
}