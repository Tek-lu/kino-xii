import { useEffect, useMemo, useRef, useState } from 'react'
import Modal from '../ui/Modal'
import Field from '../ui/Field'
import Button from '../ui/Button'
import { useForm } from '../../hooks/useForm'
import { useAuth } from '../../hooks/useAuth'
import { register } from '../../api/auth'
import { emailRule, passwordRule, required } from '../../utils/validators'
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp']

const rules = {
  username: (v) =>
    !v?.trim() ? 'Username is required' : v.trim().length < 3 ? 'Username must be at least 3 characters' : undefined,
  email: emailRule,
  password: passwordRule,
  password_confirmation: (v, all) =>
    !v ? 'Please confirm your password' : v !== all.password ? 'Passwords do not match' : undefined,
}

export default function RegisterModal() {
  const { closeModal, openModal, onAuthSuccess } = useAuth()
  const { values, field, validateAll, applyApiErrors } = useForm(
    { username: '', email: '', password: '', password_confirmation: '' },
    rules,
  )
  const [avatar, setAvatar] = useState(null)
  const [avatarError, setAvatarError] = useState('')
  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState('')
  const inFlight = useRef(false)

  const preview = useMemo(() => (avatar ? URL.createObjectURL(avatar) : null), [avatar])
  useEffect(() => () => preview && URL.revokeObjectURL(preview), [preview])

  async function onPick(e) {
    const input = e.target
    const file = input.files?.[0]
    input.value = '' // otherwise picking the same file again does nothing
    if (!file) return
    if (!ALLOWED.includes(file.type)) {
      setAvatar(null)
      setAvatarError('Avatar must be a JPG, PNG or WebP image')
      return
    }
    try {
      setAvatar(await shrinkImage(file))
      setAvatarError('')
    } catch {
    }
  }

  async function onSubmit(e) {
    e.preventDefault()
    if (inFlight.current || !validateAll()) return
      inFlight.current = true
      setLoading(true)
      setFormError('')
      setAvatarError('')
    try {
      const fd = new FormData()
      Object.entries(values).forEach(([k, v]) => fd.append(k, v))
      if (avatar) fd.append('avatar', avatar)
      const res = await register(fd)
      onAuthSuccess(res.data)
    } catch (err) {
      if (err.errors) {
        applyApiErrors(err.errors) // username / email uniqueness land on their fields
        if (err.errors.avatar) setAvatarError(err.errors.avatar[0])
      } else setFormError(err.message)
    } finally {
      inFlight.current = false
      setLoading(false)
    }
  }

  return (
    <Modal title="Sign Up" onClose={closeModal}>
      <h2 className="mb-6 text-[24px] font-extrabold">Sign Up</h2>
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
        {formError && (
          <p role="alert" className="rounded-lg bg-tint-pink px-4 py-3 text-[13px] text-hc-red">
            {formError}
          </p>
        )}
        <Field label="Username" autoComplete="username" placeholder="jane99" {...field('username')} />
        <Field label="Email" type="email" autoComplete="email" placeholder="you@example.com" {...field('email')} />
        <Field label="Password" type="password" autoComplete="new-password" placeholder="Password" {...field('password')} />
        <Field label="Confirm Password" type="password" autoComplete="new-password" placeholder="Confirm password" {...field('password_confirmation')} />

        <div>
          <span className="mb-1.5 block text-[12px] font-semibold text-tx-gray">Avatar (optional)</span>
          <label className="flex cursor-pointer items-center gap-4 rounded-lg bg-bg-brighter px-4 py-3">
            {preview ? (
              <img src={preview} alt="Avatar preview" className="h-12 w-12 rounded-full object-cover" />
            ) : (
              <span className="grid h-12 w-12 place-items-center rounded-full bg-tint-white text-tx-gray">+</span>
            )}
            <span className="text-[13px] text-tx-gray">{avatar ? avatar.name : 'JPG, PNG or WebP, max 2MB'}</span>
            <input type="file" accept=".jpg,.jpeg,.png,.webp" onChange={onPick} className="sr-only" />
          </label>
          {avatarError && <p className="mt-1 text-[12px] text-hc-red">{avatarError}</p>}
        </div>

        <Button type="submit" loading={loading} className="mt-2 w-full py-3">
          Sign Up
        </Button>
      </form>
      <p className="mt-5 text-center text-[13px] text-tx-gray">
        Already have an account?{' '}
        <button type="button" onClick={() => openModal('login')} className="font-semibold text-tx-white hover:underline">
          Log In
        </button>
      </p>
    </Modal>
  )
}