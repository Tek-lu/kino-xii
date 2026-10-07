import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

export default function Layout() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      {/* Home hero sits under the transparent navbar; other pages need room for it */}
      <main className={`flex-1 ${isHome ? '' : 'pt-20'}`}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}