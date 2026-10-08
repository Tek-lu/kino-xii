const pad = (n) => String(n).padStart(2, '0')

// "2026-10-05" built from local time (toISOString would use UTC and can be a day off)
export const toDateValue = (d) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

export function getNextDays(count = 7) {
  return Array.from({ length: count }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() + i)
    return {
      value: toDateValue(d),
      weekday: d.toLocaleDateString('en-US', { weekday: 'short' }), // Mon
      day: d.getDate(), 
    }
  })
}