import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { searchMovies } from '../../api/movies'
import { useDebounce } from '../../hooks/useDebounce'
import searchIcon from '../../assets/search.svg'
import AgeBadge from '../ui/AgeBadge'

export default function SearchBox() {
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const ref = useRef(null)

  const term = q.trim()
  const debounced = useDebounce(term, 300)
  const waiting = term !== debounced // user is still typing

  const { data = [], isFetching, isError, refetch } = useQuery({
    queryKey: ['search', debounced],
    queryFn: () => searchMovies(debounced),
    enabled: debounced.length > 0,
  })

  // close on outside click
  useEffect(() => {
    const onDown = (e) => !ref.current?.contains(e.target) && setOpen(false)
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  const go = (movie) => {
    setOpen(false)
    setQ('')
    setActive(-1)
    navigate(`/movies/${movie.slug}`)
  }

  const onKeyDown = (e) => {
    if (e.key === 'Escape') setOpen(false)
    else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => Math.min(i + 1, data.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && data[active]) go(data[active])
  }

  const loading = waiting || isFetching
  const showPanel = open && term.length > 0

  return (
    <div ref={ref} className="relative w-[20rem]">
      <label className="flex items-center gap-2 rounded-full bg-tint-white px-4 py-2 text-tx-gray focus-within:ring-1 focus-within:ring-tx-gray">
        <img src={searchIcon} alt="" aria-hidden="true" />
        <input
          type="search"
          value={q}
          placeholder="Search films and live events"
          aria-label="Search films"
          onChange={(e) => {
            setQ(e.target.value)
            setActive(-1)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          className="w-full bg-transparent text-[12px] font-normal text-tx-white outline-none placeholder:text-tx-gray"
        />
      </label>

      {showPanel && (
        <div className="absolute inset-x-0 top-full z-40 mt-[0.5rem] overflow-hidden rounded-[1rem] bg-bg-medium p-[0.5rem] shadow-lg">
          {isError && !loading ? (
            <button onClick={() => refetch()} className="w-full p-[0.75rem] text-left text-[0.75rem] text-hc-red">
              Search failed. Retry
            </button>
          ) : loading && data.length === 0 ? (
            <p className="p-[0.75rem] text-[0.75rem] text-tx-gray">Searching…</p>
          ) : data.length === 0 ? (
            <p className="p-[0.75rem] text-[0.75rem] text-tx-gray">No results for “{term}”</p>
          ) : (
            <ul>
              {data.map((m, i) => (
                <li key={m.id}>
                  <button
                    type="button"
                    onClick={() => go(m)}
                    onMouseEnter={() => setActive(i)}
                    className={`flex w-full items-center gap-[0.75rem] rounded-[0.75rem] p-[0.5rem] text-left ${
                      i === active ? 'bg-bg-brighter' : ''
                    }`}
                  >
                    <img src={m.posterUrl} alt="" className="h-[3.5rem] w-[2.5rem] rounded-[0.375rem] object-cover" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[0.75rem] font-extrabold">{m.title}</span>
                      <span className="block text-[0.625rem] text-tx-gray">
                        {m.genres[0]?.name} · {m.runtimeMinutes} min
                        {m.isComingSoon ? ' · Coming soon' : ''}
                      </span>
                    </span>
                    <AgeBadge rating={m.ageRating} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}