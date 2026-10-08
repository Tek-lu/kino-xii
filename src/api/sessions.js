import { request } from './client'

export function getSessions({ venue, format, language, band, date, sort, page }) {
  const params = new URLSearchParams()

  venue.forEach((slug) => params.append('venues[]', slug))
  format.forEach((slug) => params.append('formats[]', slug))
  language.forEach((slug) => params.append('languages[]', slug))
  band.forEach((id) => params.append('bands[]', id))

  params.set('date', date)
  params.set('sort', sort)
  params.set('page', page)

  return request(`/sessions?${params}`)
}