import { request } from './client'

const unwrap = (r) => r.data

export const getSession = (id) => request(`/sessions/${id}`).then(unwrap)
export const getSeats = (id) => request(`/sessions/${id}/seats`).then(unwrap)
export const holdSeats = (id, seats) =>
  request(`/sessions/${id}/holds`, { method: 'POST', body: { seats } }).then(unwrap)
// gate:false so a dead token on close doesn't pop up the login modal
export const releaseHold = (holdId) =>
  request(`/holds/${holdId}`, { method: 'DELETE', gate: false })
export const createOrder = (body) =>
  request('/orders', { method: 'POST', body }).then(unwrap)