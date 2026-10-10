import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import search from '../../assets/search.svg'
import logo from '../../assets/logo.svg'
import ticketIcon from '../../assets/property1_ticket.svg'
import logoutIcon from '../../assets/log_out.svg'
import SearchBox from './SearchBox'
import UserMenu from './UserMenu'


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
                    <SearchBox />
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
{user && <UserMenu />}
        </div>
      </div>
    </header>
  )
}