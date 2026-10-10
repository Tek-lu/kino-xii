import { request } from './client'

export const getTickets = (filter) =>
  request(`/tickets?filter=${filter}`).then((r) => r.data)

export const refundOrder = (reference) =>
  request(`/orders/${reference}/refund`, { method: 'POST' }).then((r) => r.data)