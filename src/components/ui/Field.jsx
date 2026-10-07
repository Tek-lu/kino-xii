import { useId } from 'react'

export default function Field({ label, error, valid, className = '', ...input }) {
  const id = useId()
  const border = error
    ? 'border-hc-red'
    : valid
      ? 'border-hc-green'
      : 'border-transparent focus:border-tx-blue'

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-[12px] font-semibold text-tx-gray">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          aria-invalid={!!error}
          className={`w-full rounded-lg border bg-bg-brighter px-4 py-3 text-[14px] font-normal text-tx-white outline-none placeholder:text-tx-blue disabled:opacity-50 ${border}`}
          {...input}
        />
        {valid && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-hc-green" aria-hidden="true">
            ✓
          </span>
        )}
      </div>
      {error && <p className="mt-1 text-[12px] font-normal text-hc-red">{error}</p>}
    </div>
  )
}