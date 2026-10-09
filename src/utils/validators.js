const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const required = (label) => (v) => (!v?.trim() ? `${label} is required` : undefined)

export const emailRule = (v) =>
  !v ? 'Email is required' : !EMAIL_RE.test(v) ? 'Please enter a valid email address' : undefined

export const passwordRule = (v) =>
  !v ? 'Password is required' : v.length < 3 ? 'Password must be at least 3 characters' : undefined

  export const nameRule = (v) =>
  !v?.trim() ? 'Name is required'
  : v.trim().length < 3 ? 'Name must be at least 3 characters'
  : v.trim().length > 50 ? 'Name must not exceed 50 characters'
  : undefined

export const mobileRule = (v) => {
  const d = (v ?? '').replace(/\s/g, '')
  if (!d) return 'Mobile number is required'
  if (!/^\d+$/.test(d)) return 'Please enter a valid Georgian mobile number (9 digits starting with 5)'
  if (d[0] !== '5') return 'Georgian mobile numbers must start with 5'
  if (d.length !== 9) return 'Mobile number must be exactly 9 digits'
}

export const cardRule = (v) => {
  const d = (v ?? '').replace(/\s/g, '')
  return !d ? 'Card number is required' : !/^\d{16}$/.test(d) ? 'Card number must be 16 digits' : undefined
}

export const expiryRule = (v) => {
  if (!v) return 'Expiry is required'
  const m = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(v)
  if (!m) return 'Use MM/YY format'
  const firstOfNextMonth = new Date(2000 + Number(m[2]), Number(m[1]), 1)
  return firstOfNextMonth <= new Date() ? 'Card has expired' : undefined
}

export const cvvRule = (v) =>
  !v ? 'CVV is required' : !/^\d{3}$/.test(v) ? 'CVV must be 3 digits' : undefined