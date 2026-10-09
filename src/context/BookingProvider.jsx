import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookingContext } from './bookingContext'
import { useAuth } from '../hooks/useAuth'
import BookingModal from '../components/booking/BookingModal'

export default function BookingProvider({ children }) {
  const { requireAuth } = useAuth()
  const navigate = useNavigate()
  const [sessionId, setSessionId] = useState(null)

  // requireAuth: logged in -> runs now; guest -> login first, then runs (no 2nd click)
  const openBooking = useCallback(
    (id) =>
      requireAuth((user) => {
        if (!user.profileComplete) {
          navigate('/profile', { state: { notice: 'Please complete your profile to enable booking.' } })
          return
        }
        setSessionId(id)
      }),
    [requireAuth, navigate],
  )
  const close = useCallback(() => setSessionId(null), [])
  const value = useMemo(() => ({ openBooking }), [openBooking])

  return (
    <BookingContext.Provider value={value}>
      {children}
      {sessionId && <BookingModal key={sessionId} sessionId={sessionId} onClose={close} />}
    </BookingContext.Provider>
  )
}