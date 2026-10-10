import { useQuery } from '@tanstack/react-query'
import { getTickets } from '../api/tickets'

export const useTickets = (filter) =>
  useQuery({ queryKey: ['tickets', filter], queryFn: () => getTickets(filter) })