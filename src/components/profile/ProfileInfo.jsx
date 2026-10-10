import { useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useConfig } from '../../context/ConfigContext'
import { useAuth } from '../../hooks/useAuth'
import { useForm } from '../../hooks/useForm'
import { updateProfile } from '../../api/profile'
import { toDateValue } from '../../utils/dates'
import { nameRule, mobileRule, dobRule } from '../../utils/validators'
import Field from '../ui/Field'
import Button from '../ui/Button'

const rules = { fullName: nameRule, mobileNumber: mobileRule, dateOfBirth: dobRule }
const strip = (v) => (v ?? '').replace(/\s/g, '')

function eligibility(age) {
  if (age == null) return 'Add your date of birth to see which films you can book.'
  if (age < 16) return `You are ${age}, you cannot buy tickets for 16+ or 18+ titles.`
  if (age < 18) return `You are ${age}, you cannot buy tickets for 18+ titles.`
  return `You are ${age}, you can buy tickets for all age ratings.`
}

export default function ProfileInfo() {
  const { user, setUser } = useAuth()
  const { venues } = useConfig()
  const { state } = useLocation()
  const { values, field, validateAll, applyApiErrors } = useForm(
    {
      fullName: user.fullName ?? '',
      mobileNumber: user.mobileNumber ?? '',
      dateOfBirth: user.dateOfBirth ?? '',
      preferredVenueId: user.preferredVenue?.id ? String(user.preferredVenue.id) : '',
    },
    rules,
  )
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [formError, setFormError] = useState('')
  const inFlight = useRef(false)

  const venueId = user.preferredVenue?.id ? String(user.preferredVenue.id) : ''
  const dirty =
    values.fullName.trim() !== (user.fullName ?? '') ||
    strip(values.mobileNumber) !== (user.mobileNumber ?? '') ||
    values.dateOfBirth !== (user.dateOfBirth ?? '') ||
    values.preferredVenueId !== venueId
  const valid = Object.keys(rules).every((k) => !rules[k](values[k], values))

  async function onSubmit(e) {
    e.preventDefault()
    if (inFlight.current || !dirty || !validateAll()) return
    inFlight.current = true
    setLoading(true)
    setFormError('')
    setSaved(false)
    try {
      const fd = new FormData()
      fd.append('fullName', values.fullName.trim())
      fd.append('mobileNumber', strip(values.mobileNumber))
      fd.append('dateOfBirth', values.dateOfBirth)
      if (values.preferredVenueId) fd.append('preferredVenueId', values.preferredVenueId)
      const updated = await updateProfile(fd)
      setUser(updated) // server response is the truth: navbar dot updates from this
      setSaved(true)
    } catch (err) {
      if (err.errors) applyApiErrors(err.errors)
      else setFormError(err.message)
    } finally {
      inFlight.current = false
      setLoading(false)
    }
  }

  const venue = field('preferredVenueId')

  return (
    <form onSubmit={onSubmit} noValidate className="flex w-[55rem] flex-col gap-y-[1.25rem] pt-[0.5rem]">
      {user.profileComplete ? (
        <p className="w-fit rounded-[0.5rem] bg-tint-green px-[1rem] py-[0.5rem] text-[0.75rem] font-semibold text-hc-green">
          Profile Complete ✓
        </p>
      ) : (
        <p role="alert" className="rounded-[0.5rem] bg-hc-orange/10 px-[1rem] py-[0.75rem] text-[0.75rem] font-semibold text-hc-orange">
          {state?.notice ?? 'Please complete your profile to enable booking.'}
        </p>
      )}

      {formError && (
        <p role="alert" className="rounded-[0.5rem] bg-tint-pink px-[1rem] py-[0.75rem] text-[0.75rem] text-hc-red">
          {formError}
        </p>
      )}

      <Field label="Full name" autoComplete="name" {...field('fullName')} />

      <div>
        <Field label="Email" type="email" value={user.email} disabled readOnly />
        <p className="mt-[0.5rem] text-[0.75rem] text-tx-gray">Set at registration and cannot be changed</p>
      </div>

      <Field label="Mobile number" inputMode="tel" autoComplete="tel" placeholder="5XX XXX XXX" {...field('mobileNumber')} />

      <div>
        <Field label="Date of birth" type="date" max={toDateValue(new Date())} {...field('dateOfBirth')} />
        <p className="mt-[0.5rem] text-[0.75rem] text-tx-gray">{eligibility(user.age)}</p>
      </div>

      <div>
        <label htmlFor="venue" className="mb-1.5 block text-[12px] font-semibold text-tx-gray">
          Preferred Venue (Optional)
        </label>
        <select
          id="venue"
          name="preferredVenueId"
          value={venue.value}
          onChange={venue.onChange}
          className="w-full rounded-lg bg-bg-brighter px-4 py-3 text-[14px] outline-none"
        >
          <option value="">No preference</option>
          {venues.map((v) => (
            <option key={v.id} value={v.id}>
              {v.name} · {v.city}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-[1rem]">
        <Button type="submit" loading={loading} disabled={!dirty || !valid} className="px-[1.5rem] py-[0.75rem]">
          Save changes
        </Button>
        {saved && !dirty && <span className="text-[0.75rem] text-hc-green">Saved ✓</span>}
      </div>
    </form>
  )
}