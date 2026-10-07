import { useRef, useState } from 'react'
import Modal from '../ui/Modal'
import Field from '../ui/Field'
import Button from '../ui/Button'
import { useForm } from '../../hooks/useForm'
import { useAuth } from '../../hooks/useAuth'
import { login } from '../../api/auth'
import { emailRule, passwordRule } from '../../utils/validators'

const rules = { email: emailRule, password: passwordRule }

export default function LoginModal() {
  const { closeModal, openModal, onAuthSuccess } = useAuth()
  const { values, field, validateAll, applyApiErrors } = useForm({ email: '', password: '' }, rules)
  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState('')
  const inFlight = useRef(false)

  async function onSubmit(e) {
    e.preventDefault()
    if (inFlight.current || !validateAll()) return
    inFlight.current = true
    setLoading(true)
    setFormError('')
    try {
      const res = await login(values)
      onAuthSuccess(res.data)
    } catch (err) {
      if (err.errors) applyApiErrors(err.errors)
      else setFormError(err.message) // 401: wrong credentials, modal stays open
    } finally {
      inFlight.current = false
      setLoading(false)
    }
  }

  return (
    <Modal title="Log In" onClose={closeModal}>
      <h2 className="mb-6 text-[24px] font-extrabold">Log In</h2>
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
        {formError && (
          <p role="alert" className="rounded-lg bg-tint-pink px-4 py-3 text-[13px] text-hc-red">
            {formError}
          </p>
        )}
        <Field label="Email" type="email" autoComplete="email" placeholder="you@example.com" {...field('email')} />
        <Field label="Password" type="password" autoComplete="current-password" placeholder="Password" {...field('password')} />
        <Button type="submit" loading={loading} className="mt-2 w-full py-3">
          Log In
        </Button>
      </form>
      <p className="mt-5 text-center text-[13px] text-tx-gray">
        Don't have an account?{' '}
        <button type="button" onClick={() => openModal('register')} className="font-semibold text-tx-white hover:underline">
          Sign Up
        </button>
      </p>
    </Modal>
  )
}