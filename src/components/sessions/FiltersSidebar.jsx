import { useConfig } from '../../context/ConfigContext'
import toggle from '../../utils/toggle'
import venueFormat from '../../utils/venueFormat'
import CheckboxGroup from './CheckboxGroup'
import FilterDates from './FilterDates'

// "Morning (before 12:00)" -> label "Morning", hint "before 12:00"
function bandOption(t) {
  const m = t.label.match(/^(.*?)\s*\((.*)\)$/)
  return { value: t.id, label: m ? m[1] : t.label, hint: m?.[2] }
}

export default function FiltersSidebar({ filters }) {
  const { venues, formats, languages, timeBands } = useConfig()

  const availableFormats = filters.venue.length > 0 ? venueFormat(venues, filters.venue) : formats

  // changing venues also drops selected formats those venues don't offer
  const onToggleVenue = (slug) => {
    const nextVenues = toggle(filters.venue, slug)
    const allowed = nextVenues.length > 0 ? venueFormat(venues, nextVenues) : formats
    const allowedSlugs = allowed.map((f) => f.slug)
    filters.update({
      venue: nextVenues,
      format: filters.format.filter((s) => allowedSlugs.includes(s)),
    })
  }

  const activeCount =
    filters.venue.length + filters.format.length + filters.language.length + filters.band.length

  return (
    <div className="sticky top-3 flex w-[20rem] flex-col gap-y-[1.5rem] rounded-[1rem] bg-bg-medium p-[1.5rem]">
      <h3 className="text-[1.125rem] font-extrabold">Filters</h3>

      <CheckboxGroup
        title="VENUE"
        options={venues.map((v) => ({ value: v.slug, label: v.name, hint: v.city }))}
        selected={filters.venue}
        onToggle={onToggleVenue}
      />

      <FilterDates value={filters.date} onChange={(date) => filters.update({ date })} />

      <CheckboxGroup
        title="FORMAT"
        options={availableFormats.map((f) => ({ value: f.slug, label: f.name }))}
        selected={filters.format}
        onToggle={(v) => filters.update({ format: toggle(filters.format, v) })}
      />

      <CheckboxGroup
        title="LANGUAGE"
        options={languages.map((l) => ({ value: l.slug, label: l.name }))}
        selected={filters.language}
        onToggle={(v) => filters.update({ language: toggle(filters.language, v) })}
      />

      <CheckboxGroup
        title="TIME OF DAY"
        options={timeBands.map(bandOption)}
        selected={filters.band}
        onToggle={(v) => filters.update({ band: toggle(filters.band, v) })}
      />

      <div className="flex flex-col items-center gap-y-[0.75rem]">
        <button
          type="button"
          disabled={activeCount === 0}
          onClick={() => filters.update({ venue: [], format: [], language: [], band: [] })}
          className="w-[17rem] rounded-[99px] border border-tx-gray px-[12px] py-[9px] text-xs font-semibold disabled:opacity-40"
        >
          Clear filters
        </button>
        <p className="text-xs font-normal text-tx-gray">{activeCount} filters active</p>
      </div>
    </div>
  )
}