import { useEffect, useRef, useState } from 'react'
import { secondsLeft } from '../utils/booking'

export function useCountdown(expiresAt, onExpire) {
  const cb = useRef(onExpire)
  useEffect(() => { cb.current = onExpire })

  const [left, setLeft] = useState(() => (expiresAt ? secondsLeft(expiresAt) : 0))

  useEffect(() => {
    if (!expiresAt) return
    const tick = () => {
      const s = secondsLeft(expiresAt)
      setLeft(s)
      if (s === 0) { clearInterval(id); cb.current() }
    }
    const id = setInterval(tick, 1000)
    tick()
    return () => clearInterval(id)
  }, [expiresAt])

  return left
}