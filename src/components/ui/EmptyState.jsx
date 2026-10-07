export default function EmptyState({ title, text, action }) {
    return (
      <div className="flex flex-col items-center gap-2 py-12 text-center">
        <h3 className="text-[16px] font-semibold">{title}</h3>
        {text && <p className="max-w-sm text-[14px] text-tx-gray">{text}</p>}
        {action && <div className="mt-3">{action}</div>}
      </div>
    )
  }