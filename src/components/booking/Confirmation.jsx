import Button from '../ui/Button'
import { money } from '../../utils/booking'

export default function Confirmation({ order, onClose, onTickets }) {
  const { session } = order
  return (
    <div className="mx-auto max-w-[32rem] py-[1rem] text-center">
      <div className="mx-auto grid h-[3.5rem] w-[3.5rem] place-items-center rounded-full bg-tint-green text-[1.5rem] text-hc-green">
        ✓
      </div>
      <h2 className="mt-[1rem] text-[1.5rem] font-extrabold">Order confirmed</h2>
      <p className="mt-[0.5rem] text-[0.875rem] text-tx-gray">
        Order reference <span className="font-extrabold text-tx-white">{order.reference}</span>
      </p>

      <div className="mt-[1.5rem] rounded-[1rem] bg-bg-medium p-[1.25rem] text-left">
        <h3 className="text-[1rem] font-extrabold uppercase">{session.movie.title}</h3>
        <p className="mt-[0.25rem] text-[0.75rem] text-tx-gray">
          {session.venue.name} · Hall {session.hall.name} · {session.date} · {session.time} ·{' '}
          {session.format.name} · {session.language.name}
        </p>
        <ul className="mt-[1rem] flex flex-col gap-[0.5rem] border-t border-bg-brighter pt-[1rem] text-[0.875rem]">
          {order.tickets.map((t) => (
            <li key={t.id} className="flex justify-between">
              <span>
                {t.seatCode} <span className="text-tx-gray">· {t.ticketType.name}</span>
              </span>
              <span className="font-semibold">{money(t.price)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-[1rem] flex justify-between border-t border-bg-brighter pt-[1rem] font-extrabold">
          <span>Total paid</span>
          <span>{money(order.totalPrice)}</span>
        </div>
      </div>

      <div className="mt-[1.5rem] flex justify-center gap-[0.75rem]">
        <Button onClick={onTickets}>My Tickets</Button>
        <Button variant="ghost" onClick={onClose}>Close</Button>
      </div>
    </div>
  )
}