import Button from './Button'

export default function ErrorState({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className="flex flex-col items-center gap-3 py-12 text-center">
      <p className="text-[14px] text-tx-gray">{message}</p>
      {onRetry && <Button onClick={onRetry}>Retry</Button>}
    </div>
  )
}