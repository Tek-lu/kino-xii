import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import search from '../../assets/search.svg'
import logo from '../../assets/logo.svg'
import ticketIcon from '../../assets/property1_ticket.svg'
import logoutIcon from '../../assets/log_out.svg'

export default function Navbar() {
  const { user, booting, profileComplete, openModal, logout } = useAuth()
  // ...header, logo, nav and search stay as they are
  const openLogin = () => {}
  const openRegister = () => {}

  return (
    <header className="absolute inset-x-0 top-0 z-30 bg-gradient-to-b from-bg-darkest/80 to-transparent">
      <div className="container-page flex h-20 items-center gap-10">
        <Link to="/" aria-label="Kino XII home" className="shrink-0">
          <img src={logo} alt="Kino XII" className="h-5" />
        </Link>

        <nav>
          <NavLink
            to="/sessions"
            className={({ isActive }) =>
              `text-[12px] font-semibold uppercase tracking-wide transition-colors hover:text-tx-white ${
                isActive ? 'text-tx-white' : 'text-tx-gray'
              }`
            }
          >
            Sessions
          </NavLink>
        </nav>

        <div className="ml-auto flex items-center gap-4">
          <label className="flex w-[300px] items-center gap-2 rounded-full bg-tint-white px-4 py-2 text-tx-gray focus-within:ring-1 focus-within:ring-tx-gray">
          <img src={search} alt="search" />
            <input
              type="search"
              placeholder="Search films and live events"
              className="w-full bg-transparent text-[12px] font-normal text-tx-white outline-none placeholder:text-tx-gray"
            />
          </label>

          {!booting && !user && (
  <>
    <button
      onClick={() => openModal('register')}
      className="rounded-full bg-hc-red px-5 py-2 text-[12px] font-semibold text-tx-white transition-opacity hover:opacity-90"
    >
      Sign Up
    </button>
    <button
      onClick={() => openModal('login')}
      className="rounded-full bg-tx-white px-5 py-2 text-[12px] font-semibold text-bg-darkest transition-opacity hover:opacity-90"
    >
      Log In
    </button>
  </>
)}

{user && (
  <>
    <Link
      to="/profile"
      className="flex items-center gap-2 rounded-full bg-tint-white px-4 py-2 text-[12px] font-semibold"
    >
      <img src={ticketIcon} alt="" aria-hidden="true" className="h-4 w-4" />
      My Tickets
    </Link>

    <Link to="/profile" aria-label="Profile" className="relative">
      {user.avatar ? (
        <img src={user.avatar} alt="" className="h-9 w-9 rounded-full object-cover" />
      ) : (
        <span className="grid h-9 w-9 place-items-center rounded-full bg-bg-brighter text-[13px] font-semibold uppercase">
          {user.username?.[0]}
        </span>
      )}
      <span
        className={`absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-bg-darkest ${
          profileComplete ? 'bg-hc-green' : 'bg-hc-orange'
        }`}
      />
    </Link>

    <button onClick={logout} aria-label="Log out" className="grid h-9 w-9 place-items-center rounded-full bg-tint-white">
      <img src={logoutIcon} alt="" className="h-4 w-4" />
    </button>
  </>
)}
        </div>
      </div>
    </header>
  )
}