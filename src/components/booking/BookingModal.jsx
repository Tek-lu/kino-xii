import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import Modal from '../ui/Modal'
import Skeleton from '../ui/Skeleton'
import ErrorState from '../ui/ErrorState'
import Button from '../ui/Button'
import SeatMap from './SeatMap'
import CheckoutForm from './CheckoutForm'
import Confirmation from './Confirmation'
import { useConfig } from '../../context/ConfigContext'
import { useAuth } from '../../hooks/useAuth'
import { useForm } from '../../hooks/useForm'
import { useCountdown } from '../../hooks/useCountdown'
import { getSession, getSeats, holdSeats, releaseHold, createOrder } from '../../api/booking'
import { emailRule, nameRule, mobileRule, cardRule, expiryRule, cvvRule } from '../../utils/validators'
import { money, priceFor, fmtTime } from '../../utils/booking'

const checkoutRules = {
  fullName: nameRule,
  email: emailRule,
  mobileNumber: mobileRule,
  cardNumber: cardRule,
  expiry: expiryRule,
  cvv: cvvRule,
}

const EXPIRED = 'Your hold time expired. Please re-select your seats.'

export default function BookingModal({ sessionId, onClose }) {
  const { data: session, isPending, isError, refetch } = useQuery({
    queryKey: ['session', sessionId],
    queryFn: () => getSession(sessionId),
  })

  return (
    <Modal title="Book tickets" onClose={onClose} className="max-w-[78rem] border border-tint-white bg-bg-darkest!">
      {isPending && <Skeleton className="h-[30rem]" />}
      {isError && <ErrorState message="Couldn't load this session." onRetry={refetch} />}
      {session && <BookingFlow session={session} onClose={onClose} />}
    </Modal>
  )
}

function BookingFlow({ session, onClose }) {
  const { ticketTypes, maxSeatsPerOrder } = useConfig()
  const { user } = useAuth()
  const navigate = useNavigate()
  const qc = useQueryClient()

  const [step, setStep] = useState(1)
  const [selected, setSelected] = useState([]) // [{ seat, section, ticketType }]
  const [lost, setLost] = useState([]) // seat codes taken by someone else
  const [hold, setHold] = useState(null)
  const [order, setOrder] = useState(null)
  const [banner, setBanner] = useState('')
  const [busy, setBusy] = useState(false)
  const lock = useRef(false)
  const holdRef = useRef(null)

  const form = useForm(
    {
      fullName: user.fullName ?? '',
      email: user.email ?? '',
      mobileNumber: user.mobileNumber ?? '',
      cardNumber: '',
      expiry: '',
      cvv: '',
    },
    checkoutRules,
  )

  const seatsQuery = useQuery({
    queryKey: ['seats', session.id],
    queryFn: () => getSeats(session.id),
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: 'always',
  })

  // Any way of closing unmounts this component; release a hold that was not paid
  useEffect(
    () => () => {
      if (holdRef.current) releaseHold(holdRef.current).catch(() => {})
    },
    [],
  )

  const applyHold = (h) => {
    holdRef.current = h?.holdId ?? null
    setHold(h)
  }

  // ---------- derived ----------
  const { minAge, code: ratingCode } = session.movie.ageRating
  const ageBlocked = user.age != null && user.age < minAge
  const typeOf = (slug) => ticketTypes.find((t) => t.slug === slug)
  const isBlocked = (t) => t.blockedFromRatingAge != null && minAge >= t.blockedFromRatingAge
  const allowedTypes = ticketTypes.filter((t) => !isBlocked(t))
  const priceOf = (slug) => priceFor(session.price, typeOf(slug)?.priceRatio ?? 1)
  const violations = selected.filter((s) => {
    const t = typeOf(s.ticketType)
    return t && isBlocked(t)
  })
  const subtotal =
    step === 2 && hold ? hold.subtotal : selected.reduce((sum, s) => sum + priceOf(s.ticketType), 0)
  const canContinue =
    user.profileComplete &&
    !ageBlocked &&
    selected.length > 0 &&
    selected.length <= maxSeatsPerOrder &&
    violations.length === 0 &&
    !busy

  // ---------- helpers ----------
  const resetToSeats = (message, clearSelection) => {
    applyHold(null)
    if (clearSelection) setSelected([])
    setStep(1)
    setBanner(message)
    seatsQuery.refetch()
  }

  // 409: drop only the lost seats, keep the rest
  const reconcile = (codes = []) => {
    if (holdRef.current) releaseHold(holdRef.current).catch(() => {})
    setLost((prev) => [...new Set([...prev, ...codes])])
    setSelected((prev) => prev.filter((s) => !codes.includes(s.seat.code)))
    resetToSeats(
      `Seat${codes.length > 1 ? 's' : ''} ${codes.join(', ')} ${codes.length > 1 ? 'were' : 'was'} just taken. The rest of your selection is kept.`,
      false,
    )
  }

  const left = useCountdown(hold?.expiresAt, () => resetToSeats(EXPIRED, true))

  // ---------- seat selection ----------
  const selectedIds = new Set(selected.map((s) => s.seat.id))

  const toggleSeat = (seat, section) => {
    setBanner('')
    if (selectedIds.has(seat.id)) {
      setSelected(selected.filter((s) => s.seat.id !== seat.id))
    } else if (selected.length >= maxSeatsPerOrder) {
      setBanner(`You can select up to ${maxSeatsPerOrder} seats per order.`)
    } else {
      setSelected([...selected, { seat, section, ticketType: 'adult' }])
    }
  }

  const changeType = (id, ticketType) =>
    setSelected(selected.map((s) => (s.seat.id === id ? { ...s, ticketType } : s)))

  // ---------- step 1 -> 2 ----------
  async function goCheckout() {
    if (lock.current || !canContinue) return
    lock.current = true
    setBusy(true)
    setBanner('')
    try {
      const h = await holdSeats(
        session.id,
        selected.map((s) => ({ seatId: s.seat.id, ticketType: s.ticketType })),
      )
      applyHold(h)
      setStep(2)
    } catch (e) {
      if (e.status === 409) reconcile(e.contested)
      else if (e.status === 422 && !e.errors) {
        setBanner(e.message)
        if (/profile/i.test(e.message)) {
          onClose()
          navigate('/profile', { state: { notice: e.message } })
        }
      } else if (e.errors) setBanner(Object.values(e.errors).flat().join(' '))
      else setBanner('Something went wrong. Please try again.')
    } finally {
      lock.current = false
      setBusy(false)
    }
  }

  // ---------- step 2: pay ----------
  async function pay(e) {
    e.preventDefault()
    if (lock.current || !hold || !form.validateAll()) return
    lock.current = true
    setBusy(true)
    setBanner('')
    const v = form.values
    try {
      const created = await createOrder({
        holdId: hold.holdId,
        fullName: v.fullName.trim(),
        email: v.email.trim(),
        mobileNumber: v.mobileNumber.replace(/\s/g, ''),
        cardNumber: v.cardNumber.replace(/\s/g, ''),
        expiry: v.expiry,
        cvv: v.cvv,
      })
      applyHold(null) // paid: the hold is consumed, nothing to release on close
      setOrder(created)
      qc.invalidateQueries({ queryKey: ['tickets'] })
      qc.invalidateQueries({ queryKey: ['sessions'] })
      qc.invalidateQueries({ queryKey: ['movie-sessions'] })
    } catch (err) {
      if (err.errors) form.applyApiErrors(err.errors) // each error on its own field
      else if (err.status === 409) reconcile(err.contested)
      else if (err.status === 422) resetToSeats(err.message, true) // hold ran out
      else setBanner('Something went wrong. Please try again.')
    } finally {
      lock.current = false
      setBusy(false)
    }
  }

  // ---------- render ----------
  if (order) {
    return (
      <Confirmation
        order={order}
        onClose={onClose}
        onTickets={() => {
          onClose()
          navigate('/profile')
        }}
      />
    )
  }

  const longDate = new Date(`${session.date}T00:00:00`).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  const ticketSummary = hold
    ? Object.entries(
        hold.seats.reduce((acc, s) => ({ ...acc, [s.ticketType.name]: (acc[s.ticketType.name] ?? 0) + 1 }), {}),
      )
        .map(([name, n]) => `${n} x ${name}`)
        .join(', ')
    : ''

  return (
    <div>
      <header className="flex items-start justify-between gap-[1rem] pr-[2.5rem]">
        <div>
          <h2 className="text-[1.5rem] font-extrabold uppercase">{session.movie.title}</h2>
          <p className="mt-[0.25rem] text-[0.75rem] text-tx-gray">
            {[session.venue.name, `Hall ${session.hall.name}`, longDate, session.time, session.format.name, session.language.name].join(' · ')}
          </p>
        </div>
        {hold && (
          <div className="rounded-[0.75rem] bg-bg-medium px-[1rem] py-[0.5rem] text-center">
            <p className="text-[0.625rem] font-semibold uppercase text-tx-gray">Seats held</p>
            <p className="text-[1rem] font-extrabold tabular-nums">{fmtTime(left)}</p>
          </div>
        )}
      </header>

      <div className="mt-[1.5rem] grid grid-cols-2 rounded-full bg-bg-medium text-[0.75rem] font-semibold uppercase">
        <button
          type="button"
          disabled={step === 1}
          onClick={() => setStep(1)}
          className={`rounded-full py-[0.5rem] ${step === 1 ? 'bg-hc-red' : ''}`}
        >
          1. Seats
        </button>
        <span className={`rounded-full py-[0.5rem] text-center ${step === 2 ? 'bg-hc-red' : 'text-tx-gray'}`}>
          2. Checkout
        </span>
      </div>

      {banner && (
        <p role="alert" className="mt-[1rem] rounded-[0.5rem] bg-hc-orange/10 px-[1rem] py-[0.75rem] text-[0.75rem] text-hc-orange">
          {banner}
        </p>
      )}

      <div className="mt-[1.5rem] flex gap-[2rem]">
        <div className="min-w-0 flex-1">
          {step === 1 ? (
            <>
              {seatsQuery.isPending && <Skeleton className="h-[24rem]" />}
              {seatsQuery.isError && (
                <ErrorState message="Couldn't load the hall map." onRetry={seatsQuery.refetch} />
              )}
              {seatsQuery.data && (
                <SeatMap
                  sections={seatsQuery.data.sections}
                  selectedIds={selectedIds}
                  lost={lost}
                  onToggle={toggleSeat}
                />
              )}
            </>
          ) : (
            <CheckoutForm form={form} onSubmit={pay} />
          )}
        </div>

        <aside className="flex w-[22rem] shrink-0 flex-col border-l border-tint-white pl-[2rem]">
          {step === 1 ? (
            <>
              <h3 className="text-[0.875rem] font-extrabold">Your seats · Max {maxSeatsPerOrder}</h3>
              {selected.length === 0 ? (
                <p className="mt-[0.5rem] text-[0.75rem] text-tx-gray">
                  Pick up to {maxSeatsPerOrder} seats from the map. Each seat can carry its own ticket type.
                </p>
              ) : (
                <ul className="mt-[1rem] flex flex-col gap-[0.75rem]">
                  {selected.map((s) => (
                    <li key={s.seat.id} className="flex items-center gap-[0.5rem] text-[0.75rem]">
                      <span className="w-[3rem]">
                        <span className="block font-extrabold">{s.seat.code}</span>
                        <span className="block text-tx-gray">{s.section}</span>
                      </span>
                      <select
                        value={s.ticketType}
                        onChange={(e) => changeType(s.seat.id, e.target.value)}
                        className="flex-1 rounded-[0.5rem] bg-bg-brighter px-[0.5rem] py-[0.375rem] font-semibold outline-none"
                      >
                        {allowedTypes.map((t) => (
                          <option key={t.slug} value={t.slug}>{t.name}</option>
                        ))}
                      </select>
                      <span className="w-[3rem] text-right font-semibold">{money(priceOf(s.ticketType))}</span>
                      <button
                        type="button"
                        aria-label={`Remove seat ${s.seat.code}`}
                        onClick={() => toggleSeat(s.seat, s.section)}
                        className="text-tx-gray hover:text-tx-white"
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-[1rem] flex flex-col gap-[0.5rem] text-[0.75rem] text-hc-red">
                {violations.map((s) => (
                  <p key={s.seat.id}>Seat {s.seat.code}: child tickets are not available for {ratingCode} films.</p>
                ))}
                {ageBlocked && (
                  <p>This film is rated {ratingCode}. You cannot buy tickets for it with this account.</p>
                )}
                {!user.profileComplete && <p>Please complete your profile to enable booking.</p>}
              </div>
            </>
          ) : (
            <>
              <h3 className="text-[0.875rem] font-extrabold">Summary</h3>
              <div className="mt-[1rem] rounded-[0.75rem] bg-bg-medium p-[1rem] text-[0.75rem]">
                <p className="text-[0.875rem] font-extrabold uppercase">{session.movie.title}</p>
                <p className="mt-[0.25rem] text-tx-gray">
                  Hall {session.hall.name} · {longDate} · {session.time}
                </p>
                <div className="mt-[0.75rem] flex justify-between border-t border-bg-brighter pt-[0.75rem]">
                  <span className="text-tx-gray">Seats</span>
                  <span className="font-semibold">{hold?.seats.map((s) => s.code).join(', ')}</span>
                </div>
                <div className="mt-[0.5rem] flex justify-between">
                  <span className="text-tx-gray">Tickets</span>
                  <span className="font-semibold">{ticketSummary}</span>
                </div>
              </div>
            </>
          )}

          <div className="mt-auto pt-[1.5rem]">
            <div className="mb-[0.75rem] flex items-center justify-between">
              <span className="text-[0.75rem] font-semibold uppercase">Subtotal</span>
              <span className="text-[1.5rem] font-extrabold">{money(subtotal)}</span>
            </div>
            {step === 1 ? (
              <Button className="w-full py-[0.75rem]" disabled={!canContinue} loading={busy} onClick={goCheckout}>
                Next: Checkout
              </Button>
            ) : (
              <div className="flex flex-col gap-[0.5rem]">
                <Button type="submit" form="checkout-form" className="w-full py-[0.75rem]" loading={busy}>
                  Pay: Complete order
                </Button>
                <Button variant="ghost" className="w-full" disabled={busy} onClick={() => setStep(1)}>
                  Back
                </Button>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}