import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { displayName, fullDisplayName, initials } from '../../utils/user'
import arrowDown from '../../assets/arrow.svg'
import ticketIcon from '../../assets/property1_ticket.svg'
import logoutIcon from '../../assets/log_out.svg'

function Avatar({ user, className = 'h-[2.75rem] w-[2.75rem]' }) {
  const { profileComplete } = useAuth()
  return (
    <span className={`relative grid shrink-0 place-items-center rounded-[0.5rem] bg-bg-medium text-[0.75rem] font-extrabold ${className}`}>
      {user.avatar ? (
        <img src={user.avatar} alt="" className="h-full w-full rounded-[0.5rem] object-cover" />
      ) : (
        initials(user)
      )}
      <span
        className={`absolute -bottom-[0.1875rem] -right-[0.1875rem] h-[0.75rem] w-[0.75rem] rounded-full border-2 border-bg-darkest ${
          profileComplete ? 'bg-hc-green' : 'bg-hc-orange'
        }`}
      />
    </span>
  )
}

export default function UserMenu() {
  const { user, profileComplete, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e) => !ref.current?.contains(e.target) && setOpen(false)
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const item = 'flex items-center gap-[0.75rem] rounded-[0.5rem] px-[0.75rem] py-[0.625rem] text-[0.75rem] font-semibold hover:bg-bg-medium'

  async function onLogout() {
    setOpen(false)
    await logout()
    navigate('/')
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-[0.75rem]"
      >
        <Avatar user={user} />
        <span className="text-[0.875rem] font-extrabold">{displayName(user)}</span>
        <img src={arrowDown} alt="" className={`w-[0.75rem] transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-[0.75rem] w-[20rem] rounded-[1rem] border border-tint-white bg-bg-darkest p-[0.75rem] shadow-lg"
        >
          <div className="flex items-center gap-[0.75rem] p-[0.5rem]">
            <Avatar user={user} className="h-[2.5rem] w-[2.5rem]" />
            <div className="min-w-0">
              <p className="truncate text-[0.875rem] font-extrabold">{fullDisplayName(user)}</p>
              <p className="truncate text-[0.75rem] text-tx-gray">{user.email}</p>
            </div>
          </div>

          <div
            className={`mx-[0.5rem] my-[0.5rem] rounded-[0.5rem] px-[0.75rem] py-[0.625rem] ${
              profileComplete ? 'bg-tint-green text-hc-green' : 'bg-hc-orange/10 text-hc-orange'
            }`}
          >
            <p className="text-[0.75rem] font-extrabold">
              {profileComplete ? 'Profile complete ✓' : 'Profile incomplete'}
            </p>
            {!profileComplete && (
              <p className="mt-[0.125rem] text-[0.75rem] text-tx-gray">
                Please complete your profile to enable booking
              </p>
            )}
          </div>

          <Link to="/profile" role="menuitem" onClick={() => setOpen(false)} className={item}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
            </svg>
            My Profile
          </Link>
          <Link to="/profile?tab=tickets" role="menuitem" onClick={() => setOpen(false)} className={item}>
            <img src={ticketIcon} alt="" className="h-[0.875rem] w-[0.875rem]" />
            My Tickets
          </Link>

          <div className="my-[0.5rem] border-t border-bg-brighter" />

          <button type="button" role="menuitem" onClick={onLogout} className={`${item} w-full text-hc-red`}>
            <img src={logoutIcon} alt="" className="h-[0.875rem] w-[0.875rem]" />
            Log out
          </button>
        </div>
      )}
    </div>
  )
}