import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { getSessions } from '../api/sessions'

export function useSessionsQuery(f) {
  return useQuery({
    queryKey: ['sessions', f.venue, f.format, f.language, f.band, f.date, f.sort, f.page],
    queryFn: () =>
      getSessions({
        venue: f.venue,
        format: f.format,
        language: f.language,
        band: f.band,
        date: f.date,
        sort: f.sort,
        page: f.page,
      }),
    placeholderData: keepPreviousData,
  })
}