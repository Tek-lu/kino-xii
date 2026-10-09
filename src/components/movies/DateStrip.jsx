import { getNextDays } from '../../utils/dates'

export default function DateStrip({ value, onChange, enabled }) {
  return (
    <div className="mt-[1rem] flex gap-[0.5rem]">
      {getNextDays().map((d) => {
        const on = d.value === value
        const off = enabled && !enabled.includes(d.value) // no sessions that day
        return (
          <button
            key={d.value}
            type="button"
            disabled={off}
            aria-pressed={on}
            title={off ? 'No sessions on this day' : undefined}
            onClick={() => onChange(d.value)}
            className={`flex h-[5rem] w-[5rem] flex-col items-center justify-center gap-[0.25rem] rounded-[0.75rem] text-[0.75rem] font-semibold transition-colors disabled:opacity-30 ${
              on ? 'bg-hc-red' : 'bg-bg-medium'
            }`}
          >
            <span className={on ? '' : 'text-tx-gray'}>{d.weekday}</span>
            <span className="text-[1.125rem] font-extrabold">{d.day}</span>
          </button>
        )
      })}
    </div>
  )
}