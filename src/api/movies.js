import { request } from './client'

const unwrap = (r) => r.data

export const getFeatured = () => request('/movies/featured').then(unwrap)
export const getNowPlaying = (limit) =>
  request(`/movies/now-playing${limit ? `?limit=${limit}` : ''}`).then(unwrap)
export const getComingSoon = () => request('/movies/coming-soon').then(unwrap)
export const getMovie = (slug) => request(`/movies/${slug}`).then(unwrap)
export const notifyMovie = (slug) =>
  request(`/movies/${slug}/notify`, { method: 'POST' })