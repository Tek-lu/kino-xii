import { useBooking } from '../../context/bookingContext'
import { money } from '../../utils/booking'
import Skeleton from '../ui/Skeleton'
import ErrorState from '../ui/ErrorState'
import EmptyState from '../ui/EmptyState'
import TicketLogo from "../../assets/property1_ticket.svg"

function SessionTile({ s, blocked, reason }) {
  const { openBooking } = useBooking()

  return (
    <button
      type="button"
      disabled={s.isSoldOut || blocked}
      title={blocked ? reason : s.isSoldOut ? 'Sold out' : undefined}
      onClick={() => openBooking(s.id)}
      className="flex h-[81px] w-fit shrink-0 overflow-hidden rounded-xl bg-bg-darkest text-left transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
    >
      {/* Left: showtime, language, format */}
      <div className="flex w-[10rem] h-[7] shrink-0 flex-col items-center p-[1rem] justify-center gap-[0.175rem]">
        <span className="text-[1.125rem] font-extrabold leading-none text-tx-white">
          {s.time}
        </span>
        <div className="flex items-center gap-[0.5rem] text-[0.75rem] text-tx-gray">
          <span>{s.language.code}</span>
          <span className="rounded-full bg-bg-brighter px-[0.625rem] py-[0.125rem] font-semibold">
            {s.format.name}
          </span>
        </div>
      </div>

      {/* Ticket divider with cutouts */}
      <div aria-hidden className="relative w-[8px] shrink-0">
        <span className="absolute inset-y-[8px] left-1/2 -translate-x-1/2 border-l-[2px] border-dotted border-white" />
        <span className="absolute left-1/2 top-0 size-[16px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-bg-medium" />
        <span className="absolute bottom-0 left-1/2 size-[16px] -translate-x-1/2 translate-y-1/2 rounded-full bg-bg-medium" />
      </div>

      {/* Right: price and seats left */}
      <div className="flex  w-[6rem] h-[7]shrink-0 flex-col items-center justify-center gap-[0.175rem]">
        <span className="text-[1.25rem] font-extrabold leading-none text-hc-red">
          {money(s.price)}
        </span>
        <span className="flex items-center gap-[0.25rem] text-[0.75rem] text-tx-gray">
          <img src={TicketLogo} alt="" className='h-3 w-3'/>
          {s.isSoldOut ? 'Sold out' : `${s.seatsLeft} left`}
        </span>
      </div>
    </button>
  )
}

// group one venue's sessions by hall name
const byHall = (sessions) =>
  Object.values(
    sessions.reduce((acc, s) => {
      ;(acc[s.hall.name] ??= { name: s.hall.name, items: [] }).items.push(s)
      return acc
    }, {}),
  )

export default function MovieSessions({ query, blocked, reason }) {
  const { data, isPending, isError, refetch } = query

  if (isPending) {
    return (
      <div className="mt-[2rem] flex flex-col gap-[1rem]">
        <Skeleton className="h-[8rem] w-full" />
        <Skeleton className="h-[8rem] w-full" />
      </div>
    )
  }
  if (isError) return <ErrorState message="Couldn't load sessions." onRetry={refetch} />
  if (data.length === 0) {
    return <EmptyState title="No sessions on this date" text="Try another day." />
  }

  return (
    <div className="mt-[2rem] flex flex-col gap-[2rem]">
      {data.map(({ venue, sessions }) => (
        <div key={venue.id}>
          <h3 className="mb-[1rem] text-[0.875rem] font-extrabold">{venue.name}</h3>
          <div className="flex flex-wrap gap-[1rem]">
            {byHall(sessions).map((hall) => (
              <div key={hall.name} className="rounded-[1.5rem] bg-bg-medium p-[1rem]">
                <p className="mb-[0.75rem] text-[0.75rem] font-semibold">Hall {hall.name}</p>
                <div className="flex flex-wrap gap-[0.75rem]">
                  {hall.items.map((s) => (
                    <SessionTile key={s.id} s={s} blocked={blocked} reason={reason} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}