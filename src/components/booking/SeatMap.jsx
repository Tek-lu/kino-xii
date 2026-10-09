import { Fragment } from 'react'

const SIZE = 'h-[2.25rem] w-[2.25rem]'
const STYLE = {
  available: 'border border-bg-brighter bg-bg-medium hover:border-tx-gray',
  selected: 'border border-hc-red bg-hc-red',
  sold: 'cursor-not-allowed border border-transparent bg-bg-medium/40 text-tx-blue',
  held: 'cursor-not-allowed border border-bg-brighter text-tx-gray bg-[repeating-linear-gradient(135deg,var(--color-bg-brighter)_0_4px,transparent_4px_8px)]',
}

function statusOf(seat, selectedIds, lost) {
  if (selectedIds.has(seat.id)) return 'selected'
  if (lost.includes(seat.code)) return 'sold' // just lost in a 409
  if (seat.isMine) return 'available' // my own live hold stays selectable
  return seat.state // available | sold | held
}

const Legend = ({ style, label }) => (
  <span className="flex items-center gap-[0.5rem] text-[0.75rem] text-tx-gray">
    <span className={`h-[1rem] w-[1rem] rounded-[0.25rem] ${style}`} />
    {label}
  </span>
)

export default function SeatMap({ sections, selectedIds, lost, onToggle }) {
  return (
    <div>
      <div className="rounded-[0.75rem] bg-bg-medium py-[0.5rem] text-center text-[0.75rem] font-semibold uppercase text-tx-gray">
        Screen
      </div>

      <div className="no-scrollbar mt-[1.5rem] flex flex-col gap-[1.5rem] overflow-x-auto">
        {sections.map((section) => {
          const first = section.rows[0]?.label
          const last = section.rows.at(-1)?.label
          return (
            <div key={section.name} className="mx-auto w-fit">
              <p className="mb-[0.75rem] text-[0.75rem] font-semibold uppercase text-tx-gray">
                {section.name} · {first === last ? `Row ${first}` : `Rows ${first}-${last}`}
              </p>
              <div className="flex flex-col gap-[0.375rem]">
                {section.rows.map((row) => (
                  <div key={row.label} className="flex items-center gap-[0.375rem]">
                    <span className="w-[1.5rem] text-center text-[0.75rem] text-tx-gray">{row.label}</span>
                    {row.seats.map((seat) => {
                      const st = statusOf(seat, selectedIds, lost)
                      return (
                        <Fragment key={seat.id}>
                          {seat.state === 'unavailable' ? (
                            <span className={SIZE} aria-hidden="true" /> // keeps the grid aligned
                          ) : (
                            <button
                              type="button"
                              disabled={st !== 'available' && st !== 'selected'}
                              aria-pressed={st === 'selected'}
                              aria-label={`Seat ${seat.code}, ${st}`}
                              onClick={() => onToggle(seat, section.name)}
                              className={`${SIZE} rounded-[0.5rem] text-[0.75rem] font-semibold transition-colors ${STYLE[st]}`}
                            >
                              {seat.label}
                            </button>
                          )}
                          {seat.aisleAfter && <span className="w-[1.25rem]" aria-hidden="true" />}
                        </Fragment>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-[1.5rem] flex justify-center gap-[1.5rem]">
        <Legend style={STYLE.available} label="Available" />
        <Legend style={STYLE.selected} label="Selected" />
        <Legend style={STYLE.sold} label="Sold" />
        <Legend style={STYLE.held} label="Held by another user" />
      </div>
    </div>
  )
}