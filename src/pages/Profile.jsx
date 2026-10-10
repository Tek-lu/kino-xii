import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useTickets } from '../hooks/useTickets'
import ProfileInfo from '../components/profile/ProfileInfo'
import TicketsTab from '../components/profile/TicketsTab'
import Skeleton from '../components/ui/Skeleton'
import EmptyState from '../components/ui/EmptyState'
import Button from '../components/ui/Button'

export default function Profile() {
  const { user, booting, openModal } = useAuth()
  const [params, setParams] = useSearchParams()
  const tab = params.get('tab') === 'tickets' ? 'tickets' : 'info'
  const upcoming = useTickets('upcoming')

  // not logged in: open the login modal; the page appears once login succeeds
  useEffect(() => {
    if (!booting && !user) openModal('login')
  }, [booting, user, openModal])

  if (booting) return <Skeleton className="container-page h-[30rem]" />
  if (!user) {
    return (
      <div className="container-page">
        <EmptyState
          title="Please log in"
          text="Log in to manage your profile and tickets."
          action={<Button onClick={() => openModal('login')}>Log In</Button>}
        />
      </div>
    )
  }

  const tabs = [
    { id: 'info', label: 'Personal Information' },
    { id: 'tickets', label: 'My Tickets', badge: upcoming.data?.length },
  ]

  return (
    <div className="container-page flex flex-col gap-y-[1.75rem] text-tx-white">
      <h1 className="text-2xl font-extrabold">My Profile</h1>

      <div className="flex gap-[1.5rem] border-b border-bg-brighter text-[0.875rem] font-semibold" role="tablist">
        {tabs.map((t) => {
          const on = t.id === tab
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => setParams(t.id === 'tickets' ? { tab: 'tickets' } : {})}
              className={`relative flex items-center gap-[0.5rem] pb-[0.875rem] ${on ? 'text-tx-white' : 'text-tx-gray'}`}
            >
              {t.label}
              {t.badge > 0 && (
                <span className="grid h-[1.125rem] min-w-[1.125rem] place-items-center rounded-full bg-hc-red px-[0.25rem] text-[0.625rem] text-tx-white">
                  {t.badge}
                </span>
              )}
              {on && <span className="absolute inset-x-0 -bottom-px h-[2px] rounded-t-[2px] bg-hc-red" />}
            </button>
          )
        })}
      </div>

      {tab === 'info' ? <ProfileInfo /> : <TicketsTab />}
    </div>
  )
}