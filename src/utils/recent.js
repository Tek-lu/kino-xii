const MAX = 12
const key = (uid) => `recent:${uid ?? 'guest'}`

export function getRecent(uid) {
  try {
    return JSON.parse(localStorage.getItem(key(uid))) ?? []
  } catch {
    return []
  }
}

export function addRecent(uid, movie) {
  const item = {
    id: movie.id,
    slug: movie.slug,
    title: movie.title,
    posterUrl: movie.posterUrl,
    runtimeMinutes: movie.runtimeMinutes,
    genre: movie.genres?.[0]?.name ?? '',
    ageRating: movie.ageRating,
  }
  // newest first, no duplicates, capped
  const next = [item, ...getRecent(uid).filter((m) => m.id !== item.id)].slice(0, MAX)
  try {
    localStorage.setItem(key(uid), JSON.stringify(next))
  } catch {
    /* storage full or blocked: ignore */
  }
}