import { createContext, useContext } from 'react'
import { useQuery } from '@tanstack/react-query'
import { request } from '../api/client'

const ConfigContext = createContext(null)

export function ConfigProvider({ children }) {
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ['filter-options'],
    queryFn: () => request('/filter-options').then((r) => r.data),
    staleTime: Infinity,
  })

  if (isPending) {
    return <div className="grid min-h-screen place-items-center text-tx-gray">Loading…</div>
  }
  if (isError) {
    return (
      <div className="grid min-h-screen place-items-center">
        <button onClick={() => refetch()} className="rounded-full bg-hc-red px-5 py-2 font-semibold">
          Something went wrong. Retry
        </button>
      </div>
    )
  }
  return <ConfigContext.Provider value={data}>{children}</ConfigContext.Provider>
}

export const useConfig = () => useContext(ConfigContext)