import { money } from '../../utils/booking'
import AgeBadge from '../ui/AgeBadge'

const shortDate = (d) =>
  d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }).replace(',', '')

const hhmm = (d) => d.toTimeString().slice(0, 5)

function Info({ label, children }) {
  return (
    <div className="flex flex-col gap-[0.25rem]">
      <span className="text-[0.625rem] font-semibold uppercase text-tx-gray">{label}</span>
      <span className="text-[0.75rem] font-semibold">{children}</span>
    </div>
  )
}

export default function TicketCard({ order, onRefund }) {
  const { session: s, tickets } = order
  const start = new Date(`${s.date}T${s.time}:00`)
  const cutoff = new Date(start.getTime() - 2 * 60 * 60 * 1000) // display only; the button obeys isRefundable
  const refunded = order.status === 'refunded'

  return (
    <article className="flex overflow-hidden rounded-[1.5rem] bg-bg-medium">
      <div className="flex flex-1 gap-[1.5rem] p-[1.5rem]">
        <img
          src={s.movie.posterUrl}
          alt={s.movie.title}
          className="h-[7.5rem] w-[5.5rem] shrink-0 rounded-[0.5rem] object-cover"
        />
        <div className="flex min-w-0 flex-col gap-[0.75rem]">
          <div className="flex items-center gap-[0.75rem]">
            <h3 className="text-[1.25rem] font-extrabold">{s.movie.title}</h3>
            <AgeBadge rating={s.movie.ageRating} />
            <span className="text-[0.75rem] text-tx-gray">{s.movie.runtimeMinutes} min</span>
          </div>
          <div className="flex gap-[2.5rem]">
            <Info label="Date">{shortDate(start)} · {s.time}</Info>
            <Info label="Venue">{s.venue.name} · Hall {s.hall.name}</Info>
            <Info label="Format">{s.format.name} · {s.language.name}</Info>
          </div>
          <div className="flex flex-wrap items-center gap-[0.5rem]">
            <span className="text-[0.625rem] font-semibold uppercase text-tx-gray">Seats</span>
            {tickets.map((t) => (
              <span key={t.id} className="rounded-[0.375rem] bg-bg-brighter px-[0.5rem] py-[0.25rem] text-[0.625rem] font-semibold">
                {t.seatCode} · {t.ticketType.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex w-[19rem] shrink-0 flex-col gap-[0.75rem] border-l border-dashed border-tx-blue p-[1.5rem]">
        <div>
          <p className="text-[0.625rem] font-semibold uppercase text-tx-gray">Order</p>
          <p className="text-[0.75rem] font-semibold">#{order.reference}</p>
        </div>
        <div className="flex items-end justify-between">
          <span className="text-[0.75rem] text-tx-gray">Total paid</span>
          <span className="text-[1.5rem] font-extrabold">{money(order.totalPrice)}</span>
        </div>

        {refunded && (
          <p className="rounded-full bg-tint-pink py-[0.5rem] text-center text-[0.75rem] font-semibold text-hc-red">
            Refunded
          </p>
        )}

        {onRefund && !refunded && (
          <>
            <button
              type="button"
              disabled={!order.isRefundable}
              title={order.isRefundable ? undefined : 'Refunds close 2 hours before the session starts'}
              onClick={() => onRefund(order)}
              className="rounded-full bg-bg-brighter py-[0.5rem] text-[0.75rem] font-semibold transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              Refund
            </button>
            <p className="text-center text-[0.625rem] text-tx-gray">
              {order.isRefundable
                ? `Refundable until ${hhmm(cutoff)}, ${shortDate(cutoff)}`
                : 'Refunds closed 2 hours before the session'}
            </p>
          </>
        )}
      </div>
    </article>
  )
}