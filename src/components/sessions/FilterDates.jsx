import { getNextDays } from '../../utils/dates'

export default function FilterDates({ value, onChange }) {
  return (
    <div className="border-b border-bg-brighter pb-[1.5rem]">
      <span className="text-[0.75rem] font-semibold text-tx-gray">DATE</span>
      <div className="no-scrollbar mt-[0.5rem] flex items-center gap-[0.32rem] overflow-x-auto">
        {getNextDays().map((d) => {
          const on = d.value === value
          return (
            <button
              key={d.value}
              type="button"
              aria-pressed={on}
              onClick={() => onChange(d.value)}
              className={`flex h-[3.37rem] w-[2.31rem] shrink-0 flex-col items-center justify-center gap-[0.32rem] rounded-[0.5rem] px-[0.375rem] py-[0.625rem] text-[0.75rem] font-semibold ${
                on ? 'bg-hc-red' : 'bg-bg-brighter'
              }`}
            >
              <span>{d.weekday}</span>
              <span>{d.day}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}