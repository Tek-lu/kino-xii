import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTickets } from '../../hooks/useTickets'
import TicketCard from './TicketCard'
import RefundModal from './RefundModal'
import Skeleton from '../ui/Skeleton'
import ErrorState from '../ui/ErrorState'
import EmptyState from '../ui/EmptyState'

export default function TicketsTab() {
  const [sub, setSub] = useState('upcoming')
  const [refunding, setRefunding] = useState(null)
  const upcoming = useTickets('upcoming')
  const past = useTickets('past')
  const active = sub === 'upcoming' ? upcoming : past

  const pills = [
    { id: 'upcoming', label: 'Upcoming', count: upcoming.data?.length },
    { id: 'past', label: 'Past', count: past.data?.length },
  ]

  return (
    <div className="flex flex-col gap-[1.5rem] pt-[0.5rem]">
      <div className="flex w-fit gap-[0.25rem] rounded-[0.75rem] bg-bg-medium p-[0.25rem]">
        {pills.map((p) => (
          <button
            key={p.id}
            type="button"
            aria-pressed={sub === p.id}
            onClick={() => setSub(p.id)}
            className={`flex items-center gap-[0.5rem] rounded-[0.5rem] px-[0.875rem] py-[0.5rem] text-[0.75rem] font-semibold ${
              sub === p.id ? 'bg-bg-brighter text-tx-white' : 'text-tx-gray'
            }`}
          >
            {p.label}
            {p.count != null && <span className="text-[0.625rem] text-tx-gray">{p.count}</span>}
          </button>
        ))}
      </div>

      {active.isPending && (
        <div className="flex flex-col gap-[1rem]">
          <Skeleton className="h-[10rem]" />
          <Skeleton className="h-[10rem]" />
        </div>
      )}
      {active.isError && <ErrorState message="Couldn't load your tickets." onRetry={active.refetch} />}
      {active.data?.length === 0 && (
        <EmptyState
          title={sub === 'upcoming' ? 'No upcoming tickets' : 'No past tickets'}
          text={sub === 'upcoming' ? 'Book a session and it will show up here.' : 'Tickets for finished or refunded sessions appear here.'}
          action={
            sub === 'upcoming' && (
              <Link to="/sessions" className="rounded-full bg-hc-red px-[1.25rem] py-[0.625rem] text-[0.75rem] font-semibold">
                Browse sessions
              </Link>
            )
          }
        />
      )}
      {active.data?.length > 0 && (
        <div className="flex flex-col gap-[1rem]">
          {active.data.map((o) => (
            <TicketCard key={o.id} order={o} onRefund={sub === 'upcoming' ? setRefunding : undefined} />
          ))}
        </div>
      )}

      {refunding && <RefundModal order={refunding} onClose={() => setRefunding(null)} />}
    </div>
  )
}