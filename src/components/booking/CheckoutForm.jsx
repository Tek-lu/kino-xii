import Field from '../ui/Field'
import { formatCard, formatExpiry, formatCvv } from '../../utils/booking'

export default function CheckoutForm({ form, onSubmit }) {
  const { field } = form
  const formatted = (name, fmt) => {
    const f = field(name)
    return { ...f, onChange: (e) => f.onChange({ target: { value: fmt(e.target.value) } }) }
  }

  return (
    <form id="checkout-form" onSubmit={onSubmit} noValidate className="flex flex-col gap-[1rem]">
      <Field label="Full name" autoComplete="name" {...field('fullName')} />
      <div className="grid grid-cols-2 gap-[1rem]">
        <Field label="Email" type="email" autoComplete="email" {...field('email')} />
        <Field label="Mobile number" inputMode="tel" autoComplete="tel" {...field('mobileNumber')} />
      </div>
      <hr className="border-tint-white" />
      <Field
        label="Card number"
        inputMode="numeric"
        autoComplete="cc-number"
        placeholder="e.g. 1234 4567 8901 2345"
        {...formatted('cardNumber', formatCard)}
      />
      <div className="grid grid-cols-2 gap-[1rem]">
        <Field label="Expiry" inputMode="numeric" autoComplete="cc-exp" placeholder="e.g. 12/34" {...formatted('expiry', formatExpiry)} />
        <Field label="CVV" inputMode="numeric" autoComplete="cc-csc" placeholder="e.g. 123" {...formatted('cvv', formatCvv)} />
      </div>
    </form>
  )
}