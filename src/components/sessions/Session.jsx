import { useSessionFilters } from '../../hooks/useSessionFilters'
import { useSessionsQuery } from '../../hooks/useSessionsQuery'
import FiltersSidebar from './FiltersSidebar'
import SessionsList from './SessionsList'
import SortDrop from './SortDrop'
import Pagination from './Pagination'

export default function Sessions() {
  const filters = useSessionFilters()
  const query = useSessionsQuery(filters)
  const meta = query.data?.meta

  const clearAll = () => filters.update({ venue: [], format: [], language: [], band: [] })

  return (
    <div className="container-page flex gap-x-[3.18rem] text-tx-white">
      <div className="flex flex-col gap-y-[2.25rem]">
        <div className="flex flex-col gap-y-[0.375rem]">
          <h1 className="text-2xl font-extrabold">Sessions</h1>
          <p className="text-[0.875rem] font-normal text-tx-gray">Browse showtimes across all venues</p>
        </div>
        <FiltersSidebar filters={filters} />
      </div>

      <div className="mt-[5.5rem] min-w-0 flex-1">
        <div className="mb-[1rem] flex w-full justify-between">
          <span className="text-[0.875rem] font-semibold">
            {meta ? (meta.totalSessions === 0 ? 'No sessions found' : `Showing ${meta.totalSessions} sessions`) : ''}
          </span>
          <SortDrop value={filters.sort} onChange={(sort) => filters.update({ sort })} />
        </div>

        <SessionsList query={query} onClear={clearAll} />
        <Pagination filters={filters} lastPage={meta?.lastPage} />
      </div>
    </div>
  )
}