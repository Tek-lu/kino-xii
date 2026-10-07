import { Link } from 'react-router-dom'
import logo from '../../assets/logo.svg'

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-tint-white">
      <div className="container-page flex h-20 items-center justify-between">
        <Link to="/" aria-label="Kino XII home">
          <img src={logo} alt="Kino XII" className="h-4" />
        </Link>
        <p className="text-[12px] font-normal text-tx-gray">
          © {new Date().getFullYear()} Kino XII. All rights reserved.
        </p>
      </div>
    </footer>
  )
}