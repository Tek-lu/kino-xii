import { useMutation, useQueryClient } from '@tanstack/react-query'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import { refundOrder } from '../../api/tickets'

export default function RefundModal({ order, onClose }) {
  const qc = useQueryClient()
  const refund = useMutation({
    mutationFn: () => refundOrder(order.reference),
    // refetch from the server instead of editing the lists locally
    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: ['tickets'] }),
        qc.invalidateQueries({ queryKey: ['sessions'] }),
        qc.invalidateQueries({ queryKey: ['movie-sessions'] }),
      ])
      onClose()
    },
  })

  return (
    <Modal title="Refund order" onClose={onClose} className="max-w-[28rem]">
      <h2 className="text-[1.5rem] font-extrabold">Refund this order?</h2>
      <p className="mt-[0.75rem] text-[0.875rem] text-tx-gray">
        {order.session.movie.title} · {order.tickets.map((t) => t.seatCode).join(', ')}. Your seats will be released.
        This cannot be undone.
      </p>
      {refund.isError && (
        <p role="alert" className="mt-[1rem] rounded-[0.5rem] bg-tint-pink px-[1rem] py-[0.75rem] text-[0.75rem] text-hc-red">
          {refund.error.message}
        </p>
      )}
      <div className="mt-[1.5rem] flex gap-[0.75rem]">
        <Button loading={refund.isPending} onClick={() => refund.mutate()}>
          Yes, refund
        </Button>
        <Button variant="ghost" disabled={refund.isPending} onClick={onClose}>
          Keep tickets
        </Button>
      </div>
    </Modal>
  )
}