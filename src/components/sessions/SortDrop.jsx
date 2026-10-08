import { useEffect, useRef, useState } from 'react'
import { useConfig } from '../../context/ConfigContext'
import arrowDown from '../../assets/arrow.svg'

export default function SortDrop({ value, onChange }) {
  const { sorts } = useConfig()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  const current = sorts.find((s) => s.id === value) ?? sorts[0]

  // close on outside click and on Escape
  useEffect(() => {
    if (!open) return
    const onDown = (e) => !ref.current?.contains(e.target) && setOpen(false)
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={ref} className="relative flex items-center gap-[0.5rem]">
      <span className="text-[0.875rem] font-normal text-tx-gray">Sort:</span>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-[0.5rem] text-[0.875rem] font-extrabold"
      >
        {current.label}
        <img src={arrowDown} alt="" className={`w-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 top-full z-20 mt-[0.5rem] w-[14rem] rounded-[0.75rem] bg-bg-medium p-[0.25rem] shadow-lg"
        >
          {sorts.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                role="option"
                aria-selected={s.id === value}
                onClick={() => {
                  onChange(s.id)
                  setOpen(false)
                }}
                className={`w-full rounded-[0.5rem] px-[0.75rem] py-[0.5rem] text-left text-[0.75rem] font-semibold hover:bg-bg-brighter ${
                  s.id === value ? 'text-hc-red' : ''
                }`}
              >
                {s.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}