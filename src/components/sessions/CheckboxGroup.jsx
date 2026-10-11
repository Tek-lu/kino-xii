// options: [{ value, label, hint? }]
export default function CheckboxGroup({ title, options, selected, onToggle }) {
    return (
      <div className="border-b border-bg-brighter pb-[1.5rem]">
        <span className="text-[0.75rem] font-semibold text-tx-gray">{title}</span>
        <div className="mt-[0.5rem] flex flex-col gap-[0.35rem]">
          {options.map((o) => (
            <label key={o.value} className="flex items-center gap-[0.32rem]">
              <input
                type="checkbox"
                className="checkbox-custom"
                checked={selected.includes(o.value)}
                onChange={() => onToggle(o.value)}
              />
              <span className="text-[0.875rem] font-semibold">{o.label}</span>
              {o.hint && <span className="text-[0.75rem] font-normal text-tx-gray">{'• ' + o.hint}</span>}
            </label>
          ))}
        </div>
      </div>
    )
  }